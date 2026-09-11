import { useAuth } from '../contexts/AuthContext';

// Базовый URL для API (в продакшне это будет ваш Vercel backend)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  avgCheck: number;
  returns: number;
  conversion: number;
}

interface StockItem {
  productId: number;
  productName: string;
  currentStock: number;
  dailySales: number;
  daysUntilStockout: number;
  recommendedOrder: number;
  urgency: 'critical' | 'warning' | 'ok';
  reason: string;
}

export function useWBApi() {
  const { user } = useAuth();

  const fetchWithAuth = async (endpoint: string) => {
    if (!user?.wbApiKey) {
      throw new Error('API ключ не настроен');
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${user.wbApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка API: ${response.status}`);
    }

    return response.json();
  };

  // Получить продажи за период
  const getSales = async (days: number = 1): Promise<SalesData> => {
    try {
      const data = await fetchWithAuth(`/wb-sales?days=${days}`);
      return data;
    } catch (error) {
      console.error('Ошибка получения продаж:', error);
      throw error;
    }
  };

  // Получить остатки и рекомендации
  const getStockRecommendations = async (): Promise<StockItem[]> => {
    try {
      const data = await fetchWithAuth('/wb-stocks');
      return data;
    } catch (error) {
      console.error('Ошибка получения остатков:', error);
      throw error;
    }
  };

  // Получить аналитику
  const getAnalytics = async () => {
    try {
      const data = await fetchWithAuth('/wb-analytics');
      return data;
    } catch (error) {
      console.error('Ошибка получения аналитики:', error);
      throw error;
    }
  };

  return {
    getSales,
    getStockRecommendations,
    getAnalytics,
  };
}
