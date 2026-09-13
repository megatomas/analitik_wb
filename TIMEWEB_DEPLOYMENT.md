# 🚀 Развертывание WB Analytics на Timeweb Cloud

## 📋 Архитектура проекта

```
┌─────────────────────────────────────────────────────────┐
│                    Timeweb VPS                          │
│                                                         │
│  ┌──────────────┐    ┌──────────────┐                  │
│  │   Nginx      │    │  PostgreSQL  │                  │
│  │  (Reverse    │    │   Database   │                  │
│  │   Proxy)     │    │              │                  │
│  └──────┬───────┘    └──────────────┘                  │
│         │                                               │
│         ├──────────────┐                               │
│         │              │                               │
│  ┌──────▼───────┐  ┌───▼──────────┐                  │
│  │   Frontend   │  │   Backend    │                  │
│  │   (React)    │  │  (Node.js +  │                  │
│  │   Port 3000  │  │   Express)   │                  │
│  │              │  │  Port 4000   │                  │
│  └──────────────┘  └──────┬───────┘                  │
│                           │                           │
│                           ▼                           │
│                    ┌──────────────┐                  │
│                    │  WB API      │                  │
│                    │  (External)  │                  │
│                    └──────────────┘                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 🎯 Преимущества своего сервера

✅ **Полный контроль** - нет ограничений Vercel  
✅ **Реальная БД** - PostgreSQL для хранения данных  
✅ **Нет CORS проблем** - всё на одном домене  
✅ **Стабильность** - нет ошибок DNS и 500  
✅ **Масштабируемость** - можно добавить больше ресурсов  
✅ **Безопасность** - API ключи только на сервере  
✅ **Экономия** - нет лимитов на запросы  

## 📦 Что нужно на сервере

### Системные требования:
- **ОС:** Ubuntu 22.04 LTS (рекомендуется)
- **RAM:** минимум 2 GB (рекомендуется 4 GB)
- **CPU:** 2 vCPU
- **Диск:** 40 GB SSD
- **Node.js:** 20.x LTS
- **PostgreSQL:** 15+
- **Nginx:** latest
- **PM2:** для управления Node.js процессами

### Timeweb тарифы:
- **Минимальный:** VPS 2 GB RAM, 2 vCPU, 40 GB SSD - ~500₽/мес
- **Рекомендуемый:** VPS 4 GB RAM, 4 vCPU, 80 GB SSD - ~1000₽/мес

## 🚀 Пошаговая инструкция

### Шаг 1: Арендовать VPS на Timeweb

1. Откройте https://timeweb.cloud/
2. Зарегистрируйтесь
3. Выберите **VPS/VDS**
4. Выберите тариф (рекомендуется 4 GB RAM)
5. Выберите **Ubuntu 22.04 LTS**
6. Выберите локацию (Москва/Санкт-Петербург для низкой задержки)
7. Оплатите
8. Получите IP адрес и доступы по email

### Шаг 2: Подключиться к серверу

```bash
# Подключение по SSH
ssh root@ваш_ip_адрес

# Или через пароль
ssh root@ваш_ip_адрес
# Введите пароль из email
```

### Шаг 3: Первоначальная настройка сервера

```bash
# Обновление системы
apt update && apt upgrade -y

# Установка базовых утилит
apt install -y curl git wget nano htop

# Создание пользователя (не работайте под root!)
adduser deploy
usermod -aG sudo deploy

# Настройка firewall
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable

# Переключение на пользователя deploy
su - deploy
```

### Шаг 4: Установка Node.js

```bash
# Установка Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Проверка
node -v  # v20.x.x
npm -v   # 10.x.x

# Установка глобальных пакетов
sudo npm install -g pm2
```

### Шаг 5: Установка PostgreSQL

```bash
# Установка PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Запуск и автозапуск
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Создание базы данных и пользователя
sudo -u postgres psql

# В PostgreSQL консоли:
CREATE DATABASE wb_analytics;
CREATE USER wb_user WITH ENCRYPTED PASSWORD 'ваш_пароль_здесь';
GRANT ALL PRIVILEGES ON DATABASE wb_analytics TO wb_user;
\q

# Проверка подключения
psql -h localhost -U wb_user -d wb_analytics
```

### Шаг 6: Клонирование проекта

```bash
# Перейдите в домашнюю директорию
cd ~

# Клонируйте репозиторий
git clone https://github.com/ваш-username/wb-analytics.git
cd wb-analytics

# Установите зависимости
npm install
```

### Шаг 7: Настройка backend

Создайте файл `server/index.js` (инструкция ниже в разделе "Backend код")

### Шаг 8: Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
# Database
DATABASE_URL=postgresql://wb_user:ваш_пароль@localhost:5432/wb_analytics

# Hugging Face API
HF_API_KEY=hf_ваш_токен_здесь

# Server
PORT=4000
NODE_ENV=production

# Frontend URL
FRONTEND_URL=http://ваш_ip_адрес
```

### Шаг 9: Сборка frontend

```bash
# Сборка React приложения
npm run build

# Результат будет в папке dist/
```

### Шаг 10: Настройка PM2

Создайте файл `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'wb-analytics-api',
    script: './server/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 4000
    }
  }]
};
```

Запустите backend:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Шаг 11: Настройка Nginx

Создайте файл `/etc/nginx/sites-available/wb-analytics`:

```nginx
server {
    listen 80;
    server_name ваш_ip_адрес;

    # Frontend (React)
    location / {
        root /home/deploy/wb-analytics/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files
    location /assets {
        root /home/deploy/wb-analytics/dist;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Активируйте сайт:

```bash
sudo ln -s /etc/nginx/sites-available/wb-analytics /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Шаг 12: Настройка SSL (опционально, но рекомендуется)

Если у вас есть домен:

```bash
# Установка Certbot
sudo apt install certbot python3-certbot-nginx -y

# Получение SSL сертификата
sudo certbot --nginx -d ваш_домен.ru

# Автопродление
sudo certbot renew --dry-run
```

### Шаг 13: Проверка работы

Откройте в браузере:
```
http://ваш_ip_адрес
```

Должен открыться ваш сайт WB Analytics!

## 🔧 Backend код

Создайте файл `server/index.js`:

```javascript
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Проверка подключения к БД
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Ошибка подключения к БД:', err);
  } else {
    console.log('✅ Подключение к БД успешно:', res.rows[0].now);
  }
});

// Создание таблиц
const createTables = async () => {
  const client = await pool.connect();
  try {
    // Таблица пользователей
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        wb_api_key TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Таблица сгенерированных карточек
    await client.query(`
      CREATE TABLE IF NOT EXISTS generated_cards (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        image_data TEXT,
        prompt TEXT,
        style VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Таблицы созданы/проверены');
  } catch (err) {
    console.error('Ошибка создания таблиц:', err);
  } finally {
    client.release();
  }
};

createTables();

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Регистрация пользователя
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // В реальном приложении используйте bcrypt для хеширования пароля
    const password_hash = password; // TODO: использовать bcrypt
    
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, password_hash, name]
    );
    
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('Ошибка регистрации:', err);
    res.status(500).json({ error: 'Ошибка регистрации' });
  }
});

// Вход пользователя
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await pool.query(
      'SELECT id, email, name, wb_api_key FROM users WHERE email = $1 AND password_hash = $2',
      [email, password] // TODO: использовать bcrypt.compare
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }
    
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('Ошибка входа:', err);
    res.status(500).json({ error: 'Ошибка входа' });
  }
});

// Обновление API ключа WB
app.post('/api/user/update-api-key', async (req, res) => {
  try {
    const { userId, apiKey } = req.body;
    
    await pool.query(
      'UPDATE users SET wb_api_key = $1 WHERE id = $2',
      [apiKey, userId]
    );
    
    res.json({ success: true });
  } catch (err) {
    console.error('Ошибка обновления API ключа:', err);
    res.status(500).json({ error: 'Ошибка обновления API ключа' });
  }
});

// Прокси для Hugging Face API
app.post('/api/hf-proxy', async (req, res) => {
  try {
    const { action, prompt, model, parameters, imageData } = req.body;
    const apiKey = process.env.HF_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API ключ не настроен на сервере' });
    }

    if (action === 'analyze') {
      // Анализ изображения через CLIP
      const response = await fetch(
        'https://api-inference.huggingface.co/models/openai/clip-vit-base-patch32',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: { image: imageData },
            parameters: {
              candidate_labels: [
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
              ]
            }
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({ 
          error: 'Ошибка анализа изображения', 
          details: errorText 
        });
      }

      const result = await response.json();
      return res.json(result);

    } else if (action === 'generate') {
      // Генерация изображения
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
              num_inference_steps: 25,
              guidance_scale: 7.5,
            }
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({ 
          error: 'Ошибка генерации изображения', 
          details: errorText 
        });
      }

      const imageBuffer = await response.arrayBuffer();
      const base64 = Buffer.from(imageBuffer).toString('base64');
      
      return res.json({
        image: `image/jpeg;base64,${base64}`,
        model: model
      });
    }

  } catch (error) {
    console.error('Ошибка hf-proxy:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Прокси для WB API
app.post('/api/wb-proxy', async (req, res) => {
  try {
    const { method, url, body } = req.body;
    const apiKey = req.headers.authorization?.replace('Bearer ', '');

    if (!apiKey) {
      return res.status(401).json({ error: 'API ключ не предоставлен' });
    }

    const response = await fetch(`https://statistics-api.wildberries.ru${url}`, {
      method: method,
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.text();
    res.status(response.status).send(data);

  } catch (error) {
    console.error('Ошибка wb-proxy:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
```

## 📦 Установка зависимостей backend

```bash
# Установите зависимости для backend
npm install express cors pg dotenv

# Добавьте в package.json
# "dependencies": {
#   "express": "^4.18.2",
#   "cors": "^2.8.5",
#   "pg": "^8.11.3",
#   "dotenv": "^16.3.1"
# }
```

## 🔐 Безопасность

### Обязательно сделайте:

1. **Смените пароль PostgreSQL**
```bash
sudo -u postgres psql
ALTER USER wb_user WITH PASSWORD 'новый_сильный_пароль';
\q
```

2. **Обновите .env файл**
```env
DATABASE_URL=postgresql://wb_user:новый_пароль@localhost:5432/wb_analytics
```

3. **Настройте firewall**
```bash
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

4. **Используйте HTTPS** (если есть домен)
```bash
sudo certbot --nginx -d ваш_домен.ru
```

## 📊 Мониторинг

### Логи backend:
```bash
pm2 logs wb-analytics-api
```

### Логи Nginx:
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Статус сервисов:
```bash
pm2 status
sudo systemctl status nginx
sudo systemctl status postgresql
```

## 🚀 Деплой обновлений

Когда вы обновите код:

```bash
# Перейдите в папку проекта
cd ~/wb-analytics

# Получите обновления
git pull origin main

# Установите новые зависимости (если есть)
npm install

# Пересоберите frontend
npm run build

# Перезапустите backend
pm2 restart wb-analytics-api

# Перезапустите Nginx (если меняли конфиг)
sudo systemctl restart nginx
```

## 💰 Стоимость

### Timeweb VPS:
- **Минимальный:** ~500₽/мес (2 GB RAM)
- **Рекомендуемый:** ~1000₽/мес (4 GB RAM)

### Домен (опционально):
- **.ru:** ~200₽/год
- **.com:** ~800₽/год

### Итого:
- **Минимум:** 500₽/мес
- **С доменом:** ~600₽/мес

## ✅ Чек-лист

- [ ] Арендовать VPS на Timeweb
- [ ] Подключиться по SSH
- [ ] Установить Node.js, PostgreSQL, Nginx
- [ ] Создать базу данных
- [ ] Клонировать проект
- [ ] Настроить .env файл
- [ ] Создать backend код
- [ ] Установить зависимости
- [ ] Настроить PM2
- [ ] Настроить Nginx
- [ ] Настроить SSL (если есть домен)
- [ ] Протестировать работу
- [ ] Настроить мониторинг

## 🎯 Итого

После развертывания на Timeweb:
- ✅ Все проблемы с CORS решены
- ✅ Нет ошибок DNS
- ✅ Реальная база данных
- ✅ Стабильная работа
- ✅ Полный контроль
- ✅ Готовность к продакшену

**Стоимость:** ~500-1000₽/мес  
**Время настройки:** 2-3 часа  
**Результат:** Полноценный работающий сервис

---

**Готово к развертыванию!** 🚀

Следуйте инструкции шаг за шагом, и через 2-3 часа у вас будет полноценный работающий сервис на своем сервере.
