# ✅ Проект готов к развертыванию на Timeweb Cloud!

## 🎉 Что было сделано

### Создано для Timeweb:

1. **Backend сервер** (`server/index.js`)
   - Express + PostgreSQL
   - JWT авторизация
   - API для WB API и Hugging Face
   - Хранение пользователей и карточек

2. **База данных**
   - PostgreSQL с таблицами: users, generated_cards, usage_stats
   - Скрипт инициализации: `scripts/init-db.js`

3. **Инфраструктура**
   - PM2 конфигурация (`ecosystem.config.js`)
   - Nginx конфигурация (`nginx.conf`)
   - Скрипт автоматического деплоя (`scripts/deploy-timeweb.sh`)

4. **Документация**
   - `README.md` - общая информация
   - `LOCAL_DEV_GUIDE.md` - локальная разработка
   - `TIMEWEB_DEPLOYMENT.md` - развертывание на Timeweb
   - `MIGRATION_TO_TIMEWEB.md` - инструкция по переходу

### Удалено (Vercel):
- ❌ `api/wb-proxy.ts`
- ❌ `api/hf-proxy.ts`
- ❌ `vercel.json`

## 🚀 Быстрый старт

### 1. Локальная разработка

```bash
# Установите PostgreSQL
sudo apt install postgresql

# Создайте базу данных
sudo -u postgres psql
CREATE DATABASE wb_analytics;
CREATE USER wb_user WITH PASSWORD 'ваш_пароль';
GRANT ALL PRIVILEGES ON DATABASE wb_analytics TO wb_user;
\q

# Настройте окружение
cp .env.example .env
nano .env  # заполните переменные

# Установите зависимости
npm install

# Инициализируйте БД
npm run db:init

# Запустите backend (терминал 1)
npm run server:dev

# Запустите frontend (терминал 2)
npm run dev
```

Откройте http://localhost:5173

### 2. Развертывание на Timeweb

```bash
# Арендовать VPS на https://timeweb.cloud/
# Ubuntu 22.04, 4 GB RAM, ~1000₽/мес

# Автоматический деплой
bash scripts/deploy-timeweb.sh <IP_адрес>

# Или ручной деплой (см. TIMEWEB_DEPLOYMENT.md)
```

## 📊 Сравнение

| Параметр | Vercel | Timeweb |
|----------|--------|---------|
| **Стоимость** | $20/мес (~2000₽) | ~1000₽/мес |
| **База данных** | ❌ Нет | ✅ PostgreSQL |
| **CORS** | ❌ Проблемы | ✅ Нет проблем |
| **DNS** | ❌ Ошибки | ✅ Стабильно |
| **Контроль** | ❌ Ограничен | ✅ Полный |
| **Отладка** | ❌ Сложно | ✅ Просто |
| **Ограничения** | ❌ Есть | ✅ Нет |

**Экономия: ~1000₽/мес + полный контроль!**

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

## 🔧 Команды

```bash
# Локальная разработка
npm run dev              # Frontend
npm run server:dev       # Backend (development)
npm run server           # Backend (production)

# База данных
npm run db:init          # Инициализация БД

# Сборка
npm run build            # Сборка frontend

# Деплой
bash scripts/deploy-timeweb.sh <IP>  # Автоматический деплой

# PM2 (на сервере)
pm2 status               # Статус процессов
pm2 logs                 # Логи
pm2 restart wb-analytics-api  # Перезапуск
```

## 📚 Документация

- **README.md** - общая информация о проекте
- **LOCAL_DEV_GUIDE.md** - подробная инструкция по локальной разработке
- **TIMEWEB_DEPLOYMENT.md** - пошаговое развертывание на Timeweb
- **MIGRATION_TO_TIMEWEB.md** - инструкция по переходу с Vercel

## 🎯 Что дальше?

### Шаг 1: Протестируйте локально

```bash
# Установите PostgreSQL
# Создайте базу данных
# Запустите backend и frontend
# Проверьте работу
```

### Шаг 2: Арендуйте VPS на Timeweb

1. Откройте https://timeweb.cloud/
2. Выберите VPS 4 GB RAM (~1000₽/мес)
3. Ubuntu 22.04 LTS
4. Получите IP адрес

### Шаг 3: Разверните на сервере

```bash
bash scripts/deploy-timeweb.sh <IP_адрес>
```

### Шаг 4: Настройте домен (опционально)

```bash
# На сервере
sudo nano /etc/nginx/sites-available/wb-analytics
# Измените server_name на ваш домен
sudo systemctl restart nginx
sudo certbot --nginx -d ваш_домен.ru
```

## 💡 Преимущества своего сервера

✅ **Полный контроль** - нет ограничений Vercel  
✅ **Реальная БД** - PostgreSQL для хранения данных  
✅ **Нет CORS проблем** - всё на одном домене  
✅ **Стабильность** - нет ошибок DNS и 500  
✅ **Масштабируемость** - можно добавить больше ресурсов  
✅ **Безопасность** - API ключи только на сервере  
✅ **Экономия** - ~1000₽/мес вместо ~2000₽/мес  
✅ **Отладка** - прямой доступ к логам  

## 🐛 Решение проблем

### Локально не работает backend

```bash
# Проверьте PostgreSQL
sudo systemctl status postgresql

# Проверьте .env
cat .env

# Пересоздайте БД
npm run db:init
```

### На сервере не работает API

```bash
# Проверьте логи
pm2 logs wb-analytics-api

# Проверьте Nginx
sudo tail -f /var/log/nginx/wb-analytics.error.log

# Перезапустите backend
pm2 restart wb-analytics-api
```

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте логи: `pm2 logs wb-analytics-api`
2. Проверьте базу данных: `npm run db:init`
3. Проверьте переменные окружения в `.env`
4. Проверьте документацию в `LOCAL_DEV_GUIDE.md`

## 🎉 Итого

**Проект полностью готов к развертыванию на Timeweb Cloud!**

### Что получили:
- ✅ Полноценный backend с PostgreSQL
- ✅ JWT авторизацию
- ✅ Хранение данных в БД
- ✅ Полный контроль над сервером
- ✅ Экономию ~1000₽/мес
- ✅ Отсутствие ограничений

### Что нужно сделать:
1. Протестировать локально (30 минут)
2. Арендовать VPS на Timeweb (~1000₽/мес)
3. Развернуть проект (1-2 часа)
4. Настроить домен (опционально)

### Время настройки:
- Локально: 30 минут
- На сервере: 1-2 часа

---

**Готово к развертыванию!** 🚀

Следуйте инструкциям в `LOCAL_DEV_GUIDE.md` для локальной разработки и `TIMEWEB_DEPLOYMENT.md` для развертывания на Timeweb.
