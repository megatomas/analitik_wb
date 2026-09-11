import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, RotateCcw, Target, Loader2, AlertCircle, Info, Eye, EyeOff } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useWBApi } from '../services/wbApi';
import { useAuth } from '../contexts/AuthContext';
import { salesData, revenueChart, topProducts } from '../data/mockData';

interface DashboardProps {
  period: 'yesterday' | 'week' | 'month';
  setPeriod: (p: 'yesterday' | 'week' | 'month') => void;
}

export default function Dashboard({ period, setPeriod }: DashboardProps) {
  const { user } = useAuth();
  const { getSales } = useWBApi();
  const [realData, setRealData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [showDemo, setShowDemo] = useState(false);
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  useEffect(() => {
    const fetchSales = async () => {
      if (!user?.wbApiKey) {
        setLoading(false);
        setShowDemo(true);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getSales();
        setRealData(data);
        setShowDemo(false);
      } catch (err: any) {
        setError(err);
        setShowDemo(true); // Показываем демо если API недоступен
        console.error('Ошибка загрузки:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [user?.wbApiKey]);

  const data = showDemo || !realData ? salesData[period] : realData[period];

  const stats = [
    {
      label: 'Выручка',
      value: `${(data.revenue / 1000).toFixed(0)}K ₽`,
      change: '+12.5%',
      positive: true,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
    },
    {
      label: 'Заказы',
      value: data.orders.toLocaleString(),
      change: '+8.3%',
      positive: true,
      icon: ShoppingCart,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      label: 'Средний чек',
      value: `${data.avgCheck} ₽`,
      change: '-2.1%',
      positive: false,
      icon: Target,
      color: 'from-purple-500 to-violet-600',
    },
    {
      label: 'Возвраты',
      value: data.returns.toString(),
      change: '+5.2%',
      positive: false,
      icon: RotateCcw,
      color: 'from-red-500 to-rose-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Demo Mode Banner */}
      {showDemo && user?.wbApiKey && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Info size={20} className="text-amber-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-amber-900 mb-1">📊 Демо-режим</h4>
              <p className="text-sm text-amber-800 mb-2">
                Не удалось загрузить реальные данные из Wildberries. Отображаются демо-данные.
              </p>
              
              {error && (
                <div className="mt-3">
                  <button
                    onClick={() => setShowErrorDetails(!showErrorDetails)}
                    className="text-xs font-medium text-amber-700 hover:text-amber-900 flex items-center gap-1"
                  >
                    {showErrorDetails ? <EyeOff size={12} /> : <Eye size={12} />}
                    {showErrorDetails ? 'Скрыть детали' : 'Показать детали ошибки'}
                  </button>
                  
                  {showErrorDetails && (
                    <div className="mt-2 bg-white/70 rounded-lg p-3 border border-amber-200">
                      <p className="text-xs font-mono text-red-700 mb-1">
                        <strong>Ошибка:</strong> {error.message}
                      </p>
                      {error.details && (
                        <p className="text-xs font-mono text-gray-700 mb-2">
                          <strong>Детали:</strong> {error.details}
                        </p>
                      )}
                      <div className="text-xs text-gray-600 space-y-1 mt-2 border-t border-amber-200 pt-2">
                        <p><strong>Возможные причины:</strong></p>
                        <ul className="list-disc pl-4 space-y-0.5">
                          <li>Серверные функции ещё не развернулись на Vercel (подождите 2-3 минуты после push)</li>
                          <li>API-ключ недействителен или отозван</li>
                          <li>У ключа нет прав на "Статистику" или "Товары"</li>
                          <li>Wildberries API временно недоступен</li>
                        </ul>
                        <p className="mt-2"><strong>Решение:</strong></p>
                        <ul className="list-disc pl-4 space-y-0.5">
                          <li>Убедитесь что запушили изменения на GitHub: <code className="bg-gray-100 px-1 rounded">git push</code></li>
                          <li>Проверьте логи в Vercel Dashboard → Functions</li>
                          <li>Проверьте права API-ключа в кабинете WB</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 size={40} className="animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600">Загрузка данных из Wildberries...</p>
            <p className="text-xs text-gray-400 mt-2">Это может занять несколько секунд</p>
          </div>
        </div>
      )}

      {!loading && (
        <>
          {/* Period Selector */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              Сводка продаж
              {showDemo && <span className="text-sm font-normal text-amber-600 ml-2">(демо)</span>}
            </h2>
            <div className="flex bg-gray-100 rounded-xl p-1">
              {[
                { id: 'yesterday' as const, label: 'Вчера' },
                { id: 'week' as const, label: 'Неделя' },
                { id: 'month' as const, label: 'Месяц' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPeriod(p.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    period === p.id
                      ? 'bg-white shadow-sm text-purple-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon size={18} className="text-white" />
                  </div>
                  <span
                    className={`flex items-center gap-1 text-xs font-medium ${
                      stat.positive ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {stat.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Динамика выручки</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueChart}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `${v / 1000}K`} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  formatter={(value: number) => [`${value.toLocaleString()} ₽`, 'Выручка']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Топ товаров</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">Товар</th>
                    <th className="pb-3 font-medium">Артикул</th>
                    <th className="pb-3 font-medium">Продажи</th>
                    <th className="pb-3 font-medium">Выручка</th>
                    <th className="pb-3 font-medium">Остаток</th>
                    <th className="pb-3 font-medium">Дней</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product) => (
                    <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-3 text-sm font-medium text-gray-800">{product.name}</td>
                      <td className="py-3 text-sm text-gray-500">{product.sku}</td>
                      <td className="py-3 text-sm text-gray-700">{product.sales}</td>
                      <td className="py-3 text-sm text-gray-700">{(product.revenue / 1000).toFixed(0)}K ₽</td>
                      <td className="py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                            product.stock < 20
                              ? 'bg-red-100 text-red-700'
                              : product.stock < 50
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {product.stock} шт.
                        </span>
                      </td>
                      <td className="py-3">
                        <span
                          className={`text-xs font-medium ${
                            product.daysLeft <= 2 ? 'text-red-600' : product.daysLeft <= 5 ? 'text-yellow-600' : 'text-green-600'
                          }`}
                        >
                          {product.daysLeft} дн.
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info Card */}
          {!showDemo && realData && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={20} className="text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-900 mb-1">✅ Реальные данные</h4>
                  <p className="text-sm text-green-800">
                    Данные загружены из вашего кабинета Wildberries и обновляются автоматически.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
