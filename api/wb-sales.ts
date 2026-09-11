import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log('[wb-sales] Получен запрос');

  const apiKey = req.headers.authorization?.replace('Bearer ', '');
  
  if (!apiKey) {
    console.log('[wb-sales] API ключ не предоставлен');
    return res.status(401).json({ error: 'API ключ не предоставлен' });
  }

  try {
    console.log('[wb-sales] Запрашиваем данные из WB API...');
    
    // Получаем продажи за последние 30 дней
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - 30);
    const dateFromStr = dateFrom.toISOString().split('T')[0];

    const response = await fetch(
      `https://statistics-api.wildberries.ru/api/v1/supplier/sales?dateFrom=${dateFromStr}`,
      {
        headers: { 
          Authorization: apiKey,
        },
      }
    );

    console.log('[wb-sales] Ответ от WB API:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[wb-sales] Ошибка WB API:', errorText);
      return res.status(response.status).json({ 
        error: 'Ошибка WB API',
        details: errorText,
        status: response.status
      });
    }

    const sales = await response.json();
    console.log('[wb-sales] Получено продаж:', sales.length);

    // Агрегируем данные
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const yesterdaySales = sales.filter((s: any) => {
      const saleDate = new Date(s.date);
      saleDate.setHours(0, 0, 0, 0);
      return saleDate.getTime() === yesterday.getTime();
    });

    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekSales = sales.filter((s: any) => new Date(s.date) >= weekAgo);

    const calculateMetrics = (salesData: any[]) => {
      const revenue = salesData.reduce((sum, s) => sum + (s.retailPriceWithDiscRub || 0), 0);
      const orders = salesData.length;
      const avgCheck = orders > 0 ? revenue / orders : 0;
      const returns = salesData.filter((s) => s.isCancel || s.isReturn).length;
      const conversion = orders > 0 ? 4.2 : 0; // Фиксированная конверсия для демо

      return {
        revenue: Math.round(revenue),
        orders,
        avgCheck: Math.round(avgCheck),
        returns,
        conversion,
      };
    };

    const result = {
      yesterday: calculateMetrics(yesterdaySales),
      week: calculateMetrics(weekSales),
      month: calculateMetrics(sales),
    };

    console.log('[wb-sales] Успешно возвращаем данные');
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('[wb-sales] Критическая ошибка:', error);
    return res.status(500).json({ 
      error: 'Внутренняя ошибка сервера',
      details: error.message 
    });
  }
}
