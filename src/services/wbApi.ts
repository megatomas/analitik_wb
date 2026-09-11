import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = '/api';

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

export function useWBApi() {
  const { user } = useAuth();

  const fetchWithAuth = async (endpoint: string): Promise<any> => {
    if (!user?.wbApiKey) {
      throw { message: 'API ключ не настроен' };
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${user.wbApiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorDetails = '';
        try {
          const errorJson = JSON.parse(errorText);
          errorDetails = errorJson.error || errorJson.details || errorText;
        } catch {
          errorDetails = errorText;
        }

        throw {
          message: `Ошибка API: ${response.status}`,
          details: errorDetails,
          status: response.status,
        };
      }

      return response.json();
    } catch (error: any) {
      if (error.message) throw error;
      throw {
        message: 'Не удалось подключиться к серверу',
        details: error.message || 'Проверьте подключение к интернету',
      };
    }
  };

  const getSales = async (): Promise<SalesResponse> => {
    return fetchWithAuth('/wb-sales');
  };

  const getStockRecommendations = async (): Promise<StockRecommendation[]> => {
    return fetchWithAuth('/wb-stocks');
  };

  return {
    getSales,
    getStockRecommendations,
  };
}
