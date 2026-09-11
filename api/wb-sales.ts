import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = req.headers.authorization?.replace('Bearer ', '');
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API ключ не предоставлен' });
  }

  try {
    // Получаем продажи за последние 30 дней
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - 30);
    const dateFromStr = dateFrom.toISOString().split('T')[0];

    const response = await fetch(
      `https://statistics-api.wildberries.ru/api/v1/supplier/sales?dateFrom=${dateFromStr}`,
      {
        headers: { 
          Authorization: apiKey,
          'Content-Type': 'application/json'
        },
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: 'Ошибка WB API',
        details: await response.text()
      });
    }

    const sales = await response.json();

    // Агрегируем данные
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdaySales = sales.filter((s: any) => {
      const saleDate = new Date(s.date);
      return saleDate.toDateString() === yesterday.toDateString();
    });

    const weekSales = sales.filter((s: any) => {
      const saleDate = new Date(s.date);
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return saleDate >= weekAgo;
    });

    const monthSales = sales;

    const calculateMetrics = (salesData: any[]) => {
      const revenue = salesData.reduce((sum, s) => sum + (s.retailPriceWithDiscRub || 0), 0);
      const orders = salesData.length;
      const avgCheck = orders > 0 ? revenue / orders : 0;
      const returns = salesData.filter((s) => s.isCancel || s.isReturn).length;
      const conversion = orders > 0 ? (orders / (orders * 20)) * 100 : 0; // Примерная конверсия

      return {
        revenue: Math.round(revenue),
        orders,
        avgCheck: Math.round(avgCheck),
        returns,
        conversion: Math.round(conversion * 10) / 10,
      };
    };

    return res.status(200).json({
      yesterday: calculateMetrics(yesterdaySales),
      week: calculateMetrics(weekSales),
      month: calculateMetrics(monthSales),
    });
  } catch (error) {
    console.error('Ошибка:', error);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
}
