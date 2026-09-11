import { useState } from 'react';
import { Copy, Check, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function WorkerUpdateGuide() {
  const [copied, setCopied] = useState(false);

  const workerCode = `export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Access-Control-Max-Age': '86400',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    const apiKey = request.headers.get('Authorization') || '';

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API ключ не предоставлен' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    try {
      // Получаем тело запроса
      const requestBody = await request.json();
      const { method, url, body } = requestBody;

      if (!method || !url) {
        return new Response(JSON.stringify({ error: 'method и url обязательны' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // КЭШИРОВАНИЕ: используем Cache API Cloudflare
      const cacheKey = \`wb-cache:\${method}:\${url}:\${JSON.stringify(body || '')}\`;
      const cache = caches.default;
      
      // Пробуем получить из кэша
      let cachedResponse = await cache.match(new Request(cacheKey));
      
      if (cachedResponse) {
        console.log('✅ Cache HIT:', url);
        return new Response(cachedResponse.body, {
          status: 200,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json',
            'X-Cache': 'HIT',
          },
        });
      }

      console.log('❌ Cache MISS:', url);

      // Формируем запрос к WB API
      const wbRequestOptions = {
        method: method,
        headers: { 
          'Authorization': apiKey,
          'Content-Type': 'application/json',
        },
      };

      // Добавляем тело только для POST/PUT/PATCH
      if (body && method !== 'GET') {
        wbRequestOptions.body = JSON.stringify(body);
      }

      // Запрос к WB API
      const wbResponse = await fetch(url, wbRequestOptions);

      // Если WB вернул ошибку — не кэшируем
      if (!wbResponse.ok) {
        const errorText = await wbResponse.text();
        return new Response(errorText, {
          status: wbResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const data = await wbResponse.text();
      
      // Сохраняем в кэш на 10 минут
      const cacheResponse = new Response(data, {
        headers: {
          'Cache-Control': 'max-age=600', // 10 минут
        },
      });
      
      // Сохраняем в кэш асинхронно
      ctx.waitUntil(cache.put(new Request(cacheKey), cacheResponse.clone()));
      
      console.log('✅ Saved to cache:', url);
      
      return new Response(data, {
        status: 200,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
          'X-Cache': 'MISS',
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};`;

  const handleCopy = () => {
    navigator.clipboard.writeText(workerCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mb-4">
            <AlertCircle size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Обновите Cloudflare Worker</h1>
          <p className="text-gray-500 mt-2">
            Для работы с новым API остатков WB нужно обновить Worker
          </p>
        </div>

        {/* Warning */}
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-6 mb-6">
          <h3 className="font-bold text-red-900 flex items-center gap-2 mb-3">
            <AlertCircle size={20} className="text-red-600" />
            Почему нужно обновить?
          </h3>
          <ul className="text-sm text-red-800 space-y-2">
            <li>• Новый API остатков WB использует <strong>POST-запросы</strong> с JSON-телом</li>
            <li>• Старый Worker поддерживает только GET-запросы</li>
            <li>• Нужна поддержка обоих методов (GET для продаж, POST для остатков)</li>
          </ul>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle2 size={20} className="text-green-600" />
            Инструкция по обновлению
          </h3>
          
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-medium text-gray-800">Откройте Cloudflare Dashboard</p>
                <p className="text-sm text-gray-500 mt-1">
                  Перейдите на{' '}
                  <a href="https://dash.cloudflare.com" target="_blank" rel="noreferrer" className="text-purple-600 underline">
                    dash.cloudflare.com
                  </a>
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-medium text-gray-800">Выберите Worker</p>
                <p className="text-sm text-gray-500 mt-1">
                  Workers & Pages → <code className="bg-gray-100 px-2 py-0.5 rounded">quiet-sound-ccaf</code>
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-medium text-gray-800">Нажмите "Edit Code"</p>
                <p className="text-sm text-gray-500 mt-1">Удалите весь старый код</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                4
              </div>
              <div>
                <p className="font-medium text-gray-800">Вставьте новый код</p>
                <p className="text-sm text-gray-500 mt-1">Скопируйте код ниже и вставьте в редактор</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                5
              </div>
              <div>
                <p className="font-medium text-gray-800">Нажмите "Deploy"</p>
                <p className="text-sm text-gray-500 mt-1">Подождите 10-15 секунд пока Worker обновится</p>
              </div>
            </div>
          </div>
        </div>

        {/* Code Block */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-6">
          <div className="bg-gray-900 px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-gray-300 font-mono">worker.js</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-green-400" />
                  Скопировано!
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Копировать
                </>
              )}
            </button>
          </div>
          <pre className="bg-gray-950 p-4 overflow-x-auto text-xs text-gray-300 leading-relaxed">
            <code>{workerCode}</code>
          </pre>
        </div>

        {/* What Changed */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
          <h3 className="font-bold text-blue-900 mb-3">Что изменилось?</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>✅ <strong>Поддержка POST-запросов</strong> — для нового API остатков WB</li>
            <li>✅ <strong>JSON-тело запроса</strong> — передаётся в формате {'{'} method, url, body {'}'}</li>
            <li>✅ <strong>Кэширование</strong> — 10 минут для снижения нагрузки на WB API</li>
            <li>✅ <strong>Оба метода</strong> — GET (продажи) и POST (остатки)</li>
          </ul>
        </div>

        {/* Test */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
            <CheckCircle2 size={20} className="text-green-600" />
            После обновления
          </h3>
          <p className="text-sm text-green-800 mb-3">
            Обновите страницу сайта и проверьте:
          </p>
          <ul className="text-sm text-green-700 space-y-1">
            <li>✅ Данные о продажах загружаются</li>
            <li>✅ Остатки на складах отображаются</li>
            <li>✅ Рекомендации по пополнению работают</li>
            <li>✅ Ошибка 429 больше не появляется</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
