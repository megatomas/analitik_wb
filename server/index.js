const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

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
    console.error('❌ Ошибка подключения к БД:', err.message);
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Таблица сгенерированных карточек
    await client.query(`
      CREATE TABLE IF NOT EXISTS generated_cards (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        image_data TEXT,
        prompt TEXT,
        style VARCHAR(100),
        product_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Таблица для хранения статистики использования
    await client.query(`
      CREATE TABLE IF NOT EXISTS usage_stats (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        action VARCHAR(50) NOT NULL,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Таблицы созданы/проверены');
  } catch (err) {
    console.error('❌ Ошибка создания таблиц:', err);
  } finally {
    client.release();
  }
};

createTables();

// Middleware для проверки JWT токена
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Токен не предоставлен' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Неверный токен' });
    }
    req.user = user;
    next();
  });
};

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Регистрация пользователя
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Валидация
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    // Проверка существующего пользователя
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }

    // Хеширование пароля
    const password_hash = await bcrypt.hash(password, 10);
    
    // Создание пользователя
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
      [email, password_hash, name]
    );
    
    const user = result.rows[0];

    // Генерация JWT токена
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Логирование действия
    await pool.query(
      'INSERT INTO usage_stats (user_id, action, metadata) VALUES ($1, $2, $3)',
      [user.id, 'register', { email, name }]
    );

    res.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token
    });
  } catch (err) {
    console.error('❌ Ошибка регистрации:', err);
    res.status(500).json({ error: 'Ошибка регистрации' });
  }
});

// Вход пользователя
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Валидация
    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' });
    }

    // Поиск пользователя
    const result = await pool.query(
      'SELECT id, email, name, password_hash, wb_api_key FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const user = result.rows[0];

    // Проверка пароля
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    // Генерация JWT токена
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Логирование действия
    await pool.query(
      'INSERT INTO usage_stats (user_id, action, metadata) VALUES ($1, $2, $3)',
      [user.id, 'login', { email }]
    );

    res.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        hasWbApiKey: !!user.wb_api_key
      },
      token
    });
  } catch (err) {
    console.error('❌ Ошибка входа:', err);
    res.status(500).json({ error: 'Ошибка входа' });
  }
});

// Получение информации о пользователе
app.get('/api/user/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, wb_api_key, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const user = result.rows[0];

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      hasWbApiKey: !!user.wb_api_key,
      createdAt: user.created_at
    });
  } catch (err) {
    console.error('❌ Ошибка получения пользователя:', err);
    res.status(500).json({ error: 'Ошибка получения данных пользователя' });
  }
});

// Обновление API ключа WB
app.post('/api/user/update-api-key', authenticateToken, async (req, res) => {
  try {
    const { apiKey } = req.body;
    
    if (!apiKey) {
      return res.status(400).json({ error: 'API ключ обязателен' });
    }

    await pool.query(
      'UPDATE users SET wb_api_key = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [apiKey, req.user.id]
    );

    // Логирование действия
    await pool.query(
      'INSERT INTO usage_stats (user_id, action, metadata) VALUES ($1, $2, $3)',
      [req.user.id, 'update_api_key', {}]
    );

    res.json({ success: true, message: 'API ключ обновлен' });
  } catch (err) {
    console.error('❌ Ошибка обновления API ключа:', err);
    res.status(500).json({ error: 'Ошибка обновления API ключа' });
  }
});

// Сохранение сгенерированной карточки
app.post('/api/cards/save', authenticateToken, async (req, res) => {
  try {
    const { imageData, prompt, style, productName } = req.body;

    const result = await pool.query(
      `INSERT INTO generated_cards (user_id, image_data, prompt, style, product_name) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at`,
      [req.user.id, imageData, prompt, style, productName]
    );

    // Логирование действия
    await pool.query(
      'INSERT INTO usage_stats (user_id, action, metadata) VALUES ($1, $2, $3)',
      [req.user.id, 'generate_card', { style, productName }]
    );

    res.json({ 
      success: true, 
      cardId: result.rows[0].id,
      createdAt: result.rows[0].created_at
    });
  } catch (err) {
    console.error('❌ Ошибка сохранения карточки:', err);
    res.status(500).json({ error: 'Ошибка сохранения карточки' });
  }
});

// Получение истории карточек пользователя
app.get('/api/cards/history', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, prompt, style, product_name, created_at 
       FROM generated_cards 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 50`,
      [req.user.id]
    );

    res.json({ cards: result.rows });
  } catch (err) {
    console.error('❌ Ошибка получения истории:', err);
    res.status(500).json({ error: 'Ошибка получения истории' });
  }
});

// Прокси для Hugging Face API
app.post('/api/hf-proxy', authenticateToken, async (req, res) => {
  try {
    const { action, prompt, model, parameters, imageData } = req.body;
    const apiKey = process.env.HF_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API ключ Hugging Face не настроен на сервере' });
    }

    console.log(`[hf-proxy] Действие: ${action}, Модель: ${model || 'N/A'}`);

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
        console.error(`[hf-proxy] Ошибка анализа: ${response.status}`, errorText);
        return res.status(response.status).json({ 
          error: 'Ошибка анализа изображения', 
          details: errorText 
        });
      }

      const result = await response.json();
      console.log(`[hf-proxy] Анализ завершен: ${result.labels?.[0]}`);
      return res.json(result);

    } else if (action === 'generate') {
      // Генерация изображения
      if (!prompt || !model) {
        return res.status(400).json({ error: 'Промпт и модель обязательны' });
      }

      console.log(`[hf-proxy] Генерация через ${model}...`);

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

      console.log(`[hf-proxy] Статус ответа: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[hf-proxy] Ошибка генерации: ${response.status}`, errorText);
        
        if (response.status === 503) {
          return res.status(503).json({ 
            error: 'Модель загружается, попробуйте через 20 секунд', 
            details: errorText,
            retryAfter: 20
          });
        }
        
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

      const imageBuffer = await response.arrayBuffer();
      const base64 = Buffer.from(imageBuffer).toString('base64');
      
      console.log(`[hf-proxy] Генерация завершена, размер: ${imageBuffer.byteLength} байт`);
      
      return res.json({
        image: `image/jpeg;base64,${base64}`,
        model: model
      });
    }

    return res.status(400).json({ error: 'Неизвестное действие' });

  } catch (error) {
    console.error('[hf-proxy] Ошибка:', error.message);
    res.status(500).json({ 
      error: 'Внутренняя ошибка сервера',
      details: error.message 
    });
  }
});

// Прокси для WB API
app.post('/api/wb-proxy', authenticateToken, async (req, res) => {
  try {
    const { method, url, body } = req.body;
    
    // Получаем API ключ пользователя из БД
    const userResult = await pool.query(
      'SELECT wb_api_key FROM users WHERE id = $1',
      [req.user.id]
    );

    if (userResult.rows.length === 0 || !userResult.rows[0].wb_api_key) {
      return res.status(400).json({ error: 'API ключ Wildberries не настроен' });
    }

    const apiKey = userResult.rows[0].wb_api_key;

    console.log(`[wb-proxy] ${method} ${url}`);

    const response = await fetch(`https://statistics-api.wildberries.ru${url}`, {
      method: method,
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.text();
    
    console.log(`[wb-proxy] Статус: ${response.status}`);
    
    res.status(response.status).send(data);

  } catch (error) {
    console.error('[wb-proxy] Ошибка:', error.message);
    res.status(500).json({ 
      error: 'Внутренняя ошибка сервера',
      details: error.message 
    });
  }
});

// Получение статистики использования
app.get('/api/stats/usage', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT action, COUNT(*) as count, 
              MAX(created_at) as last_used
       FROM usage_stats 
       WHERE user_id = $1 
       GROUP BY action 
       ORDER BY count DESC`,
      [req.user.id]
    );

    res.json({ stats: result.rows });
  } catch (err) {
    console.error('❌ Ошибка получения статистики:', err);
    res.status(500).json({ error: 'Ошибка получения статистики' });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`\n🚀 Сервер WB Analytics запущен!`);
  console.log(`📊 Порт: ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Окружение: ${process.env.NODE_ENV || 'development'}\n`);
});

// Обработка необработанных ошибок
process.on('unhandledRejection', (err) => {
  console.error('❌ Необработанная ошибка:', err);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Необработанное исключение:', err);
  process.exit(1);
});
