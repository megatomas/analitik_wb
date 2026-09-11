# 🔧 Решение ошибки 500 (FUNCTION_INVOCATION_FAILED)

## ✅ Что было исправлено

### Проблема
Vercel Function падала с ошибкой 500 из-за:
1. Неправильного использования `timeout` в fetch (Node.js fetch не поддерживает это)
2. Неправильной обработки JSON ответов от WB API
3. Слишком сложных типов данных в кэше

### Решение
1. ✅ Убрал `timeout` из fetchOptions
2. ✅ Добавил правильную обработку JSON ответов (try/catch)
3. ✅ Упростил типы данных в кэше (убрал TypeScript generics)
4. ✅ Добавил лучшую обработку ошибок с логированием
5. ✅ Правильная обработка разных форматов ответов от WB API

## 🚀 Что нужно сделать

### Шаг 1: Запушьте изменения на GitHub

```bash
git add .
git commit -m "Fix Vercel Function 500 error"
git push
```

### Шаг 2: Дождитесь деплоя (1-2 минуты)

Vercel автоматически задеплоит обновлённую функцию.

### Шаг 3: Проверьте работу

1. Откройте сайт
2. Войдите в аккаунт
3. Проверьте что данные загружаются

## 📋 Что изменилось в коде

### api/wb-proxy.ts

**Было:**
```typescript
const cache = new Map<string, { data: any; timestamp: number }>();

const fetchOptions: any = {
  method: method,
  headers: { ... },
  timeout: 30000, // ❌ Node.js fetch не поддерживает это
};

const data = await wbResponse.json(); // ❌ Может упасть если не JSON
```

**Стало:**
```typescript
const cache = new Map(); // ✅ Упрощённые типы

const fetchOptions: any = {
  method: method,
  headers: { ... },
  // ✅ Убрали timeout
};

const responseText = await wbResponse.text(); // ✅ Получаем как текст
let data;
try {
  data = JSON.parse(responseText); // ✅ Безопасный парсинг
} catch (e) {
  data = responseText; // ✅ Если не JSON, возвращаем как есть
}
```

### src/services/wbApi.ts

**Было:**
```typescript
const sales = await fetchViaProxy(...); // ❌ Не проверяем формат
```

**Стало:**
```typescript
const salesResponse = await fetchViaProxy(...);
const sales = Array.isArray(salesResponse) ? salesResponse : []; // ✅ Проверяем формат
```

## 🔍 Как проверить что всё работает

### Проверка 1: Откройте логи Vercel

1. Откройте [Vercel Dashboard](https://vercel.com/dashboard)
2. Выберите ваш проект
3. Перейдите во вкладку **Functions**
4. Кликните на `wb-proxy`
5. Откройте вкладку **Logs**
6. Попробуйте загрузить данные на сайте
7. В логах должны появиться сообщения:
   ```
   [wb-proxy] POST https://seller-analytics-api.wildberries.ru/...
   [wb-proxy] WB API status: 200
   [wb-proxy] Cache MISS
   ```

### Проверка 2: Откройте консоль браузера

1. Нажмите F12
2. Перейдите во вкладку **Console**
3. Должны увидеть:
   ```
   [WB API] POST запрос: https://seller-analytics-api.wildberries.ru/...
   [WB API] Статус: 200
   ```

### Проверка 3: Проверьте Network tab

1. F12 → вкладка **Network**
2. Обновите страницу
3. Найдите запрос к `/api/wb-proxy`
4. Статус должен быть **200**
5. Response должен содержать:
   ```json
   {
     "data": [...],
     "fromCache": false
   }
   ```

## ⚠️ Если ошибка 500 всё ещё появляется

### Причина 1: Функция не обновилась

**Решение:**
1. Откройте Vercel Dashboard
2. Перейдите во вкладку **Deployments**
3. Найдите последний деплой
4. Убедитесь что статус **Ready**
5. Если нет, нажмите **Redeploy**

### Причина 2: Превышен лимит памяти

**Решение:**
1. Откройте Vercel Dashboard → Settings → Functions
2. Увеличьте **Memory** до 1024 MB
3. Увеличьте **Timeout** до 30 seconds

### Причина 3: WB API возвращает ошибку

**Решение:**
1. Проверьте логи Vercel Function
2. Найдите сообщение `[wb-proxy] WB API status: XXX`
3. Если статус 429 — подождите 1-2 минуты
4. Если статус 401 — проверьте API-ключ
5. Если статус 403 — проверьте права токена

### Причина 4: Неправильный API-ключ

**Решение:**
1. Откройте настройки профиля
2. Проверьте что используете **персональный токен**
3. Убедитесь что отмечены категории: **Статистика** + **Аналитика**
4. Создайте новый токен если нужно

## 📊 Ожидаемое поведение

### Успешный запрос:
```
[wb-proxy] POST https://seller-analytics-api.wildberries.ru/...
[wb-proxy] WB API status: 200
[wb-proxy] Cache MISS
→ Ответ: { data: [...], fromCache: false }
```

### Запрос из кэша:
```
[wb-proxy] POST https://seller-analytics-api.wildberries.ru/...
[wb-proxy] Cache HIT
→ Ответ: { data: [...], fromCache: true }
```

### Ошибка WB API:
```
[wb-proxy] POST https://seller-analytics-api.wildberries.ru/...
[wb-proxy] WB API status: 429
→ Ответ: { error: 'Ошибка WB API', details: '...' }
```

## 🎯 Итого

**Что исправлено:**
- ✅ Убрана ошибка с `timeout`
- ✅ Правильная обработка JSON ответов
- ✅ Упрощённые типы данных
- ✅ Лучшее логирование ошибок
- ✅ Правильная обработка разных форматов ответов

**Что делать:**
1. Запушить изменения на GitHub
2. Дождаться деплоя (1-2 минуты)
3. Проверить работу сайта
4. Если ошибка 500 — проверить логи Vercel

**Ожидаемый результат:**
- ✅ Данные загружаются без ошибок
- ✅ Кэширование работает
- ✅ Логи показывают правильные сообщения

---

**Если проблема не решена, пришлите:**
1. Скриншот ошибки
2. Логи из Vercel Dashboard → Functions → Logs
3. Скриншот Network tab (F12)
