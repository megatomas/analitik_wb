import { useAuth } from '../contexts/AuthContext';

// Кэш в памяти браузера
const memoryCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 минут

// Правильные URL для WB API
const WB_API = {
  // Остатки на складах WB — POST запрос с JSON-телом
  stocksWB: 'https://seller-analytics-api.wildberries.ru/api/analytics/v1/stocks-report/wb-warehouses',
  // Остатки на складах продавца — POST запрос
  stocksSeller: 'https://seller-analytics-api.wildberries.ru/api/analytics/v1/stocks-report/seller-warehouses',
  // Заказы и продажи (все склады) — POST запрос
  orderFeed: 'https://seller-analytics-api.wildberries.ru/api/analytics/v1/order-feed',
};

// Vercel Serverless Function прокси
const PROXY_URL = '/api/wb-proxy';

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

export interface StockItem {
  nmId: number;
  chrtId: number;
  warehouseName: string;
  regionName?: string;
  quantity: number;
  inWayToClient: number;
  inWayFromClient: number;
}

export interface StockRecommendation {
  productId: number;
  productName: string;
  currentStockWB: number;
  currentStockSeller: number;
  totalStock: number;
  dailySales: number;
  daysUntilStockout: number;
  recommendedOrder: number;
  urgency: 'critical' | 'warning' | 'ok';
  reason: string;
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

  // Универсальная функция для запросов через Vercel proxy
  const fetchViaProxy = async (
    method: 'GET' | 'POST',
    targetUrl: string,
    body?: any
  ): Promise<any> => {
    if (!user?.wbApiKey) {
      throw { message: 'API ключ не настроен', status: 401 };
    }

    const cacheKey = `${method}:${targetUrl}:${JSON.stringify(body || '')}`;
    const cached = getCached(cacheKey);
    if (cached) {
      console.log(`[WB API] Кэш: ${targetUrl}`);
      return cached;
    }

    console.log(`[WB API] ${method} запрос: ${targetUrl}`);

    try {
      const response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.wbApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: method,
          url: targetUrl,
          body: body || null,
        }),
      });

      console.log(`[WB API] Статус: ${response.status}`);

      if (response.status === 429) {
        throw {
          message: 'Превышен лимит запросов WB API',
          details: 'Подождите 20 секунд (лимит нового API остатков).',
          status: 429,
        };
      }

      if (response.status === 401) {
        throw {
          message: 'Неверный API-ключ',
          details: 'Нужен персональный токен. Создайте в кабинете WB.',
          status: 401,
        };
      }

      if (response.status === 403) {
        throw {
          message: 'Нет доступа',
          details: 'У токена нет прав. Нужны категории: Статистика + Аналитика.',
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

      const result = await response.json();
      
      // Vercel Function возвращает { data: ..., fromCache: ... }
      const data = result.data !== undefined ? result.data : result;
      
      setCache(cacheKey, data);
      return data;
    } catch (error: any) {
      if (error.status) throw error;

      if (error.message?.includes('Failed to fetch')) {
        throw {
          message: 'Ошибка сети',
          details: 'Не удалось подключиться к серверу.',
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

  // Получение продаж (все заказы со всех складов)
  const getSales = async (): Promise<SalesResponse> => {
    const cacheKey = 'sales_data';
    const cached = getCached<SalesResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    // Order Feed API возвращает данные максимум за 31 день
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - 31);
    const dateTo = new Date();
    
    const orderFeedResponse = await fetchViaProxy(
      'POST',
      WB_API.orderFeed,
      {
        selectedPeriod: {
          start: dateFrom.toISOString(),
          end: dateTo.toISOString(),
        },
        nmIds: [],
        subjectIds: [],
        brandNames: [],
        tagIds: [],
        pagination: {
          offset: 0,
          limit: 1000,
        },
      }
    );
    
    // Order Feed возвращает { data: { orders: [...] } }
    const orders = orderFeedResponse?.data?.orders || [];

    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const calculateMetrics = (ordersData: any[]): SalesData => {
      // Фильтруем только успешные заказы (не отменённые)
      const successfulOrders = ordersData.filter(
        (o) => o.status !== 'cancel' && o.status !== 'return'
      );
      
      const revenue = successfulOrders.reduce(
        (sum, o) => sum + (o.sellerPrice || 0),
        0
      );
      const orderCount = successfulOrders.length;
      const avgCheck = orderCount > 0 ? revenue / orderCount : 0;
      const returns = ordersData.filter(
        (o) => o.status === 'cancel' || o.status === 'return'
      ).length;

      return {
        revenue: Math.round(revenue),
        orders: orderCount,
        avgCheck: Math.round(avgCheck),
        returns,
        conversion: 4.2,
      };
    };

    const yesterdayOrders = orders.filter((o: any) => {
      const d = new Date(o.createdAt);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === yesterday.getTime();
    });

    const weekOrders = orders.filter(
      (o: any) => new Date(o.createdAt) >= weekAgo
    );

    const result = {
      yesterday: calculateMetrics(yesterdayOrders),
      week: calculateMetrics(weekOrders),
      month: calculateMetrics(orders),
    };

    setCache(cacheKey, result);
    return result;
  };

  // Получение остатков на складах WB
  const getStocksWB = async (): Promise<StockItem[]> => {
    const cacheKey = 'stocks_wb';
    const cached = getCached<StockItem[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const response = await fetchViaProxy(
      'POST',
      WB_API.stocksWB,
      { limit: 250000, offset: 0 }
    );

    // WB API для stocks возвращает { data: { items: [...] } }
    // Но через proxy уже распаковано в data
    const items = response?.items || response?.data?.items || [];
    setCache(cacheKey, items);
    return items;
  };

  // Получение остатков на складах продавца
  const getStocksSeller = async (): Promise<StockItem[]> => {
    const cacheKey = 'stocks_seller';
    const cached = getCached<StockItem[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await fetchViaProxy(
        'POST',
        WB_API.stocksSeller,
        { limit: 250000, offset: 0 }
      );

      // WB API для stocks возвращает { data: { items: [...] } }
      const items = response?.items || response?.data?.items || [];
      setCache(cacheKey, items);
      return items;
    } catch (error) {
      // Если endpoint недоступен, возвращаем пустой массив
      console.warn('[WB API] Остатки на складах продавца недоступны:', error);
      setCache(cacheKey, []);
      return [];
    }
  };

  // Получение рекомендаций по пополнению (с учётом обоих складов)
  const getStockRecommendations = async (): Promise<StockRecommendation[]> => {
    const cacheKey = 'stock_recommendations';
    const cached = getCached<StockRecommendation[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // Получаем остатки и заказы параллельно
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - 30);
    const dateTo = new Date();
    
    const [stocksWB, stocksSeller, ordersResponse] = await Promise.all([
      getStocksWB(),
      getStocksSeller(),
      fetchViaProxy(
        'POST',
        WB_API.orderFeed,
        {
          selectedPeriod: {
            start: dateFrom.toISOString(),
            end: dateTo.toISOString(),
          },
          nmIds: [],
          subjectIds: [],
          brandNames: [],
          tagIds: [],
          pagination: {
            offset: 0,
            limit: 1000,
          },
        }
      ),
    ]);
    
    // Order Feed возвращает { data: { orders: [...] } }
    const orders = ordersResponse?.data?.orders || [];

    // Группируем остатки на складах WB по товарам
    const productStocksWB = new Map<number, number>();
    stocksWB.forEach((stock: any) => {
      const key = stock.nmId;
      productStocksWB.set(key, (productStocksWB.get(key) || 0) + (stock.quantity || 0));
    });

    // Группируем остатки на складах продавца по товарам
    const productStocksSeller = new Map<number, number>();
    stocksSeller.forEach((stock: any) => {
      const key = stock.nmId;
      productStocksSeller.set(key, (productStocksSeller.get(key) || 0) + (stock.quantity || 0));
    });

    // Объединяем все уникальные товары
    const allProductIds = new Set([
      ...productStocksWB.keys(),
      ...productStocksSeller.keys(),
    ]);

    // Считаем заказы по товарам за 30 дней (только успешные)
    const productSales = new Map<number, number>();
    if (Array.isArray(orders)) {
      orders.forEach((order: any) => {
        // Пропускаем отменённые заказы
        if (order.status === 'cancel' || order.status === 'return') {
          return;
        }
        const key = order.nmId;
        if (key) {
          productSales.set(key, (productSales.get(key) || 0) + 1);
        }
      });
    }

    // Формируем рекомендации
    const result = Array.from(allProductIds)
      .map((nmId: number) => {
        const currentStockWB = productStocksWB.get(nmId) || 0;
        const currentStockSeller = productStocksSeller.get(nmId) || 0;
        const totalStock = currentStockWB + currentStockSeller;
        
        const salesCount = productSales.get(nmId) || 0;
        const dailySales = salesCount / 30;
        const daysUntilStockout =
          dailySales > 0
            ? Math.floor(totalStock / dailySales)
            : 999;

        let urgency: 'critical' | 'warning' | 'ok' = 'ok';
        let recommendedOrder = 0;
        let reason = '';

        if (totalStock === 0) {
          urgency = 'critical';
          recommendedOrder = Math.ceil(dailySales * 14);
          reason = 'Нет остатков ни на одном складе!';
        } else if (daysUntilStockout <= 3) {
          urgency = 'critical';
          recommendedOrder = Math.ceil(dailySales * 14);
          reason = `Критический остаток! Хватит на ${daysUntilStockout} ${daysUntilStockout === 1 ? 'день' : 'дня'}`;
        } else if (daysUntilStockout <= 7) {
          urgency = 'warning';
          recommendedOrder = Math.ceil(dailySales * 14);
          reason = `Рекомендуется пополнить. Хватит на ${daysUntilStockout} дней`;
        } else {
          reason = `Достаточный запас на ${Math.min(daysUntilStockout, 999)} дней`;
        }

        return {
          productId: nmId,
          productName: `Артикул ${nmId}`,
          currentStockWB,
          currentStockSeller,
          totalStock,
          dailySales: Math.round(dailySales * 10) / 10,
          daysUntilStockout: Math.min(daysUntilStockout, 999),
          recommendedOrder,
          urgency,
          reason,
        };
      })
      .sort((a, b) => a.daysUntilStockout - b.daysUntilStockout)
      .slice(0, 20);

    setCache(cacheKey, result);
    return result;
  };

  return {
    getSales,
    getStocksWB,
    getStocksSeller,
    getStockRecommendations,
  };
}
