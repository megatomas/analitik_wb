import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { endpoint } = req.query;
    const authHeader = req.headers.authorization;
    
    console.log('[wb-proxy] Получен запрос');
    console.log('[wb-proxy] Endpoint:', endpoint);
    console.log('[wb-proxy] Auth header:', authHeader ? 'present' : 'missing');

    // Извлекаем API-ключ (убираем "Bearer " если есть)
    const apiKey = authHeader?.replace('Bearer ', '');

    if (!apiKey) {
      console.log('[wb-proxy] API ключ не предоставлен');
      return res.status(401).json({ error: 'API ключ не предоставлен' });
    }

    if (!endpoint || typeof endpoint !== 'string') {
      console.log('[wb-proxy] Endpoint не указан');
      return res.status(400).json({ error: 'Endpoint не указан' });
    }

    console.log('[wb-proxy] Запрашиваем WB API:', endpoint);

    // Запрос к WB API (без "Bearer", только ключ)
    const wbResponse = await fetch(`https://statistics-api.wildberries.ru${endpoint}`, {
      headers: {
        Authorization: apiKey,
      },
    });

    console.log('[wb-proxy] Ответ от WB API:', wbResponse.status);

    const data = await wbResponse.text();

    // Возвращаем ответ от WB
    res.status(wbResponse.status).send(data);
  } catch (error: any) {
    console.error('[wb-proxy] Ошибка:', error);
    res.status(500).json({ 
      error: 'Ошибка сервера',
      details: error.message 
    });
  }
}
