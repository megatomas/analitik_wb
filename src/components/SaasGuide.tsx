import { useState } from 'react';
import {
  Copy,
  Check,
  Server,
  Database,
  Shield,
  Zap,
  Code2,
  Rocket,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  FileCode,
  Cloud,
  Key,
  Users,
  CreditCard,
} from 'lucide-react';

function CodeBlock({ code, language = 'bash', filename }: { code: string; language?: string; filename?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden bg-[#0d1117] border border-gray-800 shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
          </div>
          {filename && <span className="text-xs text-gray-400 font-mono ml-2">{filename}</span>}
          {!filename && <span className="text-xs text-gray-400 font-mono ml-2">{language}</span>}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/10"
        >
          {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
          {copied ? 'Скопировано' : 'Копировать'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm text-gray-300 font-mono leading-relaxed whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

export default function SaasGuide() {
  const [openSection, setOpenSection] = useState<string | null>('architecture');

  const sections = [
    {
      id: 'architecture',
      title: '🏗️ Архитектура SaaS',
      icon: Server,
      color: 'from-purple-500 to-indigo-600',
    },
    {
      id: 'backend',
      title: '⚙️ Бэкенд (Vercel Serverless)',
      icon: Code2,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      id: 'database',
      title: '🗄️ База данных (Supabase)',
      icon: Database,
      color: 'from-green-500 to-emerald-600',
    },
    {
      id: 'auth',
      title: '🔐 Авторизация',
      icon: Shield,
      color: 'from-amber-500 to-orange-600',
    },
    {
      id: 'api-proxy',
      title: '🔑 Прокси к WB API',
      icon: Key,
      color: 'from-red-500 to-pink-600',
    },
    {
      id: 'monetization',
      title: '💰 Монетизация',
      icon: CreditCard,
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Rocket size={28} />
          <h2 className="text-2xl font-bold">Как превратить демо в SaaS-продукт</h2>
        </div>
        <p className="text-white/80">
          Полное руководство: от архитектуры до монетизации. Превратите текущую демку в полноценный сервис, 
          где пользователи регистрируются, вводят свой API-ключ WB и видят реальные данные.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="px-3 py-1 bg-white/20 rounded-full text-xs">⏱ ~2-3 дня работы</span>
          <span className="px-3 py-1 bg-white/20 rounded-full text-xs">💸 $0 на старте</span>
          <span className="px-3 py-1 bg-white/20 rounded-full text-xs">🚀 Vercel + Supabase</span>
        </div>
      </div>

      {/* Current State vs Target */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3">
            <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm">📦</span>
            Сейчас (Демо)
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              Моковые данные (mockData.ts)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              Нет авторизации
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              Нет базы данных
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              Нет реальных запросов к WB
            </li>
          </ul>
        </div>
        <div className="bg-white rounded-2xl p-5 border-2 border-purple-200 shadow-lg">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3">
            <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-sm">🚀</span>
            Цель (SaaS)
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-green-500" />
              Реальные данные из WB API
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-green-500" />
              Регистрация/вход пользователей
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-green-500" />
              Безопасное хранение API-ключей
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-green-500" />
              Персональные рекомендации
            </li>
          </ul>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {sections.map((section) => (
          <div key={section.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button
              onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
              className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center`}>
                  <section.icon size={18} className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 text-left">{section.title}</h3>
              </div>
              {openSection === section.id ? (
                <ChevronDown size={18} className="text-gray-400" />
              ) : (
                <ChevronRight size={18} className="text-gray-400" />
              )}
            </button>

            {openSection === section.id && (
              <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-4">
                {section.id === 'architecture' && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Архитектура SaaS состоит из 4 основных компонентов:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        {
                          icon: '🖥️',
                          title: 'Frontend (Vercel)',
                          desc: 'React + Vite приложение, которое мы уже создали',
                          color: 'bg-blue-50 border-blue-200',
                        },
                        {
                          icon: '⚡',
                          title: 'Serverless API (Vercel)',
                          desc: 'Edge Functions для прокси к WB API и бизнес-логики',
                          color: 'bg-purple-50 border-purple-200',
                        },
                        {
                          icon: '🗄️',
                          title: 'База данных (Supabase)',
                          desc: 'PostgreSQL для пользователей, API-ключей, настроек',
                          color: 'bg-green-50 border-green-200',
                        },
                        {
                          icon: '🔐',
                          title: 'Авторизация (Supabase Auth)',
                          desc: 'Email/Password, Google, GitHub — бесплатно до 50K MAU',
                          color: 'bg-amber-50 border-amber-200',
                        },
                      ].map((item) => (
                        <div key={item.title} className={`rounded-xl p-4 border ${item.color}`}>
                          <span className="text-2xl">{item.icon}</span>
                          <h4 className="font-semibold text-gray-800 text-sm mt-2">{item.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">{item.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs font-medium text-gray-700 mb-2">Схема работы:</p>
                      <div className="flex items-center justify-between text-xs text-gray-600 gap-2 flex-wrap">
                        <span className="bg-white px-3 py-1.5 rounded-lg border">👤 Пользователь</span>
                        <span>→</span>
                        <span className="bg-white px-3 py-1.5 rounded-lg border">🖥️ Frontend</span>
                        <span>→</span>
                        <span className="bg-white px-3 py-1.5 rounded-lg border">⚡ Vercel API</span>
                        <span>→</span>
                        <span className="bg-white px-3 py-1.5 rounded-lg border">🔑 WB API</span>
                      </div>
                    </div>
                  </div>
                )}

                {section.id === 'backend' && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Создайте папку <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">api/</code> в корне проекта для Vercel Serverless Functions:
                    </p>

                    <CodeBlock
                      filename="api/wb-sales.ts"
                      language="typescript"
                      code={`import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // Секретный ключ сервера
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Проверяем авторизацию пользователя
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Не авторизован' });
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(
    authHeader.replace('Bearer ', '')
  );

  if (authError || !user) {
    return res.status(401).json({ error: 'Неверный токен' });
  }

  // 2. Получаем API-ключ пользователя из БД
  const { data: profile } = await supabase
    .from('profiles')
    .select('wb_api_key')
    .eq('id', user.id)
    .single();

  if (!profile?.wb_api_key) {
    return res.status(400).json({ error: 'API-ключ не настроен' });
  }

  // 3. Делаем запрос к WB API от имени пользователя
  try {
    const response = await fetch(
      'https://statistics-api.wildberries.ru/api/v1/supplier/sales?dateFrom=2024-01-01',
      {
        headers: { Authorization: profile.wb_api_key },
      }
    );

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Ошибка WB API' });
  }
}`}
                    />

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                      <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">Важно!</p>
                        <p className="text-xs text-amber-700 mt-0.5">
                          API-ключ WB хранится на сервере и никогда не попадает в браузер. 
                          Фронтенд делает запрос к нашему API, а наш сервер — к WB API с ключом пользователя.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {section.id === 'database' && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Создайте проект на <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-purple-600 underline">supabase.com</a> (бесплатно) и выполните SQL:
                    </p>

                    <CodeBlock
                      filename="database.sql"
                      language="sql"
                      code={`-- Таблица профилей пользователей
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  wb_api_key TEXT, -- Зашифрованный API-ключ WB
  plan TEXT DEFAULT 'free', -- free, pro, business
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблица для хранения истории запросов (лимиты)
CREATE TABLE api_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  endpoint TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблица для настроек уведомлений
CREATE TABLE notification_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  telegram_chat_id TEXT,
  email_notifications BOOLEAN DEFAULT true,
  stock_alert_days INT DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы для быстрого поиска
CREATE INDEX idx_profiles_user_id ON profiles(id);
CREATE INDEX idx_api_usage_user_id ON api_usage(user_id);
CREATE INDEX idx_api_usage_created ON api_usage(created_at);

-- RLS (Row Level Security) — пользователи видят только свои данные
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

-- Политики
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own usage" ON api_usage
  FOR SELECT USING (auth.uid() = user_id);`}
                    />

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <p className="text-sm font-medium text-blue-800 mb-1">💡 Supabase Free Tier:</p>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>• 500 MB база данных</li>
                        <li>• 1 GB хранилище</li>
                        <li>• 50,000 MAU авторизации</li>
                        <li>• 500,000 Edge Function invocations/мес</li>
                      </ul>
                    </div>
                  </div>
                )}

                {section.id === 'auth' && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Установите Supabase клиент и настройте авторизацию:
                    </p>

                    <CodeBlock
                      filename="src/lib/supabase.ts"
                      language="typescript"
                      code={`import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Регистрация
export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });

  if (error) throw error;

  // Создаём профиль в таблице profiles
  if (data.user) {
    await supabase.from('profiles').insert({
      id: data.user.id,
      email,
      name,
    });
  }

  return data;
}

// Вход
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

// Выход
export async function signOut() {
  await supabase.auth.signOut();
}

// Получить текущего пользователя
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}`}
                    />

                    <CodeBlock
                      filename=".env"
                      language="bash"
                      code={`# Переменные окружения (добавить в Vercel Dashboard)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...

# Секретные ключи (только на сервере!)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOi...`}
                    />
                  </div>
                )}

                {section.id === 'api-proxy' && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Прокси-сервер для безопасной работы с WB API. Фронтенд обращается к нашему API, 
                      а мы — к WB с ключом пользователя.
                    </p>

                    <CodeBlock
                      filename="api/wb-stocks.ts"
                      language="typescript"
                      code={`import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Проверка авторизации
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });

  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return res.status(401).json({ error: 'Invalid token' });

  // Проверка лимитов (free plan: 100 запросов/день)
  const today = new Date().toISOString().split('T')[0];
  const { count } = await supabase
    .from('api_usage')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', today);

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, wb_api_key')
    .eq('id', user.id)
    .single();

  const limits: Record<string, number> = { free: 100, pro: 1000, business: 10000 };
  const limit = limits[profile?.plan || 'free'];

  if ((count || 0) >= limit) {
    return res.status(429).json({ 
      error: 'Лимит запросов исчерпан',
      upgrade: true 
    });
  }

  // Запрос к WB API
  try {
    const wbResponse = await fetch(
      'https://statistics-api.wildberries.ru/api/v1/supplier/stocks',
      { headers: { Authorization: profile.wb_api_key } }
    );

    // Логируем использование
    await supabase.from('api_usage').insert({
      user_id: user.id,
      endpoint: 'stocks',
    });

    const data = await wbResponse.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'WB API error' });
  }
}`}
                    />

                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <p className="text-sm font-medium text-green-800 mb-1">✅ Преимущества такого подхода:</p>
                      <ul className="text-xs text-green-700 space-y-1">
                        <li>• API-ключ WB не светится в браузере</li>
                        <li>• Можно контролировать лимиты по тарифам</li>
                        <li>• Можно кэшировать ответы (экономия запросов к WB)</li>
                        <li>• Можно добавлять бизнес-логику (рекомендации, аналитика)</li>
                      </ul>
                    </div>
                  </div>
                )}

                {section.id === 'monetization' && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Модель монетизации через подписку:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        {
                          name: 'Free',
                          price: '0 ₽',
                          features: ['100 запросов/день', 'Базовая аналитика', '1 магазин', 'Email-поддержка'],
                          color: 'border-gray-200',
                        },
                        {
                          name: 'Pro',
                          price: '990 ₽/мес',
                          features: ['1000 запросов/день', 'ИИ-аналитик', '3 магазина', 'Telegram-бот', 'Приоритет'],
                          color: 'border-purple-300 bg-purple-50',
                          popular: true,
                        },
                        {
                          name: 'Business',
                          price: '2990 ₽/мес',
                          features: ['Безлимит', 'Все функции', '∞ магазинов', 'API доступ', 'Персональный менеджер'],
                          color: 'border-amber-300 bg-amber-50',
                        },
                      ].map((plan) => (
                        <div key={plan.name} className={`rounded-xl p-4 border-2 ${plan.color} relative`}>
                          {plan.popular && (
                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                              Популярный
                            </span>
                          )}
                          <h4 className="font-bold text-gray-800">{plan.name}</h4>
                          <p className="text-2xl font-bold text-gray-800 mt-1">{plan.price}</p>
                          <ul className="mt-3 space-y-1">
                            {plan.features.map((f) => (
                              <li key={f} className="text-xs text-gray-600 flex items-center gap-1">
                                <CheckCircle2 size={10} className="text-green-500" /> {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <p className="text-sm text-gray-600">
                      Для приёма платежей используйте <a href="https://yookassa.ru" target="_blank" rel="noreferrer" className="text-purple-600 underline">ЮKassa</a> или <a href="https://stripe.com" target="_blank" rel="noreferrer" className="text-purple-600 underline">Stripe</a>.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Checklist */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <CheckCircle2 size={18} className="text-green-600" />
          Чек-лист запуска
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Создать проект на Supabase',
            'Настроить таблицы в БД',
            'Добавить Vercel Serverless Functions',
            'Настроить переменные окружения',
            'Интегрировать Supabase Auth во фронтенд',
            'Заменить моковые данные на реальные API-запросы',
            'Добавить страницу настройки API-ключа',
            'Настроить лимиты по тарифам',
            'Добавить обработку ошибок',
            'Настроить Telegram-бот для уведомлений',
            'Протестировать на реальных данных',
            'Запустить и рассказать о сервисе!',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
              <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-bold text-gray-400">
                {i + 1}
              </div>
              <span className="text-sm text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <h3 className="font-bold text-gray-800 mb-4">📚 Полезные ресурсы</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { title: 'Supabase Docs', url: 'https://supabase.com/docs', desc: 'Документация Supabase' },
            { title: 'Vercel Edge Functions', url: 'https://vercel.com/docs/functions', desc: 'Serverless Functions' },
            { title: 'WB API Documentation', url: 'https://dev.wildberries.ru', desc: 'Официальная документация API' },
            { title: 'Next.js + Supabase', url: 'https://supabase.com/docs/guides/getting-started/quickstarts/nextjs', desc: 'Пример интеграции' },
          ].map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <ExternalLink size={14} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{link.title}</p>
                <p className="text-[10px] text-gray-500">{link.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
