import { useAuth } from '../contexts/AuthContext';

// Кэш в памяти
const memoryCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 минут

// Правильные URL для WB API (проверено в PyCharm)
const WB_API = {
  // Остатки — POST запрос с JSON-телом
  stocks: 'https://seller-analytics-api.wildberries.ru/api/analytics/v1/stocks-report/wb-warehouses',
  // Продажи — GET запрос
  sales: 'https://statistics-api.wildberries.ru/api/v1/supplier/sales',
};

// Cloudflare Worker прокси
const WORKER_URL = 'https://quiet-sound-ccaf.wpehack.workers.dev';

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
  regionName: string;
  quantity: number;
  inWayToClient: number;
  inWayFromClient: number;
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

  // Универсальная функция для запросов через Worker
  const fetchViaWorker = async (
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
      // Формируем запрос к Worker
      const workerRequest: any = {
        method: 'POST', // Worker всегда принимает POST
        headers: {
          'Authorization': user.wbApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: method,
          url: targetUrl,
          body: body || null,
        }),
      };

      const response = await fetch(WORKER_URL, workerRequest);

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

      const data = await response.json();
      setCache(cacheKey, data);
      return data;
    } catch (error: any) {
      if (error.status) throw error;

      if (error.message?.includes('Failed to fetch')) {
        throw {
          message: 'Ошибка сети',
          details: 'Не удалось подключиться к Worker.',
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

  // Получение продаж
  const getSales = async (): Promise<SalesResponse> => {
    const cacheKey = 'sales_data';
    const cached = getCached<SalesResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - 60);
    const dateFromStr = dateFrom.toISOString().split('T')[0];

    // GET запрос к statistics-api
    const sales = await fetchViaWorker(
      'GET',
      `${WB_API.sales}?dateFrom=${dateFromStr}`
    );

    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const calculateMetrics = (salesData: any[]): SalesData => {
      const revenue = salesData.reduce(
        (sum, s) => sum + (s.retailPriceWithDiscRub || s.retailPrice || 0),
        0
      );
      const orders = salesData.length;
      const avgCheck = orders > 0 ? revenue / orders : 0;
      const returns = salesData.filter(
        (s) => s.isCancel === true || s.isReturn === true
      ).length;

      return {
        revenue: Math.round(revenue),
        orders,
        avgCheck: Math.round(avgCheck),
        returns,
        conversion: 4.2,
      };
    };

    const yesterdaySales = sales.filter((s: any) => {
      const d = new Date(s.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === yesterday.getTime();
    });

    const weekSales = sales.filter(
      (s: any) => new Date(s.date) >= weekAgo
    );

    const result = {
      yesterday: calculateMetrics(yesterdaySales),
      week: calculateMetrics(weekSales),
      month: calculateMetrics(sales),
    };

    setCache(cacheKey, result);
    return result;
  };

  // Получение остатков (НОВЫЙ API — POST)
  const getStocks = async (): Promise<StockItem[]> => {
    const cacheKey = 'stocks_raw';
    const cached = getCached<StockItem[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // POST запрос с JSON-телом
    const response = await fetchViaWorker(
      'POST',
      WB_API.stocks,
      { limit: 250000, offset: 0 }
    );

    // Новый API возвращает: { data: { items: [...] } }
    const items = response?.data?.items || [];

    setCache(cacheKey, items);
    return items;
  };

  // Получение рекомендаций по пополнению
  const getStockRecommendations = async (): Promise<StockRecommendation[]> => {
    const cacheKey = 'stock_recommendations';
    const cached = getCached<StockRecommendation[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // Получаем остатки и продажи параллельно
    const [stocks, sales] = await Promise.all([
      getStocks(),
      fetchViaWorker(
        'GET',
        `${WB_API.sales}?dateFrom=${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`
      ),
    ]);

    // Группируем остатки по товарам (nmId)
    const productStocks = new Map<number, any>();
    stocks.forEach((stock: any) => {
      const key = stock.nmId;
      if (!productStocks.has(key)) {
        productStocks.set(key, {
          nmId: stock.nmId,
          totalStock: 0,
          inWayToClient: 0,
          inWayFromClient: 0,
        });
      }
      const product = productStocks.get(key);
      product.totalStock += stock.quantity || 0;
      product.inWayToClient += stock.inWayToClient || 0;
      product.inWayFromClient += stock.inWayFromClient || 0;
    });

    // Считаем продажи по товарам за 30 дней
    const productSales = new Map<number, number>();
    if (Array.isArray(sales)) {
      sales.forEach((sale: any) => {
        const key = sale.nmId;
        if (key) {
          productSales.set(key, (productSales.get(key) || 0) + 1);
        }
      });
    }

    // Формируем рекомендации
    const result = Array.from(productStocks.values())
      .map((product: any) => {
        const salesCount = productSales.get(product.nmId) || 0;
        const dailySales = salesCount / 30;
        const daysUntilStockout =
          dailySales > 0
            ? Math.floor(product.totalStock / dailySales)
            : 999;

        let urgency: 'critical' | 'warning' | 'ok' = 'ok';
        let recommendedOrder = 0;
        let reason = '';

        if (product.totalStock === 0 && product.inWayToClient > 0) {
          urgency = 'warning';
          reason = `На складе 0 шт., в пути ${product.inWayToClient} шт.`;
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
          productId: product.nmId,
          productName: `Артикул ${product.nmId}`,
          currentStock: product.totalStock,
          dailySales: Math.round(dailySales * 10) / 10,
          daysUntilStockout: Math.min(daysUntilStockout, 999),
          recommendedOrder,
          urgency,
          reason,
        };
      })
      .sort((a: any, b: any) => a.daysUntilStockout - b.daysUntilStockout)
      .slice(0, 20);

    setCache(cacheKey, result);
    return result;
  };

  return {
    getSales,
    getStocks,
    getStockRecommendations,
  };
}
