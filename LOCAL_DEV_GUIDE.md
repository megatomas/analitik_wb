# WB Analytics Pro - Локальная разработка

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка базы данных

#### Установите PostgreSQL (если ещё не установлен)

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**macOS (Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

**Windows:**
Скачайте с https://www.postgresql.org/download/windows/

#### Создайте базу данных и пользователя

```bash
# Войдите в PostgreSQL
sudo -u postgres psql

# Или на macOS
psql postgres
```

В консоли PostgreSQL выполните:
```sql
-- Создание пользователя
CREATE USER wb_user WITH PASSWORD 'ваш_пароль_здесь';

-- Создание базы данных
CREATE DATABASE wb_analytics;

-- Предоставление прав
GRANT ALL PRIVILEGES ON DATABASE wb_analytics TO wb_user;

-- Выход
\q
```

#### Инициализация таблиц

```bash
# Скопируйте .env.example в .env
cp .env.example .env

# Отредактируйте .env и укажите правильные данные
nano .env

# Запустите инициализацию базы данных
npm run db:init
```

### 3. Настройка переменных окружения

Откройте файл `.env` и заполните:

```env
# Database
DATABASE_URL=postgresql://wb_user:ваш_пароль@localhost:5432/wb_analytics

# Hugging Face API
HF_API_KEY=hf_ваш_токен_здесь

# Server
PORT=4000
NODE_ENV=development

# JWT Secret (можно оставить как есть для разработки)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 4. Запуск проекта

#### Вариант 1: Запуск frontend и backend отдельно

**Терминал 1 - Backend:**
```bash
npm run server:dev
```

**Терминал 2 - Frontend:**
```bash
npm run dev
```

#### Вариант 2: Запуск только frontend (без backend)

```bash
npm run dev
```

Frontend будет работать, но функции требующие backend (авторизация, БД) не будут работать.

### 5. Открытие приложения

Откройте в браузере:
```
http://localhost:5173
```

## 📁 Структура проекта

```
wb-analytics/
├── server/              # Backend код
│   └── index.js        # Express сервер
├── src/                # Frontend код (React)
│   ├── components/     # React компоненты
│   ├── contexts/       # React контексты
│   ├── services/       # API сервисы
│   └── App.tsx         # Главный компонент
├── scripts/            # Скрипты
│   └── init-db.js     # Инициализация БД
├── ecosystem.config.js # Конфигурация PM2
├── .env.example        # Пример переменных окружения
└── package.json        # Зависимости и скрипты
```

## 🔧 Команды

```bash
# Установка зависимостей
npm install

# Запуск frontend (Vite dev server)
npm run dev

# Запуск backend (Express server)
npm run server

# Запуск backend в режиме разработки
npm run server:dev

# Сборка frontend для продакшена
npm run build

# Инициализация базы данных
npm run db:init

# Полная настройка (install + db:init)
npm run setup

# Запуск frontend + backend вместе
npm start
```

## 🗄️ База данных

### Таблицы

**users** - пользователи
- id, email, password_hash, name, wb_api_key, created_at, updated_at

**generated_cards** - сгенерированные карточки
- id, user_id, image_data, prompt, style, product_name, created_at

**usage_stats** - статистика использования
- id, user_id, action, metadata, created_at

### Подключение к БД

```bash
# Через psql
psql -h localhost -U wb_user -d wb_analytics

# Или через pgAdmin
# Host: localhost
# Port: 5432
# Database: wb_analytics
# Username: wb_user
# Password: ваш_пароль
```

## 🌐 API Endpoints

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

## 🐛 Решение проблем

### Ошибка подключения к БД

```
❌ Ошибка подключения к БД: connect ECONNREFUSED
```

**Решение:**
```bash
# Проверьте, что PostgreSQL запущен
sudo systemctl status postgresql

# Запустите PostgreSQL
sudo systemctl start postgresql
```

### Ошибка аутентификации

```
❌ Ошибка: password authentication failed
```

**Решение:**
1. Проверьте пароль в `DATABASE_URL`
2. Сбросьте пароль пользователя:
```bash
sudo -u postgres psql
ALTER USER wb_user WITH PASSWORD 'новый_пароль';
\q
```

### Порт занят

```
Error: listen EADDRINUSE: address already in use :::4000
```

**Решение:**
```bash
# Найдите процесс占用 порт
lsof -i :4000

# Убейте процесс
kill -9 <PID>

# Или измените PORT в .env
```

### Ошибка CORS

Если frontend не может подключиться к backend:

1. Убедитесь, что backend запущен на порту 4000
2. Проверьте `FRONTEND_URL` в `.env`
3. Проверьте настройки CORS в `server/index.js`

## 📝 Получение API ключей

### Hugging Face

1. Зарегистрируйтесь на https://huggingface.co
2. Перейдите в Settings → Access Tokens
3. Создайте новый токен
4. Скопируйте токен (начинается с `hf_`)
5. Вставьте в `.env` как `HF_API_KEY`

### Wildberries

1. Войдите в https://seller.wildberries.ru
2. Перейдите в Настройки → Доступ к API
3. Создайте персональный токен
4. Отметьте категории: Статистика + Аналитика + Контент
5. Скопируйте токен
6. Вставьте в профиле пользователя на сайте

## 🚀 Деплой на сервер

Смотрите инструкцию в файле `TIMEWEB_DEPLOYMENT.md`

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте логи: `npm run server` показывает ошибки
2. Проверьте базу данных: `npm run db:init`
3. Проверьте переменные окружения в `.env`
4. Проверьте логи PostgreSQL: `sudo tail -f /var/log/postgresql/postgresql-*.log`

---

**Готово к разработке!** 🎉
