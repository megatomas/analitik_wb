# 🎉 WB Analytics Pro - Финальная версия

## ✅ Что реализовано

### 1. Интеграция с Wildberries API
- ✅ Подключение через Vercel Serverless Functions (без Cloudflare)
- ✅ Поддержка **персонального токена** WB API
- ✅ Получение данных о продажах
- ✅ Получение остатков на **складах WB**
- ✅ Получение остатков на **складах продавца**
- ✅ Умные рекомендации по пополнению с учётом обоих складов

### 2. API Endpoints
Используются правильные URL для WB API:

**Продажи:**
```
GET https://statistics-api.wildberries.ru/api/v1/supplier/sales
```

**Остатки на складах WB:**
```
POST https://seller-analytics-api.wildberries.ru/api/analytics/v1/stocks-report/wb-warehouses
Body: { "limit": 250000, "offset": 0 }
```

**Остатки на складах продавца:**
```
POST https://seller-analytics-api.wildberries.ru/api/analytics/v1/stocks-report/seller-warehouses
Body: { "limit": 250000, "offset": 0 }
```

### 3. Архитектура
```
┌─────────────┐
│   Browser   │
│   (React)   │
└──────┬──────┘
       │
       │ POST /api/wb-proxy
       │ { method, url, body }
       ▼
┌─────────────────┐
│ Vercel Function │
│  (wb-proxy.ts)  │
│                 │
│  • Кэширование  │
│  • CORS         │
│  • Безопасность │
└──────┬──────────┘
       │
       │ Authorization: Bearer <token>
       ▼
┌─────────────────┐
│   WB API        │
│  (Statistics)   │
│  (Analytics)    │
└─────────────────┘
```

### 4. Кэширование
- **Серверный кэш** (Vercel Function): 10 минут
- **Клиентский кэш** (Browser): 5 минут
- Снижает нагрузку на WB API
- Предотвращает ошибку 429

### 5. Компоненты

#### Dashboard
- Сводка продаж за вчера/неделю/месяц
- Выручка, заказы, средний чек
- Возвраты и конверсия
- График динамики продаж
- Топ товаров

#### Stock Recommendations
- Рекомендации по пополнению остатков
- Учёт остатков на **складах WB** и **складах продавца**
- Приоритизация: критично/внимание/норма
- Расчёт дней до обнуления
- Рекомендации по количеству заказа

#### AI Chat
- Бесплатный ИИ-аналитик
- Анализ продаж
- Рекомендации по остаткам
- Прогнозы

#### Analytics
- Детальная аналитика
- Графики и метрики
- Сравнение с конкурентами

#### Platforms
- Информация о кроссплатформенности
- Web, Mobile, Telegram Bot

#### Deploy
- Инструкция по развёртыванию на Vercel
- Пошаговое руководство

#### Profile Settings
- Управление профилем
- Смена API-ключа
- Информация о сроке действия ключа

## 🚀 Как развернуть

### 1. Клонировать репозиторий
```bash
git clone <your-repo-url>
cd wb-analytics
```

### 2. Установить зависимости
```bash
npm install
```

### 3. Развернуть на Vercel
```bash
npm i -g vercel
vercel
```

Или через GitHub:
1. Запушить код в репозиторий
2. Подключить репозиторий к Vercel
3. Vercel автоматически задеплоит

### 4. Настроить переменные окружения (опционально)
Если используете Supabase для хранения пользователей:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 🔑 Как получить API-ключ Wildberries

### Шаг 1: Войти в личный кабинет WB
Откройте https://seller.wildberries.ru

### Шаг 2: Перейти в раздел API
Настройки → Доступ к API

### Шаг 3: Создать персональный токен
**ВАЖНО:** Нужен именно **персональный токен**, обычный токен не работает!

### Шаг 4: Настроить права доступа
Отметьте категории:
- ✅ **Статистика** (обязательно) - данные о продажах
- ✅ **Аналитика** (обязательно) - остатки на складах
- ⬜ Остальные категории по желанию

### Шаг 5: Уровень доступа
Выберите **"Только чтение"**

### Шаг 6: Название токена
Укажите понятное название, например: `WB Analytics Pro`

### Шаг 7: Скопировать токен
Токен показывается только один раз! Сразу скопируйте и сохраните.

## 📊 Структура проекта

```
wb-analytics/
├── api/
│   └── wb-proxy.ts          # Vercel Serverless Function
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx
│   │   ├── StockRecommendations.tsx
│   │   ├── AIChat.tsx
│   │   ├── Analytics.tsx
│   │   ├── Platforms.tsx
│   │   ├── VercelDeploy.tsx
│   │   ├── ProfileSettings.tsx
│   │   ├── ApiSetup.tsx
│   │   ├── AuthPage.tsx
│   │   └── Sidebar.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── services/
│   │   └── wbApi.ts         # API клиент
│   ├── data/
│   │   └── mockData.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vercel.json
└── README.md
```

## 🔒 Безопасность

- API-ключ хранится в localStorage браузера
- Все запросы к WB API идут через Vercel Function
- Ключ не передаётся в клиентский код напрямую
- Используется HTTPS для всех запросов
- CORS настроен правильно

## 📝 Переменные окружения

### Локальная разработка
Создайте файл `.env.local`:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Vercel
Добавьте в Settings → Environment Variables:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 🎯 Возможности

### Для пользователей
- ✅ Регистрация и авторизация
- ✅ Подключение API-ключа WB
- ✅ Просмотр продаж в реальном времени
- ✅ Анализ остатков на складах WB и продавца
- ✅ Умные рекомендации по пополнению
- ✅ ИИ-аналитик
- ✅ Детальная аналитика
- ✅ Уведомления

### Для разработчиков
- ✅ TypeScript
- ✅ React 18
- ✅ Vite
- ✅ Tailwind CSS
- ✅ Vercel Serverless Functions
- ✅ Кэширование
- ✅ Обработка ошибок
- ✅ Типизация API ответов

## 🐛 Известные ограничения

1. **Лимиты WB API**
   - 10 запросов в минуту
   - Решено кэшированием на 10 минут

2. **Персональный токен**
   - Обычные токены не работают
   - Нужен именно персональный токен

3. **CORS**
   - Прямые запросы из браузера блокируются
   - Решено через Vercel Function proxy

## 📈 Планы развития

- [ ] Telegram бот для уведомлений
- [ ] Мобильное приложение (PWA)
- [ ] Экспорт отчётов в PDF/Excel
- [ ] Мультивалютность
- [ ] Интеграция с другими маркетплейсами
- [ ] Командный доступ
- [ ] API для внешних интеграций

## 🤝 Поддержка

Если возникли вопросы:
- Email: support@wb-analytics.pro
- Telegram: @wb_analytics_support

## 📄 Лицензия

MIT License

---

**Создано с ❤️ для продавцов Wildberries**
