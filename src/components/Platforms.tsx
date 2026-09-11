import { Globe, Smartphone, MessageCircle, Monitor, QrCode, ExternalLink, Check, Zap, Shield, Clock } from 'lucide-react';

export default function Platforms() {
  const platforms = [
    {
      id: 'web',
      title: 'Веб-приложение',
      subtitle: 'Полный функционал в браузере',
      description: 'Полноценный дашборд с аналитикой, графиками, ИИ-аналитиком и рекомендациями. Работает на любом устройстве.',
      icon: Monitor,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      features: [
        'Полный дашборд аналитики',
        'ИИ-аналитик с чатом',
        'Рекомендации по остаткам',
        'Экспорт отчётов в PDF/Excel',
        'Мультиаккаунт',
      ],
      status: 'active',
      link: '#',
    },
    {
      id: 'mobile',
      title: 'Мобильное приложение',
      subtitle: 'iOS & Android',
      description: 'Нативное приложение с push-уведомлениями о критических остатках и быстрым доступом к аналитике.',
      icon: Smartphone,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      features: [
        'Push-уведомления',
        'Быстрый доступ к сводке',
        'Offline-режим',
        'Биометрическая авторизация',
        'Виджеты для домашнего экрана',
      ],
      status: 'soon',
      link: '#',
    },
    {
      id: 'telegram',
      title: 'Telegram Бот',
      subtitle: '@WBAnalyticsBot',
      description: 'Мгновенные уведомления и быстрые команды прямо в Telegram. Не нужно устанавливать приложение.',
      icon: MessageCircle,
      color: 'from-sky-500 to-blue-500',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-200',
      features: [
        'Ежедневные сводки',
        'Алерты по остаткам',
        'Быстрые команды (/sales, /stock, /forecast)',
        'ИИ-аналитик в чате',
        'Кнопки быстрого действия',
      ],
      status: 'active',
      link: '#',
    },
  ];

  const telegramCommands = [
    { cmd: '/start', desc: 'Начать работу с ботом' },
    { cmd: '/sales', desc: 'Сводка продаж за сегодня' },
    { cmd: '/week', desc: 'Отчёт за неделю' },
    { cmd: '/month', desc: 'Отчёт за месяц' },
    { cmd: '/stock', desc: 'Критические остатки' },
    { cmd: '/forecast', desc: 'Прогноз продаж' },
    { cmd: '/ai <вопрос>', desc: 'Задать вопрос ИИ-аналитику' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Кроссплатформенный доступ</h2>
        <p className="text-gray-500 mt-1">Управляйте аналитикой продаж с любого устройства</p>
      </div>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className={`bg-white rounded-2xl p-6 border ${platform.borderColor} shadow-sm hover:shadow-lg transition-all relative overflow-hidden`}
          >
            {platform.status === 'soon' && (
              <div className="absolute top-4 right-4 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                Скоро
              </div>
            )}
            {platform.status === 'active' && (
              <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                Доступно
              </div>
            )}

            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${platform.color} flex items-center justify-center mb-4`}>
              <platform.icon size={24} className="text-white" />
            </div>

            <h3 className="text-lg font-bold text-gray-800">{platform.title}</h3>
            <p className="text-xs text-gray-500 mb-2">{platform.subtitle}</p>
            <p className="text-sm text-gray-600 mb-4">{platform.description}</p>

            <ul className="space-y-2 mb-5">
              {platform.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={14} className="text-green-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${
                platform.status === 'active'
                  ? `bg-gradient-to-r ${platform.color} text-white hover:opacity-90`
                  : 'bg-gray-100 text-gray-500 cursor-not-allowed'
              }`}
              disabled={platform.status === 'soon'}
            >
              {platform.status === 'active' ? 'Открыть' : 'Скоро'}
            </button>
          </div>
        ))}
      </div>

      {/* Telegram Bot Details */}
      <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-6 border border-sky-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-500 rounded-xl flex items-center justify-center">
            <MessageCircle size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Telegram Бот — Команды</h3>
            <p className="text-xs text-gray-500">@WBAnalyticsBot</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {telegramCommands.map((cmd) => (
            <div key={cmd.cmd} className="flex items-center gap-3 bg-white/70 rounded-xl px-4 py-2.5">
              <code className="text-sm font-mono font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">{cmd.cmd}</code>
              <span className="text-sm text-gray-600">{cmd.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Zap size={18} className="text-purple-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 text-sm">Мгновенные уведомления</h4>
            <p className="text-xs text-gray-500 mt-1">Алерты о критических остатках приходят за 24 часа до обнуления</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield size={18} className="text-green-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 text-sm">Безопасность данных</h4>
            <p className="text-xs text-gray-500 mt-1">Шифрование API-ключей и двухфакторная аутентификация</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Clock size={18} className="text-amber-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 text-sm">Обновление в реальном времени</h4>
            <p className="text-xs text-gray-500 mt-1">Данные синхронизируются с WB каждые 15 минут</p>
          </div>
        </div>
      </div>
    </div>
  );
}
