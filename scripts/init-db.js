import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initDatabase() {
  console.log('🚀 Инициализация базы данных...\n');

  try {
    // Проверка подключения
    const client = await pool.connect();
    console.log('✅ Подключение к базе данных установлено\n');

    // Создание таблицы пользователей
    console.log('📋 Создание таблицы users...');
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
    console.log('✅ Таблица users создана\n');

    // Создание таблицы сгенерированных карточек
    console.log('📋 Создание таблицы generated_cards...');
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
    console.log('✅ Таблица generated_cards создана\n');

    // Создание таблицы статистики использования
    console.log('📋 Создание таблицы usage_stats...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS usage_stats (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        action VARCHAR(50) NOT NULL,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Таблица usage_stats создана\n');

    // Создание индексов для оптимизации
    console.log('🔧 Создание индексов...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_generated_cards_user_id ON generated_cards(user_id);
      CREATE INDEX IF NOT EXISTS idx_generated_cards_created_at ON generated_cards(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_usage_stats_user_id ON usage_stats(user_id);
      CREATE INDEX IF NOT EXISTS idx_usage_stats_action ON usage_stats(action);
    `);
    console.log('✅ Индексы созданы\n');

    // Проверка структуры таблиц
    console.log('🔍 Проверка структуры таблиц...');
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `);
    
    console.log('\n📊 Существующие таблицы:');
    tables.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    client.release();
    
    console.log('\n✅ База данных успешно инициализирована!\n');
    console.log('📝 Следующие шаги:');
    console.log('  1. Скопируйте .env.example в .env');
    console.log('  2. Заполните переменные окружения в .env');
    console.log('  3. Запустите сервер: npm run server\n');

  } catch (error) {
    console.error('\n❌ Ошибка инициализации базы данных:\n');
    console.error(error.message);
    console.error('\n💡 Возможные решения:');
    console.error('  1. Убедитесь, что PostgreSQL запущен');
    console.error('  2. Проверьте DATABASE_URL в .env файле');
    console.error('  3. Убедитесь, что пользователь и база данных созданы\n');
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDatabase();
