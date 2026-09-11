import { useAuth } from '../contexts/AuthContext';

const WB_API_BASE = 'https://statistics-api.wildberries.ru/api/v1';

// Кэш в памяти
const memoryCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 минут (увеличил для снижения нагрузки на WB API)

export interface SalesData {
  revenue: number;
  orders: number;
  avgCheck: number;
  returns: number;
  conversion: number;
}

export interface SalesResponse {
  yesterday: SalesData;
  week: SalesData;
  month: SalesData;
}

export interface StockRecommendation {
  productId: number;
  productName: string;
  currentStock: number;
  dailySales: number;
  daysUntilStockout: number;
  recommendedOrder: number;
  urgency: 'critical' | 'warning' | 'ok';
  reason: string;
}

export interface ApiError {
  message: string;
  details?: string;
  status?: number;
}

function getCached<T>(key: string): T | null {
  const cached = memoryCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }
  return null;
}

function setCache(key: string, data: any) {
  memoryCache.set(key, { data, timestamp: Date.now() });
}

export function useWBApi() {
  const { user } = useAuth();

  const fetchFromWB = async (endpoint: string): Promise<any> => {
    if (!user?.wbApiKey) {
      throw { message: 'API ключ не настроен', status: 401 };
    }

    const cacheKey = `${user.id}_${endpoint}`;
    const cached = getCached(cacheKey);
    if (cached) {
      console.log(`[WB API] Кэш: ${endpoint}`);
      return cached;
    }

    console.log(`[WB API] Запрос: ${endpoint}`);

    try {
      // Пытаемся через наш серверный прокси (Vercel Functions)
      const response = await fetch(`/api/wb-proxy?endpoint=${encodeURIComponent(endpoint)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.wbApiKey}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(`[WB API] Статус: ${response.status}`);

      // Проверяем что серверная функция работает
      if (response.status === 404) {
        throw {
          message: 'Сервер не настроен',
          details: 'Серверные функции Vercel ещё не развернулись. Подождите 2-3 минуты после push или проверьте логи в Vercel Dashboard → Functions.',
          status: 404,
        };
      }

      if (response.status === 429) {
        throw {
          message: 'Превышен лимит запросов WB API',
          details: 'Wildberries ограничивает частоту запросов. Подождите 1-2 минуты.',
          status: 429,
        };
      }

      if (response.status === 401) {
        throw {
          message: 'Неверный API-ключ',
          details: 'Ключ недействителен или отозван. Создайте новый в кабинете WB.',
          status: 401,
        };
      }

      if (response.status === 403) {
        throw {
          message: 'Нет доступа',
          details: 'У ключа нет прав на этот раздел. Отметьте "Статистика" и "Аналитика" при создании ключа.',
          status: 403,
        };
      }

      if (!response.ok) {
        const text = await response.text();
        throw {
          message: `Ошибка WB API: ${response.status}`,
          details: text,
          status: response.status,
        };
      }

      const data = await response.json();
      setCache(cacheKey, data);
      return data;
    } catch (error: any) {
      if (error.status) throw error;
      
      // CORS или сетевая ошибка
      if (error.message?.includes('Failed to fetch') || error.message?.includes('CORS')) {
        throw {
          message: 'Ошибка сети',
          details: 'Не удалось подключиться к WB API. Проверьте интернет или попробуйте позже.',
          status: 0,
        };
      }
      
      throw {
        message: 'Неизвестная ошибка',
        details: error.message,
        status: 0,
      };
    }
  };

  const getSales = async (): Promise<SalesResponse> => {
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - 60);
    const dateFromStr = dateFrom.toISOString().split('T')[0];

    const sales = await fetchFromWB(`/api/v1/supplier/sales?dateFrom=${dateFromStr}`);

    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const calculateMetrics = (salesData: any[]): SalesData => {
      const revenue = salesData.reduce((sum, s) => sum + (s.retailPriceWithDiscRub || s.retailPrice || 0), 0);
      const orders = salesData.length;
      const avgCheck = orders > 0 ? revenue / orders : 0;
      const returns = salesData.filter((s) => s.isCancel === true || s.isReturn === true).length;
      const conversion = 4.2; // Средняя конверсия

      return {
        revenue: Math.round(revenue),
        orders,
        avgCheck: Math.round(avgCheck),
        returns,
        conversion,
      };
    };

    const yesterdaySales = sales.filter((s: any) => {
      const d = new Date(s.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === yesterday.getTime();
    });

    const weekSales = sales.filter((s: any) => new Date(s.date) >= weekAgo);

    return {
      yesterday: calculateMetrics(yesterdaySales),
      week: calculateMetrics(weekSales),
      month: calculateMetrics(sales),
    };
  };

  const getStockRecommendations = async (): Promise<StockRecommendation[]> => {
    // Получаем остатки
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - 1);
    const dateFromStr = dateFrom.toISOString().split('T')[0];

    const [stocks, sales] = await Promise.all([
      fetchFromWB(`/api/v1/supplier/stocks?dateFrom=${dateFromStr}`),
      fetchFromWB(`/api/v1/supplier/sales?dateFrom=${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`),
    ]);

    // Группируем остатки по товарам
    const productStocks = new Map<number, any>();
    stocks.forEach((stock: any) => {
      const key = stock.nmId;
      if (!productStocks.has(key)) {
        productStocks.set(key, {
          nmId: stock.nmId,
          subject: stock.subject || 'Без названия',
          brand: stock.brand || '',
          totalStock: 0,
        });
      }
      const product = productStocks.get(key);
      product.totalStock += stock.quantity || 0;
    });

    // Считаем продажи по товарам
    const productSales = new Map<number, number>();
    sales.forEach((sale: any) => {
      const key = sale.nmId;
      productSales.set(key, (productSales.get(key) || 0) + 1);
    });

    // Формируем рекомендации
    return Array.from(productStocks.values())
      .map((product: any) => {
        const salesCount = productSales.get(product.nmId) || 0;
        const dailySales = salesCount / 30;
        const daysUntilStockout = dailySales > 0 
          ? Math.floor(product.totalStock / dailySales) 
          : 999;

        let urgency: 'critical' | 'warning' | 'ok' = 'ok';
        let recommendedOrder = 0;
        let reason = '';

        if (daysUntilStockout <= 3) {
          urgency = 'critical';
          recommendedOrder = Math.ceil(dailySales * 14);
          reason = `Критический остаток! Хватит на ${daysUntilStockout} ${daysUntilStockout === 1 ? 'день' : daysUntilStockout < 5 ? 'дня' : 'дней'}`;
        } else if (daysUntilStockout <= 7) {
          urgency = 'warning';
          recommendedOrder = Math.ceil(dailySales * 14);
          reason = `Рекомендуется пополнить. Хватит на ${daysUntilStockout} дней`;
        } else {
          reason = `Достаточный запас на ${Math.min(daysUntilStockout, 999)} дней`;
        }

        return {
          productId: product.nmId,
          productName: `${product.subject}${product.brand ? ` (${product.brand})` : ''}`,
          currentStock: product.totalStock,
          dailySales: Math.round(dailySales * 10) / 10,
          daysUntilStockout: Math.min(daysUntilStockout, 999),
          recommendedOrder,
          urgency,
          reason,
        };
      })
      .filter((item: any) => item.currentStock > 0)
      .sort((a: any, b: any) => a.daysUntilStockout - b.daysUntilStockout)
      .slice(0, 20);
  };

  return {
    getSales,
    getStockRecommendations,
  };
}
