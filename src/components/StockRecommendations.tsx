import { AlertTriangle, Package, TrendingUp, CheckCircle, Clock, Truck } from 'lucide-react';
import { stockRecommendations } from '../data/mockData';

export default function StockRecommendations() {
  const critical = stockRecommendations.filter((r) => r.urgency === 'critical');
  const warning = stockRecommendations.filter((r) => r.urgency === 'warning');
  const ok = stockRecommendations.filter((r) => r.urgency === 'ok');

  const totalToOrder = stockRecommendations.reduce((sum, r) => sum + r.recommendedOrder, 0);

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <div className="flex items-center gap-2 mb-1">
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
                <p className="text-sm text-gray-500">{rec.reason}</p>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Остаток</p>
                  <p className="text-lg font-bold text-gray-800">{rec.currentStock}</p>
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
                  style={{ width: `${Math.min((rec.currentStock / (rec.dailySales * 14)) * 100, 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-400">
                {Math.round((rec.currentStock / (rec.dailySales * 14)) * 100)}% от нормы
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
              На основе анализа трендов продаж за последние 30 дней, рекомендуется увеличить общий заказ на 15%.
              Ожидается рост спроса на категорию "Обувь" в связи с началом летнего сезона. Также обратите внимание
              на товар "Футболка хлопок oversize" — его можно заказать с запасом, т.к. цена у поставщика сейчас минимальна.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
