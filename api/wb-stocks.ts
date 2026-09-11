import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log('[wb-stocks] Получен запрос');

  const apiKey = req.headers.authorization?.replace('Bearer ', '');
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API ключ не предоставлен' });
  }

  try {
    // Получаем остатки
    const stocksResponse = await fetch(
      'https://statistics-api.wildberries.ru/api/v1/supplier/stocks?dateFrom=2024-01-01',
      { headers: { Authorization: apiKey } }
    );

    if (!stocksResponse.ok) {
      const errorText = await stocksResponse.text();
      return res.status(stocksResponse.status).json({ 
        error: 'Ошибка получения остатков',
        details: errorText
      });
    }

    const stocks = await stocksResponse.json();

    // Получаем продажи для расчёта скорости
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - 30);
    const dateFromStr = dateFrom.toISOString().split('T')[0];

    const salesResponse = await fetch(
      `https://statistics-api.wildberries.ru/api/v1/supplier/sales?dateFrom=${dateFromStr}`,
      { headers: { Authorization: apiKey } }
    );

    const sales = salesResponse.ok ? await salesResponse.json() : [];

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
    const recommendations = Array.from(productStocks.values())
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
          reason = `Критический остаток! Хватит на ${daysUntilStockout} ${daysUntilStockout === 1 ? 'день' : 'дня'}`;
        } else if (daysUntilStockout <= 7) {
          urgency = 'warning';
          recommendedOrder = Math.ceil(dailySales * 14);
          reason = `Рекомендуется пополнить. Хватит на ${daysUntilStockout} дней`;
        } else {
          reason = `Достаточный запас на ${daysUntilStockout} дней`;
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

    return res.status(200).json(recommendations);
  } catch (error: any) {
    console.error('[wb-stocks] Ошибка:', error);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера', details: error.message });
  }
}
