import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const categoryData = [
  { name: 'Обувь', value: 1539000, percent: 32 },
  { name: 'Сумки', value: 867000, percent: 18 },
  { name: 'Часы', value: 1188000, percent: 25 },
  { name: 'Одежда', value: 567000, percent: 12 },
  { name: 'Аксессуары', value: 435000, percent: 9 },
  { name: 'Прочее', value: 198000, percent: 4 },
];

const COLORS = ['#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#6366f1'];

const conversionData = [
  { day: 'Пн', value: 3.8 },
  { day: 'Вт', value: 4.1 },
  { day: 'Ср', value: 3.9 },
  { day: 'Чт', value: 4.5 },
  { day: 'Пт', value: 4.8 },
  { day: 'Сб', value: 5.1 },
  { day: 'Вс', value: 4.2 },
];

const competitorsData = [
  { name: 'Вы', sales: 4102, fill: '#8b5cf6' },
  { name: 'Конкурент A', sales: 3800, fill: '#e5e7eb' },
  { name: 'Конкурент B', sales: 2900, fill: '#e5e7eb' },
  { name: 'Конкурент C', sales: 2100, fill: '#e5e7eb' },
  { name: 'Конкурент D', sales: 1800, fill: '#e5e7eb' },
];

const metrics = [
  { label: 'Конверсия карточек', value: '4.2%', change: '+0.3%', positive: true },
  { label: 'Позиция в поиске', value: '#12', change: '+3', positive: true },
  { label: 'Рейтинг магазина', value: '4.8', change: '+0.1', positive: true },
  { label: 'Процент выкупа', value: '87%', change: '-2%', positive: false },
  { label: 'Среднее время доставки', value: '2.3 дн.', change: '-0.5', positive: true },
  { label: 'Доля возвратов', value: '7.3%', change: '+1.2%', positive: false },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Аналитика</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">{m.label}</p>
            <p className="text-xl font-bold text-gray-800">{m.value}</p>
            <span className={`text-xs font-medium flex items-center gap-0.5 ${m.positive ? 'text-green-600' : 'text-red-500'}`}>
              {m.positive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
              {m.change}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Распределение по категориям</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${(value / 1000).toFixed(0)}K ₽`]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2">
            {categoryData.map((cat, i) => (
              <div key={cat.name} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                <span className="text-xs text-gray-600">{cat.name} ({cat.percent}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Конверсия по дням</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} domain={[3, 6]} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => [`${value}%`, 'Конверсия']}
              />
              <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Competitors */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Позиция среди конкурентов (продажи за месяц)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={competitorsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#9ca3af" fontSize={12} />
              <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={12} width={100} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => [value.toLocaleString(), 'Продажи']}
              />
              <Bar dataKey="sales" radius={[0, 6, 6, 0]}>
                {competitorsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
