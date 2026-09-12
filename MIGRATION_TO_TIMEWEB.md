# 🚀 Переход с Vercel на Timeweb Cloud

## 📋 Что было сделано

### ✅ Создано для Timeweb:

1. **Backend код** (`server/index.js`)
   - Express сервер с PostgreSQL
   - JWT авторизация
   - API для WB API и Hugging Face
   - Хранение пользователей и карточек в БД

2. **Конфигурация PM2** (`ecosystem.config.js`)
   - Автоматический перезапуск
   - Логирование
   - Мониторинг памяти

3. **База данных**
   - Скрипт инициализации (`scripts/init-db.js`)
   - Таблицы: users, generated_cards, usage_stats
   - Индексы для оптимизации

4. **Nginx конфигурация** (`nginx.conf`)
   - Reverse proxy
   - SSL поддержка
   - Кэширование статики
   - Gzip сжатие

5. **Скрипты автоматизации**
   - `scripts/deploy-timeweb.sh` - автоматический деплой
   - `scripts/init-db.js` - инициализация БД

6. **Документация**
   - `README.md` - общая информация
   - `LOCAL_DEV_GUIDE.md` - локальная разработка
   - `TIMEWEB_DEPLOYMENT.md` - развертывание на Timeweb

### ❌ Удалено (Vercel):

- `api/wb-proxy.ts` - Vercel serverless функции
- `api/hf-proxy.ts` - Vercel serverless функции
- `vercel.json` - конфигурация Vercel

## 🎯 Преимущества перехода на Timeweb

### Было (Vercel):
- ❌ Ограничения на запросы
- ❌ Проблемы с CORS
- ❌ Ошибки DNS
- ❌ Нет реальной БД
- ❌ Сложная отладка
- ❌ Зависимость от стороннего сервиса

### Стало (Timeweb):
- ✅ Полный контроль
- ✅ Реальная PostgreSQL БД
- ✅ Нет CORS проблем
- ✅ Нет ограничений на запросы
- ✅ Простая отладка (логи на сервере)
- ✅ Полный доступ к серверу
- ✅ Экономия в долгосрочной перспективе

## 🚀 Как перейти

### Шаг 1: Арендовать VPS на Timeweb

1. Откройте https://timeweb.cloud/
2. Выберите **VPS/VDS**
3. Выберите тариф (рекомендуется 4 GB RAM)
4. Выберите **Ubuntu 22.04 LTS**
5. Оплатите
6. Получите IP адрес и доступы

### Шаг 2: Подготовить локальную среду

```bash
# Установите PostgreSQL локально
sudo apt install postgresql

# Создайте базу данных
sudo -u postgres psql
CREATE DATABASE wb_analytics;
CREATE USER wb_user WITH PASSWORD 'ваш_пароль';
GRANT ALL PRIVILEGES ON DATABASE wb_analytics TO wb_user;
\q

# Скопируйте .env.example в .env
cp .env.example .env

# Отредактируйте .env
nano .env

# Установите зависимости
npm install

# Инициализируйте БД
npm run db:init
```

### Шаг 3: Протестировать локально

```bash
# Терминал 1 - Backend
npm run server:dev

# Терминал 2 - Frontend
npm run dev
```

Откройте http://localhost:5173 и проверьте работу.

### Шаг 4: Развернуть на Timeweb

```bash
# Автоматический деплой
bash scripts/deploy-timeweb.sh <IP_адрес_сервера>

# Или ручной деплой (см. TIMEWEB_DEPLOYMENT.md)
```

### Шаг 5: Настроить домен (опционально)

```bash
# На сервере
sudo nano /etc/nginx/sites-available/wb-analytics

# Измените server_name на ваш домен
server_name ваш_домен.ru;

# Перезапустите Nginx
sudo systemctl restart nginx

# Установите SSL
sudo certbot --nginx -d ваш_домен.ru
```

## 📊 Сравнение стоимости

### Vercel:
- Free tier: ограничен
- Pro: $20/мес (~2000₽/мес)
- Нет реальной БД

### Timeweb:
- VPS 4 GB RAM: ~1000₽/мес
- Домен .ru: ~200₽/год (~17₽/мес)
- **Итого: ~1017₽/мес**
- Полная PostgreSQL БД
- Полный контроль

**Экономия: ~1000₽/мес** + полный контроль!

## 🔧 Что изменилось в коде

### Frontend (React):
- ✅ Остался без изменений
- ✅ Работает как с Vercel, так и с Timeweb
- ✅ API вызовы идут на `/api/*` (работает на обоих платформах)

### Backend:
- ❌ Удалены Vercel serverless функции (`api/`)
- ✅ Добавлен Express сервер (`server/index.js`)
- ✅ Добавлена PostgreSQL интеграция
- ✅ Добавлена JWT авторизация

### Конфигурация:
- ❌ Удален `vercel.json`
- ✅ Добавлен `ecosystem.config.js` (PM2)
- ✅ Добавлен `nginx.conf`
- ✅ Добавлен `.env.example`

## 📝 Чек-лист перехода

- [ ] Арендовать VPS на Timeweb
- [ ] Установить PostgreSQL локально
- [ ] Создать базу данных локально
- [ ] Скопировать `.env.example` в `.env`
- [ ] Заполнить переменные в `.env`
- [ ] Установить зависимости (`npm install`)
- [ ] Инициализировать БД (`npm run db:init`)
- [ ] Протестировать локально
- [ ] Развернуть на Timeweb
- [ ] Настроить Nginx
- [ ] Настроить SSL (если есть домен)
- [ ] Протестировать на сервере
- [ ] Настроить мониторинг

## 🐛 Решение проблем

### Проблема: Локально не работает backend

**Решение:**
```bash
# Проверьте PostgreSQL
sudo systemctl status postgresql

# Проверьте .env
cat .env

# Пересоздайте БД
npm run db:init
```

### Проблема: На сервере не работает API

**Решение:**
```bash
# Проверьте логи
pm2 logs wb-analytics-api

# Проверьте Nginx
sudo tail -f /var/log/nginx/wb-analytics.error.log

# Перезапустите backend
pm2 restart wb-analytics-api
```

### Проблема: Не подключается к БД

**Решение:**
```bash
# Проверьте DATABASE_URL в .env
# Формат: postgresql://user:password@host:port/database

# Проверьте подключение
psql -h localhost -U wb_user -d wb_analytics
```

## 📚 Документация

- **README.md** - общая информация о проекте
- **LOCAL_DEV_GUIDE.md** - локальная разработка
- **TIMEWEB_DEPLOYMENT.md** - развертывание на Timeweb
- **HUGGING_FACE_KEY_GUIDE.md** - настройка Hugging Face API

## 🎯 Итого

### Что получили:
- ✅ Полноценный backend с PostgreSQL
- ✅ JWT авторизацию
- ✅ Хранение данных в БД
- ✅ Полный контроль над сервером
- ✅ Экономию ~1000₽/мес
- ✅ Отсутствие ограничений

### Что нужно сделать:
1. Арендовать VPS на Timeweb (~1000₽/мес)
2. Настроить PostgreSQL
3. Развернуть проект
4. Настроить домен (опционально)

### Время настройки:
- Локально: 30 минут
- На сервере: 1-2 часа

---

**Готово к переходу на Timeweb!** 🚀

Следуйте инструкции в `TIMEWEB_DEPLOYMENT.md` для полного развертывания.
