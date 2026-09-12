import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, prompt, model, parameters } = req.body;
    // На сервере Vercel используем переменную БЕЗ префикса VITE_
    const apiKey = process.env.HF_API_KEY || process.env.VITE_HF_API_KEY;

    if (!apiKey) {
      console.error('[hf-proxy] API ключ не найден! Проверьте переменные окружения Vercel.');
      return res.status(500).json({ 
        error: 'API ключ не настроен на сервере. Добавьте переменную HF_API_KEY в Vercel Environment Variables.' 
      });
    }
    
    console.log('[hf-proxy] API ключ найден, длина:', apiKey.length);

    if (action === 'analyze') {
      // Анализ изображения через CLIP
      const { imageData } = req.body;
      
      if (!imageData) {
        return res.status(400).json({ error: 'Изображение не предоставлено' });
      }

      console.log('[hf-proxy] Анализ изображения...');

      const categories = [
        'cosmetics and beauty products',
        'electronics and gadgets',
        'fashion clothing and accessories',
        'food and beverages',
        'sports equipment',
        'home and garden items',
        'automotive parts and accessories',
        'children toys and products',
        'luxury premium items',
        'eco-friendly organic products',
        'technology and innovation',
        'minimalist simple design'
      ];

      // Используем Hugging Face Inference API
      const response = await fetch(
        'https://api-inference.huggingface.co/models/openai/clip-vit-base-patch32',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: {
              image: imageData
            },
            parameters: {
              candidate_labels: categories
            }
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[hf-proxy] Ошибка анализа:', response.status, errorText);
        return res.status(response.status).json({ 
          error: 'Ошибка анализа изображения', 
          details: errorText 
        });
      }

      const result = await response.json();
      console.log('[hf-proxy] Анализ завершён:', result.labels?.[0]);
      
      return res.status(200).json(result);

    } else if (action === 'generate') {
      // Генерация изображения
      if (!prompt || !model) {
        return res.status(400).json({ error: 'Промпт и модель обязательны' });
      }

      console.log(`[hf-proxy] Генерация через ${model}...`);
      console.log(`[hf-proxy] Промпт (первые 100 символов): ${prompt.substring(0, 100)}...`);
      console.log(`[hf-proxy] Параметры:`, JSON.stringify(parameters || {}));

      const response = await fetch(
        `https://api-inference.huggingface.co/models/${model}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: parameters || {
              // Убираем width/height - модели не поддерживают произвольные размеры
              // Генерируем в стандартном размере, масштабируем на клиенте
              num_inference_steps: 25,
              guidance_scale: 7.5,
            }
          }),
        }
      );

      console.log(`[hf-proxy] Статус ответа от ${model}: ${response.status}`);
      console.log(`[hf-proxy] Content-Type: ${response.headers.get('content-type')}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[hf-proxy] Ошибка генерации (${model}):`, response.status);
        console.error(`[hf-proxy] Детали ошибки:`, errorText);
        
        // Пытаемся распарсить JSON ошибку
        try {
          const errorJson = JSON.parse(errorText);
          console.error(`[hf-proxy] Ошибка JSON:`, errorJson);
        } catch (e) {
          // Не JSON, используем текст
        }
        
        // Если модель загружается (503), возвращаем специальную ошибку
        if (response.status === 503) {
          return res.status(503).json({ 
            error: 'Модель загружается, попробуйте через 20 секунд', 
            details: errorText,
            retryAfter: 20
          });
        }
        
        // Если внутренняя ошибка сервера (500), пробуем другую модель
        if (response.status === 500) {
          return res.status(500).json({ 
            error: 'Внутренняя ошибка модели, попробуйте другую модель', 
            details: errorText,
            tryNextModel: true
          });
        }
        
        return res.status(response.status).json({ 
          error: 'Ошибка генерации изображения', 
          details: errorText 
        });
      }

      // Возвращаем изображение как base64
      const imageBuffer = await response.arrayBuffer();
      const base64 = Buffer.from(imageBuffer).toString('base64');
      
      console.log(`[hf-proxy] Генерация завершена через ${model}`);
      
      return res.status(200).json({
        image: `data:image/jpeg;base64,${base64}`,
        model: model
      });

    } else {
      return res.status(400).json({ error: 'Неизвестное действие' });
    }

  } catch (error: any) {
    console.error('[hf-proxy] Ошибка:', error.message);
    return res.status(500).json({ 
      error: 'Внутренняя ошибка сервера',
      details: error.message 
    });
  }
}
