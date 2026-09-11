import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, RotateCcw, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { salesData, revenueChart, topProducts } from '../data/mockData';

interface DashboardProps {
  period: 'yesterday' | 'week' | 'month';
  setPeriod: (p: 'yesterday' | 'week' | 'month') => void;
}

export default function Dashboard({ period, setPeriod }: DashboardProps) {
  const data = salesData[period];

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
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Сводка продаж</h2>
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
    </div>
  );
}
