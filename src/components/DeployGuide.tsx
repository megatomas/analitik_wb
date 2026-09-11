import { useState } from 'react';
import {
  Server,
  Globe,
  Smartphone,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  Terminal,
  FileCode,
  Cloud,
  Container,
  Rocket,
  ChevronDown,
  ChevronRight,
  Key,
  Database,
  Shield,
  Zap,
} from 'lucide-react';

interface Step {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface DeploySection {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  difficulty: 'Легко' | 'Средне' | 'Продвинутый';
  time: string;
  steps: Step[];
}

function CodeBlock({ code, language = 'bash' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl overflow-hidden bg-[#1e1e2e] border border-gray-700/50">
      <div className="flex items-center justify-between px-4 py-2 bg-[#181825] border-b border-gray-700/50">
        <span className="text-xs text-gray-400 font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
        >
          {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
          {copied ? 'Скопировано!' : 'Копировать'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm text-gray-300 font-mono leading-relaxed whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

function AccordionStep({ step, index, isOpen, onToggle }: { step: Step; index: number; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="w-7 h-7 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">
          {index + 1}
        </span>
        <span className="text-sm font-medium text-gray-800 flex-1">{step.title}</span>
        {isOpen ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-100">
          <div className="text-sm text-gray-600 space-y-3">{step.content}</div>
        </div>
      )}
    </div>
  );
}

export default function DeployGuide() {
  const [activeSection, setActiveSection] = useState('vercel');
  const [openSteps, setOpenSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (sectionId: string, stepId: string) => {
    const key = `${sectionId}-${stepId}`;
    setOpenSteps((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const sections: DeploySection[] = [
    {
      id: 'vercel',
      title: 'Vercel',
      subtitle: 'Бесплатный хостинг за 2 минуты',
      icon: Rocket,
      color: 'from-gray-700 to-gray-900',
      bgColor: 'bg-gray-50',
      difficulty: 'Легко',
      time: '2 мин',
      steps: [
        {
          id: 'account',
          title: 'Создайте аккаунт на Vercel',
          content: (
            <>
              <p>Перейдите на <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-purple-600 underline">vercel.com</a> и войдите через GitHub, GitLab или Email.</p>
              <p className="text-xs text-gray-400">Бесплатный план включает: неограниченные проекты, HTTPS, CDN, 100 ГБ трафика/мес.</p>
            </>
          ),
        },
        {
          id: 'push',
          title: 'Загрузите код на GitHub',
          content: (
            <>
              <p>Создайте репозиторий и загрузите проект:</p>
              <CodeBlock code={`git init
git add .
git commit -m "WB Analytics Pro"
git remote add origin https://github.com/ваш-username/wb-analytics.git
git push -u origin main`} />
            </>
          ),
        },
        {
          id: 'import',
          title: 'Импортируйте проект в Vercel',
          content: (
            <>
              <p>В дашборде Vercel нажмите <strong>"Add New" → "Project"</strong>, выберите ваш репозиторий.</p>
              <p>Vercel автоматически определит Vite и настроит сборку.</p>
              <p className="text-xs text-gray-400">Framework Preset: Vite | Build Command: npm run build | Output: dist</p>
            </>
          ),
        },
        {
          id: 'deploy',
          title: 'Деплой!',
          content: (
            <>
              <p>Нажмите <strong>"Deploy"</strong>. Через 30-60 секунд ваш сайт будет доступен по адресу:</p>
              <CodeBlock code={`https://wb-analytics.vercel.app`} language="url" />
              <p>Каждый push в main автоматически запускает новый деплой.</p>
            </>
          ),
        },
      ],
    },
    {
      id: 'docker',
      title: 'Docker',
      subtitle: 'Контейнеризация для VPS',
      icon: Container,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      difficulty: 'Средне',
      time: '10 мин',
      steps: [
        {
          id: 'dockerfile',
          title: 'Создайте Dockerfile',
          content: (
            <>
              <p>Создайте файл <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">Dockerfile</code> в корне проекта:</p>
              <CodeBlock code={`# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`} language="dockerfile" />
            </>
          ),
        },
        {
          id: 'nginx',
          title: 'Создайте nginx.conf',
          content: (
            <>
              <CodeBlock code={`server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Кэширование статики
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
}`} language="nginx" />
            </>
          ),
        },
        {
          id: 'build-run',
          title: 'Соберите и запустите',
          content: (
            <>
              <CodeBlock code={`# Сборка образа
docker build -t wb-analytics .

# Запуск контейнера
docker run -d -p 80:80 --name wb-analytics wb-analytics

# Или через docker-compose
docker-compose up -d`} />
            </>
          ),
        },
        {
          id: 'docker-compose',
          title: 'docker-compose.yml (опционально)',
          content: (
            <>
              <CodeBlock code={`version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "80:80"
    restart: always

  # Опционально: бэкенд для Telegram бота
  bot:
    build: ./bot
    environment:
      - TELEGRAM_BOT_TOKEN=\${TELEGRAM_BOT_TOKEN}
      - WB_API_KEY=\${WB_API_KEY}
    restart: always`} language="yaml" />
            </>
          ),
        },
      ],
    },
    {
      id: 'vps',
      title: 'VPS сервер',
      subtitle: 'Полный контроль на Ubuntu',
      icon: Server,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      difficulty: 'Продвинутый',
      time: '20 мин',
      steps: [
        {
          id: 'connect',
          title: 'Подключитесь к серверу',
          content: (
            <>
              <p>Рекомендуемые VPS: <strong>Hetzner</strong> (от €4/мес), <strong>DigitalOcean</strong> (от $6/мес), <strong>Timeweb</strong> (от 200₽/мес)</p>
              <CodeBlock code={`ssh root@ваш-ip-адрес`} />
            </>
          ),
        },
        {
          id: 'setup',
          title: 'Установите зависимости',
          content: (
            <>
              <CodeBlock code={`# Обновление системы
apt update && apt upgrade -y

# Установка Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Установка Nginx
apt install -y nginx

# Установка PM2 для бота
npm install -g pm2

# Проверка
node -v  # v20.x.x
nginx -v`} />
            </>
          ),
        },
        {
          id: 'deploy-app',
          title: 'Разверните приложение',
          content: (
            <>
              <CodeBlock code={`# Клонируйте проект
cd /var/www
git clone https://github.com/ваш-username/wb-analytics.git
cd wb-analytics

# Установите зависимости и соберите
npm ci
npm run build

# Скопируйте сборку в nginx
cp -r dist/* /var/www/html/

# Настройте Nginx
nano /etc/nginx/sites-available/wb-analytics`} />
              <p className="mt-2">Конфигурация Nginx:</p>
              <CodeBlock code={`server {
    listen 80;
    server_name analytics.ваш-домен.ru;
    root /var/www/wb-analytics/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/css application/javascript application/json;
}`} language="nginx" />
            </>
          ),
        },
        {
          id: 'ssl',
          title: 'Настройте SSL (HTTPS)',
          content: (
            <>
              <CodeBlock code={`# Установка Certbot
apt install certbot python3-certbot-nginx -y

# Получение сертификата
certbot --nginx -d analytics.ваш-домен.ru

# Автопродление
certbot renew --dry-run`} />
              <p className="text-xs text-gray-400 mt-2">Сертификат Let's Encrypt бесплатный и обновляется автоматически.</p>
            </>
          ),
        },
      ],
    },
    {
      id: 'telegram',
      title: 'Telegram Бот',
      subtitle: 'Бот для уведомлений и аналитики',
      icon: MessageCircle,
      color: 'from-sky-500 to-blue-500',
      bgColor: 'bg-sky-50',
      difficulty: 'Средне',
      time: '15 мин',
      steps: [
        {
          id: 'create-bot',
          title: 'Создайте бота через @BotFather',
          content: (
            <>
              <p>Откройте Telegram, найдите <strong>@BotFather</strong> и отправьте:</p>
              <CodeBlock code={`/newbot`} />
              <p>Следуйте инструкциям: укажите имя бота и username. Сохраните полученный <strong>API Token</strong>.</p>
            </>
          ),
        },
        {
          id: 'bot-code',
          title: 'Код бота (Node.js)',
          content: (
            <>
              <p>Создайте папку <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">bot/</code> и установите зависимости:</p>
              <CodeBlock code={`mkdir bot && cd bot
npm init -y
npm install node-telegram-bot-api node-cron axios dotenv`} />
              <p className="mt-2">Основной файл <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">bot/index.js</code>:</p>
              <CodeBlock code={`require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');
const axios = require('axios');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const WB_API = process.env.WB_API_KEY;

// Команды бота
bot.onText(/\\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 
    '👋 Добро пожаловать в WB Analytics!\\n\\n' +
    '📊 /sales — продажи за сегодня\\n' +
    '📅 /week — отчёт за неделю\\n' +
    '📦 /stock — критические остатки\\n' +
    '🔮 /forecast — прогноз\\n' +
    '🤖 /ai <вопрос> — спросить ИИ'
  );
});

bot.onText(/\\/sales/, async (msg) => {
  // Получение данных из API Wildberries
  const response = await axios.get(
    'https://statistics-api.wildberries.ru/api/v1/supplier/sales',
    { headers: { Authorization: WB_API } }
  );
  // ... обработка и отправка
  bot.sendMessage(msg.chat.id, '📊 Сводка продаж за сегодня...');
});

bot.onText(/\\/stock/, async (msg) => {
  bot.sendMessage(msg.chat.id, '📦 Критические остатки:\\n...');
});

// Ежедневная сводка в 9:00
cron.schedule('0 9 * * *', () => {
  // Отправка сводки всем подписчикам
  bot.sendMessage(CHAT_ID, '📊 Ежедневная сводка...');
});

// Алерты по остаткам (каждые 30 минут)
cron.schedule('*/30 * * * *', async () => {
  // Проверка критических остатков
  // Если остаток < 3 дней — отправка алерта
});

console.log('🤖 Бот запущен!');`} language="javascript" />
            </>
          ),
        },
        {
          id: 'env',
          title: 'Настройте переменные окружения',
          content: (
            <>
              <p>Создайте файл <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">.env</code>:</p>
              <CodeBlock code={`TELEGRAM_BOT_TOKEN=7123456789:AAH...ваш_токен...
WB_API_KEY=ваш_api_ключ_wildberries
ADMIN_CHAT_ID=ваш_telegram_chat_id`} />
            </>
          ),
        },
        {
          id: 'run-bot',
          title: 'Запустите бота',
          content: (
            <>
              <CodeBlock code={`# Локально
node bot/index.js

# На сервере через PM2 (всегда работает)
pm2 start bot/index.js --name wb-bot
pm2 save
pm2 startup`} />
            </>
          ),
        },
      ],
    },
    {
      id: 'mobile',
      title: 'Мобильное приложение',
      subtitle: 'PWA или React Native',
      icon: Smartphone,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      difficulty: 'Продвинутый',
      time: '30 мин',
      steps: [
        {
          id: 'pwa',
          title: 'Вариант 1: PWA (быстрый старт)',
          content: (
            <>
              <p>Превратите веб-приложение в мобильное без написания нативного кода:</p>
              <CodeBlock code={`# Установите плагин
npm install vite-plugin-pwa`} />
              <p className="mt-2">Добавьте в <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">vite.config.js</code>:</p>
              <CodeBlock code={`import { VitePWA } from 'vite-plugin-pwa'

export default {
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'WB Analytics Pro',
        short_name: 'WB Analytics',
        description: 'Аналитика продаж Wildberries',
        theme_color: '#8b5cf6',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
}`} language="javascript" />
              <p className="mt-2 text-xs text-gray-400">После деплоя пользователи смогут "установить" сайт на телефон через браузер.</p>
            </>
          ),
        },
        {
          id: 'react-native',
          title: 'Вариант 2: React Native (нативное)',
          content: (
            <>
              <p>Для полноценного мобильного приложения с push-уведомлениями:</p>
              <CodeBlock code={`# Создание проекта
npx react-native@latest init WBAnalytics

# Установка зависимостей
npm install @react-navigation/native react-native-chart-kit
npm install @react-native-push-notification/push

# Запуск
npx react-native run-android  # Android
npx react-native run-ios       # iOS`} />
              <p className="mt-2 text-xs text-gray-400">Требует Mac для сборки iOS-версии.</p>
            </>
          ),
        },
        {
          id: 'publish',
          title: 'Публикация в сторах',
          content: (
            <>
              <div className="space-y-2">
                <p><strong>Google Play:</strong></p>
                <CodeBlock code={`# Сборка APK/AAB
cd android && ./gradlew assembleRelease

# Или через EAS (Expo)
npm install -g eas-cli
eas build --platform android
eas submit --platform android`} />
                <p className="mt-2"><strong>App Store:</strong></p>
                <CodeBlock code={`eas build --platform ios
eas submit --platform ios`} />
                <p className="text-xs text-gray-400 mt-2">Нужен аккаунт разработчика: Google Play ($25 единоразово), Apple Developer ($99/год).</p>
              </div>
            </>
          ),
        },
      ],
    },
    {
      id: 'api',
      title: 'API Wildberries',
      subtitle: 'Подключение к данным WB',
      icon: Key,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
      difficulty: 'Легко',
      time: '5 мин',
      steps: [
        {
          id: 'get-key',
          title: 'Получите API-ключ',
          content: (
            <>
              <p>1. Войдите в <a href="https://seller.wildberries.ru" target="_blank" rel="noreferrer" className="text-purple-600 underline">личный кабинет продавца WB</a></p>
              <p>2. Перейдите в <strong>Настройки → Доступ к API</strong></p>
              <p>3. Создайте новый ключ с правами доступа:</p>
              <ul className="list-disc pl-4 space-y-1 text-xs">
                <li>Статистика — для получения данных о продажах</li>
                <li>Контент — для управления товарами</li>
                <li>Аналитика — для остатков и отчётов</li>
              </ul>
            </>
          ),
        },
        {
          id: 'endpoints',
          title: 'Основные эндпоинты',
          content: (
            <>
              <CodeBlock code={`# Получить продажи
GET https://statistics-api.wildberries.ru/api/v1/supplier/sales
Headers: Authorization: ваш_API_ключ

# Получить остатки
GET https://statistics-api.wildberries.ru/api/v1/supplier/stocks
Headers: Authorization: ваш_API_ключ

# Получить заказы
GET https://statistics-api.wildberries.ru/api/v1/supplier/orders
Headers: Authorization: ваш_API_ключ

# Получить отчёт о доходах
GET https://statistics-api.wildberries.ru/api/v5/supplier/reportDetailByPeriod
Headers: Authorization: ваш_API_ключ`} />
            </>
          ),
        },
        {
          id: 'env-config',
          title: 'Добавьте в .env',
          content: (
            <>
              <CodeBlock code={`# .env (НИКОГДА не коммитьте в Git!)
VITE_WB_API_KEY=eyJhbGciOiJ...ваш_ключ
VITE_API_BASE_URL=https://statistics-api.wildberries.ru`} />
              <p className="text-xs text-red-500 mt-2">⚠️ Для фронтенда используйте прокси-сервер, чтобы не светить ключ в браузере!</p>
            </>
          ),
        },
      ],
    },
  ];

  const activeSectionData = sections.find((s) => s.id === activeSection)!;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">🚀 Развёртывание сервиса</h2>
        <p className="text-gray-500 mt-1">Пошаговые инструкции для всех платформ</p>
      </div>

      {/* Architecture Overview */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
        <h3 className="font-bold text-lg mb-3">📐 Архитектура сервиса</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            { icon: Globe, label: 'Frontend', desc: 'React + Vite', sub: 'Хостинг: Vercel/Netlify' },
            { icon: Server, label: 'Backend', desc: 'Node.js API', sub: 'Прокси к WB API' },
            { icon: MessageCircle, label: 'Telegram Bot', desc: 'node-telegram-bot-api', sub: 'PM2 на сервере' },
            { icon: Database, label: 'База данных', desc: 'PostgreSQL / Supabase', sub: 'Кэш и аналитика' },
          ].map((item) => (
            <div key={item.label} className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <item.icon size={20} className="mb-2" />
              <p className="font-semibold text-sm">{item.label}</p>
              <p className="text-xs text-white/70">{item.desc}</p>
              <p className="text-[10px] text-white/50 mt-1">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeSection === section.id
                ? 'bg-white shadow-md border border-purple-200 text-purple-700'
                : 'bg-white/50 border border-gray-200 text-gray-600 hover:bg-white hover:border-gray-300'
            }`}
          >
            <section.icon size={16} />
            <span>{section.title}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              section.difficulty === 'Легко' ? 'bg-green-100 text-green-700' :
              section.difficulty === 'Средне' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {section.time}
            </span>
          </button>
        ))}
      </div>

      {/* Active Section Content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className={`p-6 bg-gradient-to-r ${activeSectionData.color} text-white`}>
          <div className="flex items-center gap-3">
            <activeSectionData.icon size={28} />
            <div>
              <h3 className="text-xl font-bold">{activeSectionData.title}</h3>
              <p className="text-sm text-white/70">{activeSectionData.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3">
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
              Сложность: {activeSectionData.difficulty}
            </span>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
              Время: {activeSectionData.time}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-3">
          {activeSectionData.steps.map((step, index) => (
            <AccordionStep
              key={step.id}
              step={step}
              index={index}
              isOpen={!!openSteps[`${activeSection}-${step.id}`]}
              onToggle={() => toggleStep(activeSection, step.id)}
            />
          ))}
        </div>
      </div>

      {/* Quick Start */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3">
          <Zap size={18} className="text-green-600" />
          Быстрый старт (самый простой путь)
        </h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>1️⃣ Зарегистрируйтесь на <strong>Vercel.com</strong> через GitHub</p>
          <p>2️⃣ Создайте бота через <strong>@BotFather</strong> в Telegram</p>
          <p>3️⃣ Получите API-ключ в <strong>личном кабинете WB</strong></p>
          <p>4️⃣ Запушьте код на GitHub → Vercel задеплоит автоматически</p>
          <p>5️⃣ Запустите бота на <strong> Railway.com</strong> или <strong>Render.com</strong> (бесплатно)</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <a href="https://vercel.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:border-purple-300 transition-colors">
            Vercel <ExternalLink size={10} />
          </a>
          <a href="https://railway.app" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:border-purple-300 transition-colors">
            Railway <ExternalLink size={10} />
          </a>
          <a href="https://render.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:border-purple-300 transition-colors">
            Render <ExternalLink size={10} />
          </a>
          <a href="https://supabase.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:border-purple-300 transition-colors">
            Supabase <ExternalLink size={10} />
          </a>
        </div>
      </div>

      {/* Security Note */}
      <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 flex items-start gap-3">
        <Shield size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-amber-800 text-sm">⚠️ Безопасность API-ключей</h4>
          <p className="text-xs text-amber-700 mt-1">
            Никогда не храните API-ключи WB в клиентском коде. Используйте серверный прокси (Node.js/Python),
            который будет принимать запросы от фронтенда и добавлять ключ при обращении к API Wildberries.
            Все секреты храните в переменных окружения (.env) и не коммитьте их в Git.
          </p>
        </div>
      </div>
    </div>
  );
}
