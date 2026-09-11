# 🔧 Решение проблемы с WB API (ошибка 429)

## ❌ Проблема

Wildberries API **блокирует запросы с IP-адресов облачных провайдеров** (Vercel, AWS, Google Cloud и т.д.). Это политика безопасности WB.

Когда вы видите ошибку 429 — это не просто лимит запросов, это **блокировка IP Vercel**.

---

## ✅ Решение 1: Использовать демо-данные (работает сразу)

Самый простой вариант — использовать демо-данные для тестирования интерфейса.

**Плюсы:**
- ✅ Работает сразу
- ✅ Не нужна настройка
- ✅ Можно тестировать весь функционал

**Минусы:**
- ❌ Не реальные данные
- ❌ Не подходит для продакшна

**Как использовать:**
Просто закройте сообщение об ошибке и работайте с демо-данными.

---

## ✅ Решение 2: Использовать VPS вместо Vercel

Перенести серверную функцию на свой VPS (виртуальный сервер).

**Плюсы:**
- ✅ Реальные данные из WB API
- ✅ Полный контроль
- ✅ Нет блокировок IP

**Минусы:**
- ❌ Нужно настроить VPS
- ❌ Стоит денег (от $5/мес)
- ❌ Требует технических знаний

**Как настроить:**

### Шаг 1: Арендовать VPS
- **Hetzner** (Германия) — от €4/мес ⭐ рекомендую
- **Timeweb** (Россия) — от 200₽/мес
- **DigitalOcean** (США) — от $6/мес

### Шаг 2: Установить Node.js
```bash
# На Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Шаг 3: Загрузить код
```bash
git clone https://github.com/ваш-username/ваш-репозиторий.git
cd ваш-репозиторий
npm install
```

### Шаг 4: Запустить сервер
```bash
npm run build
# Использовать PM2 для постоянного запуска
npm install -g pm2
pm2 start server.js --name wb-analytics
```

### Шаг 5: Настроить Nginx
```nginx
server {
    listen 80;
    server_name analytics.ваш-домен.ru;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Шаг 6: Получить SSL сертификат
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d analytics.ваш-домен.ru
```

**Итого:** 1-2 часа работы + $5/мес за VPS

---

## ✅ Решение 3: Использовать Cloudflare Workers (бесплатно)

Cloudflare Workers — бесплатный серверный прокси (100K запросов/день).

**Плюсы:**
- ✅ Бесплатно
- ✅ Работает с WB API
- ✅ Не блокируется

**Минусы:**
- ❌ Нужно настроить Cloudflare
- ❌ Ограничение 100K запросов/день

**Как настроить:**

### Шаг 1: Создать аккаунт на Cloudflare
https://dash.cloudflare.com/sign-up

### Шаг 2: Создать Worker
1. Перейдите в Workers & Pages
2. Нажмите "Create Worker"
3. Назовите его `wb-proxy`

### Шаг 3: Загрузить код
```javascript
// worker.js
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const endpoint = url.searchParams.get('endpoint');
    const apiKey = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API ключ не предоставлен' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const wbResponse = await fetch(`https://statistics-api.wildberries.ru${endpoint}`, {
        headers: { Authorization: apiKey },
      });

      const data = await wbResponse.text();
      return new Response(data, {
        status: wbResponse.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};
```

### Шаг 4: Обновить фронтенд
Измените URL прокси в `src/services/wbApi.ts`:
```typescript
const response = await fetch(`https://wb-proxy.ваш-subdomain.workers.dev?endpoint=${encodeURIComponent(endpoint)}`, {
  headers: {
    'Authorization': `Bearer ${user.wbApiKey}`,
  },
});
```

**Итого:** 30 минут настройки, бесплатно

---

## ✅ Решение 4: Использовать другой API WB

Попробовать другие эндпоинты WB API которые могут работать:

### Вариант A: Content API
```
https://content-api.wildberries.ru/content/...
```

### Вариант B: Common API
```
https://common-api.wildberries.ru/...
```

### Вариант C: Public API (без авторизации)
```
https://public-api.wildberries.ru/...
```

**Плюсы:**
- ✅ Может работать с Vercel
- ✅ Не нужна настройка

**Минусы:**
- ❌ Ограниченный функционал
- ❌ Не все данные доступны

---

## ✅ Решение 5: Использовать сторонний сервис

Использовать готовые сервисы аналитики WB которые предоставляют API:

### MPStats
- https://mpstats.io/api
- Платный, но работает стабильно
- От $30/мес

### MarketGuru
- https://marketguru.ru/api
- Платный
- От $20/мес

### SellerTools
- https://sellertools.ru/api
- Платный
- От $25/мес

**Плюсы:**
- ✅ Работает стабильно
- ✅ Не нужно настраивать
- ✅ Поддержка

**Минусы:**
- ❌ Платно
- ❌ Зависимость от третьего сервиса

---

## 🎯 Моя рекомендация

### Для тестирования:
✅ **Используйте демо-данные** — работает сразу, бесплатно

### Для продакшна:
✅ **Cloudflare Workers** — бесплатно, 100K запросов/день, работает с WB API

### Для серьёзного бизнеса:
✅ **VPS (Hetzner)** — полный контроль, $5/мес, без ограничений

---

## 📋 Сравнение решений

| Решение | Стоимость | Время настройки | Сложность | Реальные данные |
|---------|-----------|-----------------|-----------|-----------------|
| Демо-данные | $0 | 0 минут | Очень легко | ❌ Нет |
| Cloudflare Workers | $0 | 30 минут | Средне | ✅ Да |
| VPS (Hetzner) | $5/мес | 2 часа | Сложно | ✅ Да |
| Сторонний API | $20-30/мес | 10 минут | Легко | ✅ Да |

---

## 🚀 Быстрое решение (Cloudflare Workers)

### Шаг 1: Создайте Worker
1. Откройте https://dash.cloudflare.com
2. Workers & Pages → Create Worker
3. Назовите `wb-proxy`

### Шаг 2: Загрузите код
Скопируйте код из раздела "Решение 3" выше

### Шаг 3: Разверните Worker
Нажмите "Deploy"

### Шаг 4: Обновите фронтенд
Измените URL в `src/services/wbApi.ts`:
```typescript
const response = await fetch(`https://wb-proxy.ваш-subdomain.workers.dev?endpoint=${encodeURIComponent(endpoint)}`, {
  headers: {
    'Authorization': `Bearer ${user.wbApiKey}`,
  },
});
```

### Шаг 5: Запушьте изменения
```bash
git add .
git commit -m "Use Cloudflare Workers proxy"
git push
```

**Готово!** Через 2-3 минуты данные будут загружаться через Cloudflare Workers.

---

## 💡 Итого

**Проблема:** WB API блокирует IP Vercel

**Решения:**
1. ✅ Демо-данные (быстро, бесплатно)
2. ✅ Cloudflare Workers (бесплатно, 30 минут)
3. ✅ VPS (платно, полный контроль)
4. ✅ Сторонний API (платно, просто)

**Моя рекомендация:** Cloudflare Workers — бесплатно и работает!

---

## 📞 Поддержка

Если нужна помощь с настройкой:
- **Email:** support@wb-analytics.pro
- **Telegram:** @wb_analytics_support

Пришлите:
1. Какое решение хотите использовать
2. Есть ли опыт настройки серверов
3. Готовы ли платить за VPS

Поможем настроить! 🚀
