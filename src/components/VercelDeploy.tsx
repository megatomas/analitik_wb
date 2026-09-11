import { useState } from 'react';
import {
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  Clock,
  Globe,
  Github,
  GitBranch,
  Upload,
  Settings,
  Rocket,
  Terminal,
  Code2,
  Zap,
  Shield,
  Eye,
  ArrowRight,
  FileCode,
  Package,
  Play,
  RefreshCw,
  Link2,
  Monitor,
  ChevronLeft,
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

// Симулятор интерфейса Vercel
function VercelMockup({ step }: { step: number }) {
  const screens = [
    // Step 1: Vercel Homepage
    <div key={1} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-xl">
      <div className="bg-black text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
            <span className="text-black font-bold text-xs">▲</span>
          </div>
          <span className="text-sm font-medium">Vercel</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">Docs</span>
          <span className="text-xs text-gray-400">Templates</span>
          <button className="bg-white text-black px-3 py-1 rounded text-xs font-medium">Log In</button>
        </div>
      </div>
      <div className="p-8 bg-gradient-to-b from-gray-900 to-black text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Develop. Preview. Ship.</h2>
        <p className="text-sm text-gray-400 mb-6">Your frontend cloud</p>
        <div className="flex gap-3 justify-center">
          <button className="bg-white text-black px-4 py-2 rounded text-xs font-medium flex items-center gap-2">
            <Github size={14} /> Continue with GitHub
          </button>
          <button className="border border-gray-600 text-white px-4 py-2 rounded text-xs font-medium">
            Email
          </button>
        </div>
        <div className="mt-6 p-3 bg-white/5 rounded-lg border border-white/10 text-left">
          <p className="text-[10px] text-green-400">✓ Подсказка: используйте GitHub для быстрой авторизации</p>
        </div>
      </div>
    </div>,

    // Step 2: Dashboard
    <div key={2} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-xl">
      <div className="bg-[#000] text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-bold text-sm">▲ Vercel</span>
          <span className="text-xs text-gray-400">Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-[10px]">U</div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Projects</h3>
          <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <span>+</span> Add New...
          </button>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500 mb-3">No projects yet</p>
          <button className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium">
            Import Project
          </button>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-[10px] text-blue-700">💡 Нажмите "Add New..." → "Project" для импорта</p>
        </div>
      </div>
    </div>,

    // Step 3: Import Git Repository
    <div key={3} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-xl">
      <div className="bg-[#000] text-white px-4 py-2 flex items-center gap-4">
        <span className="font-bold text-sm">▲ Vercel</span>
        <span className="text-xs text-gray-400">Import Git Repository</span>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-1">Import Git Repository</h3>
        <p className="text-xs text-gray-500 mb-4">Select a repository to deploy</p>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <input type="text" placeholder="Search repositories..." className="text-xs bg-white border border-gray-200 rounded px-2 py-1 w-full" />
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { name: 'wb-analytics', desc: 'WB Analytics Pro — Аналитика продаж', selected: true },
              { name: 'my-portfolio', desc: 'Personal portfolio website', selected: false },
              { name: 'react-experiments', desc: 'React experiments', selected: false },
            ].map((repo) => (
              <div key={repo.name} className={`flex items-center justify-between px-4 py-3 ${repo.selected ? 'bg-purple-50' : 'hover:bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <Github size={16} className="text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{repo.name}</p>
                    <p className="text-[10px] text-gray-500">{repo.desc}</p>
                  </div>
                </div>
                <button className={`text-xs px-3 py-1 rounded ${repo.selected ? 'bg-purple-600 text-white' : 'border border-gray-300 text-gray-600'}`}>
                  {repo.selected ? '✓ Selected' : 'Select'}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100">
          <p className="text-[10px] text-green-700">💡 Выберите репозиторий wb-analytics и нажмите Import</p>
        </div>
      </div>
    </div>,

    // Step 4: Framework Preset
    <div key={4} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-xl">
      <div className="bg-[#000] text-white px-4 py-2 flex items-center gap-4">
        <span className="font-bold text-sm">▲ Vercel</span>
        <span className="text-xs text-gray-400">Configure Project</span>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Configure Project</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Framework Preset</label>
            <div className="border border-purple-400 rounded-lg p-3 bg-purple-50">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚡</span>
                <span className="text-sm font-medium">Vite</span>
                <span className="ml-auto text-[10px] text-green-600">✓ Auto-detected</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Build Command</label>
              <input type="text" defaultValue="npm run build" className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Output Directory</label>
              <input type="text" defaultValue="dist" className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Environment Variables</label>
            <div className="border border-gray-200 rounded-lg p-2 space-y-2">
              <div className="flex gap-2">
                <input type="text" placeholder="Key" defaultValue="VITE_WB_API_KEY" className="flex-1 border border-gray-200 rounded px-2 py-1 text-xs" />
                <input type="text" placeholder="Value" defaultValue="••••••••" className="flex-1 border border-gray-200 rounded px-2 py-1 text-xs" />
              </div>
            </div>
          </div>
        </div>
        <button className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700">
          Deploy
        </button>
      </div>
    </div>,

    // Step 5: Deploying
    <div key={5} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-xl">
      <div className="bg-[#000] text-white px-4 py-2 flex items-center gap-4">
        <span className="font-bold text-sm">▲ Vercel</span>
        <span className="text-xs text-gray-400">Deploying...</span>
      </div>
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-3">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-lg font-bold text-gray-800">Building your project...</h3>
          <p className="text-xs text-gray-500">This usually takes 30-60 seconds</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 font-mono text-[10px] space-y-1">
          <p className="text-gray-500">$ npm run build</p>
          <p className="text-green-600">✓ vite v6.4.3 building for production...</p>
          <p className="text-green-600">✓ 1983 modules transformed</p>
          <p className="text-green-600">✓ built in 8.76s</p>
          <p className="text-blue-600 animate-pulse">→ Deploying to edge network...</p>
        </div>
      </div>
    </div>,

    // Step 6: Deployed!
    <div key={6} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-xl">
      <div className="bg-[#000] text-white px-4 py-2 flex items-center gap-4">
        <span className="font-bold text-sm">▲ Vercel</span>
        <span className="text-xs text-gray-400">Congratulations!</span>
      </div>
      <div className="p-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-3">
          <CheckCircle2 size={32} className="text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-1">Congratulations! 🎉</h3>
        <p className="text-sm text-gray-500 mb-4">Your project has been deployed.</p>
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-[10px] text-gray-500 mb-1">Production URL</p>
          <div className="flex items-center justify-center gap-2">
            <Globe size={14} className="text-purple-600" />
            <code className="text-sm font-mono font-bold text-purple-700">wb-analytics.vercel.app</code>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 bg-black text-white py-2 rounded-lg text-xs font-medium">
            View Dashboard
          </button>
          <button className="flex-1 border border-gray-200 text-gray-700 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1">
            <ExternalLink size={12} /> Visit Site
          </button>
        </div>
      </div>
    </div>,
  ];

  return screens[step - 1] || screens[0];
}

export default function VercelDeploy() {
  const [currentStep, setCurrentStep] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openTroubleshoot, setOpenTroubleshoot] = useState<number | null>(null);

  const totalSteps = 6;

  const steps = [
    {
      title: 'Регистрация на Vercel',
      description: 'Создаём аккаунт через GitHub',
      icon: Github,
      duration: '1 мин',
    },
    {
      title: 'Создание Dashboard',
      description: 'Переходим в панель управления',
      icon: Monitor,
      duration: '30 сек',
    },
    {
      title: 'Импорт репозитория',
      description: 'Выбираем проект на GitHub',
      icon: GitBranch,
      duration: '1 мин',
    },
    {
      title: 'Настройка проекта',
      description: 'Vercel автоопределит Vite',
      icon: Settings,
      duration: '1 мин',
    },
    {
      title: 'Сборка и деплой',
      description: 'Ждём 30-60 секунд',
      icon: Rocket,
      duration: '1 мин',
    },
    {
      title: 'Готово! 🎉',
      description: 'Сайт доступен по ссылке',
      icon: Globe,
      duration: '—',
    },
  ];

  const faqs = [
    {
      q: 'Сколько стоит Vercel?',
      a: 'Бесплатный план (Hobby) включает: неограниченное число сайтов, HTTPS, CDN по всему миру, 100 ГБ трафика/мес, автоматические деплои из Git. Этого более чем достаточно для старта.',
    },
    {
      q: 'Нужен ли свой домен?',
      a: 'Нет! Vercel автоматически выдаст бесплатный домен вида ваш-проект.vercel.app. Свой домен можно подключить позже — это делается в 2 клика в настройках проекта.',
    },
    {
      q: 'Как обновлять сайт?',
      a: 'Просто делайте git push в main ветку. Vercel автоматически пересоберёт и задеплоит новую версию за 30-60 секунд. Предыдущая версия остаётся доступной для отката.',
    },
    {
      q: 'Что если сборка падает?',
      a: 'Проверьте: 1) Node.js версия (должна быть 18+), 2) все зависимости в package.json, 3) логи сборки в дашборде Vercel. Часто помогает добавление "engines": {"node": "20.x"} в package.json.',
    },
    {
      q: 'Как подключить API-ключи WB?',
      a: 'В настройках проекта → Environment Variables. Добавьте VITE_WB_API_KEY. Для безопасности используйте серверный прокси — не храните ключи в клиентском коде.',
    },
    {
      q: 'Можно ли откатить деплой?',
      a: 'Да! В дашборде проекта → Deployments → нажмите "..." у нужного деплоя → "Promote to Production". Все предыдущие деплои хранятся.',
    },
  ];

  const troubleshoots = [
    {
      problem: 'Ошибка "Module not found"',
      solution: 'Убедитесь, что все зависимости установлены. Добавьте в package.json:\n"engines": {"node": "20.x"}\n\nИ проверьте, что все пакеты указаны в dependencies, а не devDependencies.',
    },
    {
      problem: 'Белый экран после деплоя',
      solution: 'Это проблема с роутингом. Создайте файл vercel.json в корне проекта:\n{\n  "rewrites": [\n    { "source": "/(.*)", "destination": "/index.html" }\n  ]\n}',
    },
    {
      problem: 'Сборка занимает слишком долго',
      solution: 'Добавьте кэш зависимостей. Vercel автоматически кэширует node_modules, но можно ускорить, удалив неиспользуемые пакеты и добавив .vercelignore для исключения тестов.',
    },
    {
      problem: 'Ошибка CORS при запросах к WB API',
      solution: 'Wildberries API не поддерживает CORS для браузера. Создайте серверный прокси на Vercel Edge Functions или используйте отдельный бэкенд (Railway/Render).',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-3xl">▲</span>
            Деплой на Vercel
          </h2>
          <p className="text-gray-500 mt-1">Пошаговая инструкция с визуальными примерами</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl border border-green-200">
          <Clock size={16} className="text-green-600" />
          <span className="text-sm font-medium text-green-700">Всего ~5 минут</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Прогресс развёртывания</h3>
          <span className="text-sm text-gray-500">Шаг {currentStep} из {totalSteps}</span>
        </div>
        <div className="flex items-center gap-1">
          {steps.map((step, index) => (
            <div key={index} className="flex-1">
              <button
                onClick={() => setCurrentStep(index + 1)}
                className={`w-full h-2 rounded-full transition-all ${
                  index + 1 <= currentStep ? 'bg-gradient-to-r from-purple-500 to-indigo-600' : 'bg-gray-200'
                }`}
              />
              <div className="mt-2 flex items-center gap-1">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    index + 1 < currentStep
                      ? 'bg-green-500 text-white'
                      : index + 1 === currentStep
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index + 1 < currentStep ? <Check size={10} /> : index + 1}
                </div>
                <span className={`text-[10px] hidden lg:block ${index + 1 === currentStep ? 'text-purple-700 font-medium' : 'text-gray-500'}`}>
                  {step.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Steps list */}
        <div className="lg:col-span-2 space-y-2">
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index + 1)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                currentStep === index + 1
                  ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 shadow-md'
                  : 'bg-white border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    currentStep === index + 1
                      ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <step.icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${currentStep === index + 1 ? 'text-purple-800' : 'text-gray-800'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                  <p className="text-[10px] text-gray-400 mt-1">⏱ {step.duration}</p>
                </div>
                {currentStep === index + 1 && (
                  <ChevronRight size={16} className="text-purple-600 flex-shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Right: Mockup + Details */}
        <div className="lg:col-span-3 space-y-4">
          {/* Visual Mockup */}
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                <Eye size={12} /> Превью интерфейса
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  className="p-1.5 rounded-lg bg-white border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
                  disabled={currentStep === totalSteps}
                  className="p-1.5 rounded-lg bg-white border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
            <VercelMockup step={currentStep} />
          </div>

          {/* Step Details */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center text-xs font-bold">
                {currentStep}
              </span>
              <h4 className="font-bold text-gray-800">{steps[currentStep - 1].title}</h4>
            </div>

            {currentStep === 1 && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Откройте <a href="https://vercel.com/signup" target="_blank" rel="noreferrer" className="text-purple-600 underline font-medium">vercel.com/signup</a> и выберите способ входа.
                </p>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                  <p className="text-xs text-blue-800 font-medium mb-1">💡 Рекомендуем</p>
                  <p className="text-xs text-blue-700">Войдите через <strong>GitHub</strong> — это упростит импорт репозитория в следующем шаге.</p>
                </div>
                <p className="text-sm text-gray-600">
                  После входа Vercel запросит доступ к вашим репозиториям. Разрешите доступ ко всем или только к нужным.
                </p>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  После входа вы попадёте в Dashboard. Если у вас ещё нет проектов — нажмите кнопку <strong>"Add New..."</strong> в правом верхнем углу.
                </p>
                <p className="text-sm text-gray-600">
                  В выпадающем меню выберите <strong>"Project"</strong>.
                </p>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Вы увидите список ваших репозиториев на GitHub. Найдите <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">wb-analytics</code> и нажмите <strong>"Select"</strong>.
                </p>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                  <p className="text-xs text-amber-800 font-medium mb-1">⚠️ Нет репозитория?</p>
                  <p className="text-xs text-amber-700">Сначала загрузите код на GitHub:</p>
                </div>
                <CodeBlock code={`# Инициализация Git
git init
git add .
git commit -m "WB Analytics Pro"

# Создание репозитория на GitHub и push
git remote add origin https://github.com/ваш-username/wb-analytics.git
git branch -M main
git push -u origin main`} />
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Vercel автоматически определит фреймворк. Проверьте настройки:
                </p>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Framework Preset:</span>
                    <span className="font-mono font-medium text-purple-700">Vite ✓</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Build Command:</span>
                    <span className="font-mono font-medium">npm run build</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Output Directory:</span>
                    <span className="font-mono font-medium">dist</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Install Command:</span>
                    <span className="font-mono font-medium">npm install</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  В разделе <strong>Environment Variables</strong> добавьте API-ключи:
                </p>
                <CodeBlock code={`VITE_WB_API_KEY=eyJhbGciOiJ...ваш_ключ_wb
VITE_API_BASE_URL=https://statistics-api.wildberries.ru`} />
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Нажмите кнопку <strong>"Deploy"</strong> и подождите 30-60 секунд. Vercel выполнит:
                </p>
                <div className="space-y-2">
                  {[
                    'Клонирование репозитория',
                    'Установка зависимостей (npm install)',
                    'Сборка проекта (npm run build)',
                    'Оптимизация и минификация',
                    'Деплой на CDN по всему миру',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="font-bold text-green-800 flex items-center gap-2 mb-2">
                    <CheckCircle2 size={18} /> Поздравляем! Сайт в сети!
                  </p>
                  <p className="text-sm text-green-700 mb-2">Ваш сайт доступен по адресу:</p>
                  <div className="bg-white rounded-lg p-3 border border-green-200 flex items-center gap-2">
                    <Globe size={16} className="text-purple-600" />
                    <code className="text-sm font-mono font-bold text-purple-700">https://wb-analytics.vercel.app</code>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Теперь при каждом <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">git push</code> в main ветку сайт будет автоматически обновляться.
                </p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 hover:text-purple-700 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} /> Назад
              </button>
              <button
                onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
                disabled={currentStep === totalSteps}
                className="flex items-center gap-1 px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Далее <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CLI Alternative */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <Terminal size={20} />
          </div>
          <div>
            <h3 className="font-bold">Альтернатива: Деплой через CLI</h3>
            <p className="text-xs text-gray-400">Для тех, кто любит терминал</p>
          </div>
        </div>
        <CodeBlock code={`# Установка Vercel CLI
npm i -g vercel

# В папке проекта
cd wb-analytics

# Деплой (интерактивный мастер)
vercel

# Деплой в production
vercel --prod`} />
        <p className="text-xs text-gray-400 mt-3">
          CLI задаст те же вопросы, что и веб-интерфейс, и задеплоит проект.
        </p>
      </div>

      {/* Post-deploy: Custom Domain */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
          <Link2 size={18} className="text-purple-600" />
          Подключение своего домена (опционально)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
              <span className="text-purple-700 font-bold text-sm">1</span>
            </div>
            <p className="text-sm font-medium text-gray-800">Settings → Domains</p>
            <p className="text-xs text-gray-500 mt-1">В дашборде проекта откройте настройки и перейдите в раздел Domains</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
              <span className="text-purple-700 font-bold text-sm">2</span>
            </div>
            <p className="text-sm font-medium text-gray-800">Введите домен</p>
            <p className="text-xs text-gray-500 mt-1">Например: <code className="bg-white px-1 rounded">analytics.myshop.ru</code></p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
              <span className="text-purple-700 font-bold text-sm">3</span>
            </div>
            <p className="text-sm font-medium text-gray-800">Добавьте DNS-записи</p>
            <p className="text-xs text-gray-500 mt-1">Vercel покажет нужные записи — скопируйте их к регистратору домена</p>
          </div>
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <AlertCircle size={18} className="text-amber-600" />
            Решение проблем
          </h3>
          <p className="text-xs text-gray-500 mt-1">Если что-то пошло не так</p>
        </div>
        <div className="divide-y divide-gray-100">
          {troubleshoots.map((t, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenTroubleshoot(openTroubleshoot === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-800 text-left">{t.problem}</span>
                {openTroubleshoot === i ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
              </button>
              {openTroubleshoot === i && (
                <div className="px-6 pb-4">
                  <pre className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 rounded-lg p-4 font-mono">{t.solution}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            💬 Частые вопросы
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors text-left"
              >
                <span className="text-sm font-medium text-gray-800">{faq.q}</span>
                {openFaq === i ? <ChevronDown size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />}
              </button>
              {openFaq === i && (
                <div className="px-6 pb-4">
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Useful Links */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
        <h3 className="font-bold text-gray-800 mb-4">🔗 Полезные ссылки</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { title: 'Vercel Dashboard', url: 'https://vercel.com/dashboard', icon: Monitor },
            { title: 'Документация Vercel', url: 'https://vercel.com/docs', icon: FileCode },
            { title: 'Vercel CLI', url: 'https://vercel.com/docs/cli', icon: Terminal },
            { title: 'Vite + Vercel Guide', url: 'https://vercel.com/guides/deploying-vite-with-vercel', icon: Zap },
          ].map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all"
            >
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <link.icon size={16} className="text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{link.title}</p>
                <p className="text-[10px] text-gray-500 truncate">{link.url}</p>
              </div>
              <ExternalLink size={14} className="text-gray-400 flex-shrink-0" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
