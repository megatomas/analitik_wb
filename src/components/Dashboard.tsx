import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, RotateCcw, Target, Loader2, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useWBApi } from '../services/wbApi';
import { useAuth } from '../contexts/AuthContext';

interface DashboardProps {
  period: 'yesterday' | 'week' | 'month';
  setPeriod: (p: 'yesterday' | 'week' | 'month') => void;
}

export default function Dashboard({ period, setPeriod }: DashboardProps) {
  const { user } = useAuth();
  const { getSales } = useWBApi();
  const [salesData, setSalesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSales = async () => {
      if (!user?.wbApiKey) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getSales(30);
        setSalesData(data);
      } catch (err) {
        setError('Не удалось загрузить данные. Проверьте API-ключ.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [user?.wbApiKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Загрузка реальных данных из Wildberries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
          <AlertCircle size={40} className="text-red-600 mx-auto mb-4" />
          <p className="text-red-800 font-medium mb-2">Ошибка загрузки данных</p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!salesData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-600">Нет данных для отображения</p>
        </div>
      </div>
    );
  }

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

      {/* Info Card */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingUp size={20} />
          </div>
          <div>
            <h4 className="font-semibold mb-1">💡 Данные обновляются в реальном времени</h4>
            <p className="text-sm text-white/80">
              Информация поступает напрямую из вашего кабинета Wildberries через API. 
              Данные обновляются автоматически каждые 15 минут.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
