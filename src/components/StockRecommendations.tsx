import { useState, useEffect } from 'react';
import { AlertTriangle, Package, TrendingUp, CheckCircle, Clock, Truck, Loader2, AlertCircle, Warehouse, Info } from 'lucide-react';
import { useWBApi } from '../services/wbApi';
import { useAuth } from '../contexts/AuthContext';

export default function StockRecommendations() {
  const { user } = useAuth();
  const { getStockRecommendations } = useWBApi();
  const [stockRecommendations, setStockRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStocks = async () => {
      if (!user?.wbApiKey) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getStockRecommendations();
        setStockRecommendations(data);
      } catch (err: any) {
        setError(err.message || 'Не удалось загрузить данные об остатках.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, [user?.wbApiKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Анализируем остатки на складах WB и продавца...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
          <AlertCircle size={40} className="text-red-600 mx-auto mb-4" />
          <p className="text-red-800 font-medium mb-2">Ошибка загрузки</p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const critical = stockRecommendations.filter((r) => r.urgency === 'critical');
  const warning = stockRecommendations.filter((r) => r.urgency === 'warning');
  const ok = stockRecommendations.filter((r) => r.urgency === 'ok');

  const totalToOrder = stockRecommendations.reduce((sum, r) => sum + r.recommendedOrder, 0);
  const totalStockWB = stockRecommendations.reduce((sum, r) => sum + r.currentStockWB, 0);
  const totalStockSeller = stockRecommendations.reduce((sum, r) => sum + r.currentStockSeller, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Рекомендации по пополнению</h2>
        <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-xl">
          <Truck size={18} className="text-purple-600" />
          <span className="text-sm font-medium text-purple-700">К заказу: {totalToOrder} шт.</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl p-5 border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={18} className="text-red-600" />
            <span className="text-sm font-semibold text-red-700">Критично</span>
          </div>
          <p className="text-3xl font-bold text-red-800">{critical.length}</p>
          <p className="text-xs text-red-600 mt-1">Товаров требуют немедленного пополнения</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-2xl p-5 border border-yellow-200">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={18} className="text-yellow-600" />
            <span className="text-sm font-semibold text-yellow-700">Внимание</span>
          </div>
          <p className="text-3xl font-bold text-yellow-800">{warning.length}</p>
          <p className="text-xs text-yellow-600 mt-1">Рекомендуется пополнить на этой неделе</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-5 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={18} className="text-green-600" />
            <span className="text-sm font-semibold text-green-700">В норме</span>
          </div>
          <p className="text-3xl font-bold text-green-800">{ok.length}</p>
          <p className="text-xs text-green-600 mt-1">Достаточный запас</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-5 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Warehouse size={18} className="text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">Общий остаток</span>
          </div>
          <p className="text-3xl font-bold text-blue-800">{totalStockWB + totalStockSeller}</p>
          <p className="text-xs text-blue-600 mt-1">WB: {totalStockWB} | Продавец: {totalStockSeller}</p>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-3">
        {stockRecommendations.map((rec) => (
          <div
            key={rec.productId}
            className={`bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition-all ${
              rec.urgency === 'critical'
                ? 'border-red-200 border-l-4 border-l-red-500'
                : rec.urgency === 'warning'
                ? 'border-yellow-200 border-l-4 border-l-yellow-500'
                : 'border-green-200 border-l-4 border-l-green-500'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Package size={16} className="text-gray-400" />
                  <h4 className="font-semibold text-gray-800">{rec.productName}</h4>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      rec.urgency === 'critical'
                        ? 'bg-red-100 text-red-700'
                        : rec.urgency === 'warning'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {rec.urgency === 'critical' ? 'Критично' : rec.urgency === 'warning' ? 'Внимание' : 'OK'}
                  </span>
                </div>
                
                {/* Информация об артикулах */}
                <div className="space-y-1 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 min-w-[120px]">WB артикул:</span>
                    <span className="text-xs font-mono font-medium text-gray-700">{rec.productId}</span>
                  </div>
                  {rec.vendorCode && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 min-w-[120px]">Артикул продавца:</span>
                      <span className="text-xs font-mono font-medium text-gray-700">{rec.vendorCode}</span>
                    </div>
                  )}
                  {rec.barcode && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 min-w-[120px]">Баркод:</span>
                      <span className="text-xs font-mono font-medium text-gray-700">{rec.barcode}</span>
                    </div>
                  )}
                  {!rec.vendorCode && !rec.barcode && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-amber-600 min-w-[120px]">ℹ️ Информация:</span>
                      <span className="text-xs text-amber-600">Добавьте категорию "Контент" в токен для отображения названия и артикула продавца</span>
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-gray-500">{rec.reason}</p>
              </div>

              <div className="flex items-center gap-6">
                {/* Остаток на складе WB */}
                <div className="text-center">
                  <p className="text-xs text-gray-400">Склад WB</p>
                  <p className={`text-lg font-bold ${rec.currentStockWB === 0 ? 'text-red-600' : 'text-gray-800'}`}>
                    {rec.currentStockWB}
                  </p>
                </div>

                {/* Остаток на складе продавца */}
                <div className="text-center">
                  <p className="text-xs text-gray-400">Склад продавца</p>
                  <p className={`text-lg font-bold ${rec.currentStockSeller === 0 ? 'text-red-600' : 'text-gray-800'}`}>
                    {rec.currentStockSeller}
                  </p>
                </div>

                {/* Общий остаток */}
                <div className="text-center">
                  <p className="text-xs text-gray-400">Всего</p>
                  <p className="text-lg font-bold text-purple-700">{rec.totalStock}</p>
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-400">Продаж/день</p>
                  <p className="text-lg font-bold text-gray-800">{rec.dailySales}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Хватит на</p>
                  <p className={`text-lg font-bold ${rec.daysUntilStockout <= 3 ? 'text-red-600' : 'text-gray-800'}`}>
                    {rec.daysUntilStockout} дн.
                  </p>
                </div>
                {rec.recommendedOrder > 0 && (
                  <div className="bg-purple-50 rounded-xl px-4 py-2 text-center">
                    <p className="text-[10px] text-purple-500 font-medium">Заказать</p>
                    <p className="text-lg font-bold text-purple-700">{rec.recommendedOrder}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    rec.urgency === 'critical'
                      ? 'bg-gradient-to-r from-red-400 to-red-600'
                      : rec.urgency === 'warning'
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                      : 'bg-gradient-to-r from-green-400 to-green-600'
                  }`}
                  style={{ width: `${Math.min((rec.totalStock / (rec.dailySales * 14)) * 100, 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-400">
                {Math.round((rec.totalStock / (rec.dailySales * 14)) * 100)}% от нормы
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Insight */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingUp size={20} />
          </div>
          <div>
            <h4 className="font-semibold mb-1">💡 Рекомендация ИИ-аналитика</h4>
            <p className="text-sm text-white/80">
              На основе анализа остатков на складах WB и продавца, а также заказов со всех складов, рекомендуется равномерно распределить товары между складами для оптимизации доставки. Обратите внимание на товары с нулевым остатком — их нужно срочно пополнить.
            </p>
          </div>
        </div>
      </div>

      {/* Info about data sources */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Info size={16} className="text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-1">ℹ️ Источники данных</h4>
            <p className="text-xs text-blue-800">
              Рекомендации рассчитываются на основе остатков на складах WB и продавца, а также заказов со всех складов за последние 30 дней. Данные обновляются автоматически каждые 10 минут.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
