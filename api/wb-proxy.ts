import type { VercelRequest, VercelResponse } from '@vercel/node';

// Кэш в памяти серверной функции
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 минут

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

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
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = req.headers.authorization?.replace('Bearer ', '');

    if (!apiKey) {
      return res.status(401).json({ error: 'API ключ не предоставлен' });
    }

    const { method, url, body } = req.body;

    if (!method || !url) {
      return res.status(400).json({ error: 'method и url обязательны' });
    }

    console.log(`[wb-proxy] ${method} ${url}`);

    // Кэш
    const cacheKey = `${method}:${url}:${JSON.stringify(body || '')}`;
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('[wb-proxy] ✅ Cache HIT');
      return res.status(200).json({
         cached.data,
        fromCache: true,
      });
    }

    console.log('[wb-proxy] ❌ Cache MISS');

    // Формируем запрос к WB API
    const wbRequestOptions: RequestInit = {
      method: method,
      headers: {
        Authorization: apiKey,
        'Content-Type': 'application/json',
      },
    };

    if (body && method !== 'GET') {
      wbRequestOptions.body = JSON.stringify(body);
    }

    // Запрос к WB API
    const wbResponse = await fetch(url, wbRequestOptions);

    console.log(`[wb-proxy] WB API status: ${wbResponse.status}`);

    // Если WB вернул ошибку — не кэшируем
    if (!wbResponse.ok) {
      const errorText = await wbResponse.text();
      return res.status(wbResponse.status).json({
        error: 'Ошибка WB API',
        details: errorText,
      });
    }

    const data = await wbResponse.json();

    // Сохраняем в кэш
    cache.set(cacheKey, { data: data, timestamp: Date.now() });

    // Ограничиваем размер кэша
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    return res.status(200).json({
       data,
      fromCache: false,
    });
  } catch (error: any) {
    console.error('[wb-proxy] Ошибка:', error);
    return res.status(500).json({
      error: 'Внутренняя ошибка сервера',
      details: error.message,
    });
  }
}
