# 🚀 WB Analytics Pro

Полноценный сервис аналитики продаж для Wildberries с ИИ-генерацией карточек товаров.

## ✨ Возможности

- 📊 **Аналитика продаж** - сводки за день, неделю, месяц
- 📦 **Умные рекомендации** - расчет остатков на складах WB и продавца
- 🤖 **ИИ-аналитик** - анализ данных и рекомендации
- 🎨 **ИИ-генерация карточек** - создание продающих фото товаров
- 🔐 **Безопасность** - JWT авторизация, защита API ключей
- 💾 **База данных** - PostgreSQL для хранения данных
- 🌐 **Кроссплатформенность** - Web, Mobile, Telegram Bot

## 🏗️ Архитектура

```
Frontend (React + Vite)
    ↓
Backend (Node.js + Express)
    ↓
PostgreSQL Database
    ↓
External APIs (WB API, Hugging Face)
```

## 🚀 Быстрый старт

### Локальная разработка

Смотрите [LOCAL_DEV_GUIDE.md](./LOCAL_DEV_GUIDE.md)

### Развертывание на Timeweb Cloud

Смотрите [TIMEWEB_DEPLOYMENT.md](./TIMEWEB_DEPLOYMENT.md)

## 📁 Структура проекта

```
wb-analytics/
├── server/              # Backend (Express + PostgreSQL)
│   └── index.js        # API сервер
├── src/                # Frontend (React + TypeScript)
│   ├── components/     # React компоненты
│   ├── contexts/       # Контексты (Auth)
│   ├── services/       # API сервисы
│   └── App.tsx         # Главный компонент
├── scripts/            # Скрипты автоматизации
│   ├── init-db.js     # Инициализация БД
│   └── deploy-timeweb.sh  # Деплой на Timeweb
├── ecosystem.config.js # Конфигурация PM2
├── nginx.conf          # Конфигурация Nginx
├── .env.example        # Пример переменных окружения
└── package.json        # Зависимости и скрипты
```

## 🛠️ Технологии

### Frontend
- React 18 + TypeScript
- Vite (сборщик)
- Tailwind CSS (стили)
- React Router (роутинг)
- Recharts (графики)
- Lucide React (иконки)

### Backend
- Node.js + Express
- PostgreSQL (база данных)
- JWT (авторизация)
- Bcrypt (хеширование паролей)
- PM2 (менеджер процессов)

### Инфраструктура
- Nginx (reverse proxy)
- Let's Encrypt (SSL)
- Timeweb Cloud (VPS)

## 📊 API Endpoints

### Auth
- `POST /api/auth/register` - регистрация
- `POST /api/auth/login` - вход

### User
- `GET /api/user/me` - информация о пользователе
- `POST /api/user/update-api-key` - обновление API ключа WB

### Cards
- `POST /api/cards/save` - сохранение карточки
- `GET /api/cards/history` - история карточек

### Proxies
- `POST /api/hf-proxy` - прокси для Hugging Face API
- `POST /api/wb-proxy` - прокси для Wildberries API

### Stats
- `GET /api/stats/usage` - статистика использования

## 🔐 Безопасность

- ✅ JWT токены для авторизации
- ✅ Хеширование паролей (bcrypt)
- ✅ Защита от CORS атак
- ✅ Валидация входных данных
- ✅ API ключи хранятся только на сервере
- ✅ HTTPS (при наличии SSL сертификата)

## 📈 Мониторинг

```bash
# Логи backend
pm2 logs wb-analytics-api

# Статус процессов
pm2 status

# Логи Nginx
sudo tail -f /var/log/nginx/wb-analytics.access.log
sudo tail -f /var/log/nginx/wb-analytics.error.log

# Статистика PostgreSQL
psql -U wb_user -d wb_analytics -c "SELECT COUNT(*) FROM users;"
```

## 🚀 Деплой

### Автоматический деплой на Timeweb

```bash
bash scripts/deploy-timeweb.sh <IP_адрес>
```

### Ручной деплой

Смотрите [TIMEWEB_DEPLOYMENT.md](./TIMEWEB_DEPLOYMENT.md)

## 📝 Переменные окружения

Скопируйте `.env.example` в `.env` и заполните:

```env
DATABASE_URL=postgresql://wb_user:password@localhost:5432/wb_analytics
HF_API_KEY=hf_your_token_here
JWT_SECRET=your-super-secret-key
PORT=4000
NODE_ENV=production
FRONTEND_URL=http://your-domain.ru
```

## 🧪 Тестирование

```bash
# Проверка здоровья API
curl http://localhost:4000/api/health

# Проверка базы данных
psql -U wb_user -d wb_analytics -c "SELECT * FROM users LIMIT 5;"
```

## 📚 Документация

- [LOCAL_DEV_GUIDE.md](./LOCAL_DEV_GUIDE.md) - Локальная разработка
- [TIMEWEB_DEPLOYMENT.md](./TIMEWEB_DEPLOYMENT.md) - Развертывание на Timeweb
- [HUGGING_FACE_KEY_GUIDE.md](./HUGGING_FACE_KEY_GUIDE.md) - Настройка Hugging Face API
- [AI_CARD_GENERATION.md](./AI_CARD_GENERATION.md) - ИИ генерация карточек

## 💰 Стоимость

### Timeweb Cloud
- VPS 4 GB RAM: ~1000₽/мес
- Домен .ru: ~200₽/год

### API
- Hugging Face: бесплатно (лимит ~1000 запросов/день)
- Wildberries API: бесплатно для продавцов

**Итого:** ~1000₽/мес за полноценный сервис

## 🤝 Поддержка

Если возникли проблемы:
1. Проверьте логи: `pm2 logs wb-analytics-api`
2. Проверьте базу данных: `npm run db:init`
3. Проверьте переменные окружения в `.env`
4. Проверьте логи PostgreSQL: `sudo tail -f /var/log/postgresql/postgresql-*.log`

## 📄 Лицензия

MIT

---

**Создано с ❤️ для продавцов Wildberries**
