import type { VercelRequest, VercelResponse } from '@vercel/node';

// Кэш в памяти серверной функции
const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 минут

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization || '';
    const apiKey = authHeader.replace('Bearer ', '');

    if (!apiKey) {
      return res.status(401).json({ error: 'API ключ не предоставлен' });
    }

    const { method, url, body } = req.body || {};

    if (!method || !url) {
      return res.status(400).json({ error: 'method и url обязательны' });
    }

    console.log(`[wb-proxy] ${method} ${url}`);

    // Кэш
    const cacheKey = `${method}:${url}:${JSON.stringify(body || '')}`;
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('[wb-proxy] Cache HIT');
      return res.status(200).json({
        data: cached.data,
        fromCache: true,
      });
    }

    console.log('[wb-proxy] Cache MISS');

    // Формируем запрос к WB API
    const fetchOptions: any = {
      method: method,
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
      },
    };

    if (body && method !== 'GET') {
      fetchOptions.body = JSON.stringify(body);
    }

    // Запрос к WB API
    const wbResponse = await fetch(url, fetchOptions);

    console.log(`[wb-proxy] WB API status: ${wbResponse.status}`);

    // Получаем ответ как текст
    const responseText = await wbResponse.text();

    // Если WB вернул ошибку — не кэшируем
    if (!wbResponse.ok) {
      return res.status(wbResponse.status).json({
        error: 'Ошибка WB API',
        details: responseText,
      });
    }

    // Пытаемся распарсить как JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      // Если не JSON, возвращаем как есть
      data = responseText;
    }

    // Сохраняем в кэш
    cache.set(cacheKey, { data, timestamp: Date.now() });

    // Ограничиваем размер кэша
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      if (firstKey) cache.delete(firstKey);
    }

    return res.status(200).json({
      data: data,
      fromCache: false,
    });
  } catch (error: any) {
    console.error('[wb-proxy] Ошибка:', error.message);
    console.error('[wb-proxy] Stack:', error.stack);
    return res.status(500).json({
      error: 'Внутренняя ошибка сервера',
      details: error.message,
    });
  }
}
