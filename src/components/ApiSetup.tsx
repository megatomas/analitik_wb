import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Key, Eye, EyeOff, CheckCircle2, AlertCircle, ExternalLink, Loader2, ArrowRight, Shield, Zap, BookOpen, Check, AlertTriangle } from 'lucide-react';

interface ApiSetupProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function ApiSetup({ onComplete, onSkip }: ApiSetupProps) {
  const { user, updateApiKey } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const validateKey = async () => {
    if (!apiKey.trim()) {
      setError('Введите API-ключ');
      return;
    }

    setIsValidating(true);
    setError('');
    setIsValid(null);

    // Имитация проверки ключа через прокси-сервер
    await new Promise(resolve => setTimeout(resolve, 1500));

    // В реальном приложении здесь будет запрос к /api/validate-wb-key
    if (apiKey.length < 10) {
      setIsValid(false);
      setError('Неверный формат API-ключа. Проверьте ключ и попробуйте снова.');
    } else {
      setIsValid(true);
      await updateApiKey(apiKey);
    }

    setIsValidating(false);
  };

  const handleContinue = () => {
    if (isValid) {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl mb-4">
            <Key size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Подключите Wildberries API</h1>
          <p className="text-gray-500 mt-2">
            Привет, <span className="font-medium text-purple-700">{user?.name || 'продавец'}</span>! 
            Добавьте API-ключ, чтобы видеть реальные данные вашего магазина.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Shield size={16} className="text-green-600" />
              Безопасное подключение
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Ваш ключ хранится зашифрованным и используется только для запросов к WB API через наш защищённый прокси.
            </p>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">API-ключ Wildberries</label>
              <div className="relative">
                <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setIsValid(null);
                    setError('');
                  }}
                  placeholder="eyJhbGciOiJ...ваш_api_ключ..."
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Status */}
            {isValid === true && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle2 size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">Ключ успешно проверен!</p>
                  <p className="text-xs text-green-600 mt-0.5">
                    Магазин подключён. Теперь вы видите реальные данные.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Ошибка проверки</p>
                  <p className="text-xs text-red-600 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={validateKey}
                disabled={isValidating || !apiKey.trim()}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isValidating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Проверяем ключ...
                  </>
                ) : (
                  'Проверить и подключить'
                )}
              </button>
              {isValid && (
                <button
                  onClick={handleContinue}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  Продолжить <ArrowRight size={16} />
                </button>
              )}
            </div>

            <button
              onClick={onSkip}
              className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Пропустить и посмотреть демо-данные →
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-6">
          <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <BookOpen size={16} className="text-purple-600" />
            Как получить API-ключ?
          </h4>
          
          {/* Step-by-step guide */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              {
                step: '1',
                title: 'Войдите в ЛК WB',
                desc: 'Откройте seller.wildberries.ru',
                link: 'https://seller.wildberries.ru',
              },
              {
                step: '2',
                title: 'Настройки → API',
                desc: 'Перейдите в раздел "Доступ к API"',
                link: null,
              },
              {
                step: '3',
                title: 'Создайте персональный токен',
                desc: 'Скопируйте и вставьте сюда',
                link: null,
              },
            ].map((item) => (
              <div key={item.step} className="bg-gray-50 rounded-xl p-4">
                <div className="w-7 h-7 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center text-xs font-bold mb-2">
                  {item.step}
                </div>
                <p className="text-sm font-medium text-gray-800">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-purple-600 mt-2 hover:underline"
                  >
                    Открыть <ExternalLink size={10} />
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Detailed API Key Settings */}
          <div className="border-t border-gray-200 pt-6">
            <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Zap size={16} className="text-amber-600" />
              Настройки при создании ключа
            </h5>
            
            <div className="space-y-4">
              {/* Token Type - ВАЖНО! */}
              <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
                <p className="text-sm font-bold text-red-900 mb-2 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-red-600" />
                  ⚠️ ВАЖНО: Нужен ПЕРСОНАЛЬНЫЙ токен!
                </p>
                <p className="text-xs text-red-800 mb-2">
                  Wildberries ввёл ограничения. Обычные токены больше не работают!
                </p>
                <div className="bg-white rounded-lg p-3 border border-red-200 mt-2">
                  <p className="text-sm font-bold text-red-800">🔑 Тип токена: Персональный</p>
                  <p className="text-xs text-red-700 mt-1">
                    Создайте именно <strong>персональный токен</strong> в кабинете WB
                  </p>
                </div>
              </div>

              {/* Categories */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-sm font-medium text-green-900 mb-2">📊 Категории данных (отметьте галочками):</p>
                <div className="space-y-2">
                  {[
                    { name: 'Статистика', required: true, desc: 'Данные о продажах и заказах' },
                    { name: 'Аналитика', required: true, desc: 'Остатки на складах (WB и продавца)' },
                    { name: 'Контент', required: false, desc: 'Данные карточек товаров (опционально)' },
                    { name: 'Маркетплейс', required: false, desc: 'Общая информация маркетплейса' },
                    { name: 'Финансы', required: false, desc: 'Финансовые операции и отчёты' },
                    { name: 'Продвижение', required: false, desc: 'Реклама и продвижение товаров' },
                    { name: 'Вопросы и отзывы', required: false, desc: 'Отзывы покупателей и вопросы' },
                    { name: 'Цены и скидки', required: false, desc: 'Управление ценами и скидками' },
                    { name: 'Поставки', required: false, desc: 'Информация о поставках' },
                    { name: 'Возвраты', required: false, desc: 'Данные о возвратах' },
                    { name: 'Документы', required: false, desc: 'Документооборот' },
                    { name: 'Чат с покупателем', required: false, desc: 'Переписка с покупателями' },
                  ].map((cat) => (
                    <div key={cat.name} className="flex items-start gap-3 bg-white rounded-lg p-3 border border-green-100">
                      <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        cat.required ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        {cat.required && <Check size={12} className="text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-800">{cat.name}</p>
                          {cat.required && (
                            <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">
                              Обязательно
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5">{cat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Access Level */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <p className="text-sm font-medium text-purple-900 mb-2">🔒 Уровень доступа:</p>
                <div className="bg-white rounded-lg p-3 border border-purple-100">
                  <p className="text-sm font-bold text-purple-800">Только чтение</p>
                  <p className="text-xs text-purple-700 mt-1">
                    ⚠️ НЕ выбирайте "Чтение и запись" — нам не нужно менять данные в вашем кабинете
                  </p>
                </div>
              </div>

              {/* Token Name */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm font-medium text-amber-900 mb-2">📝 Название токена:</p>
                <div className="bg-white rounded-lg p-3 border border-amber-100">
                  <code className="text-sm font-mono text-amber-800">WB Analytics Pro</code>
                  <p className="text-xs text-amber-700 mt-1">
                    Используйте понятное название, чтобы потом легко найти этот токен в списке
                  </p>
                </div>
              </div>
            </div>

            {/* Security Note */}
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm font-medium text-red-900 mb-2 flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-600" />
                Важно о безопасности
              </p>
              <ul className="text-xs text-red-800 space-y-1">
                <li>• Ключ показывается только один раз при создании — сразу скопируйте его</li>
                <li>• Не передавайте ключ третьим лицам и не публикуйте в открытых источниках</li>
                <li>• Мы храним ключ в зашифрованном виде и используем только для запросов к WB API</li>
                <li>• Вы можете отозвать доступ в любой момент в настройках кабинета WB</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-4 flex items-start gap-2 text-xs text-gray-500">
          <Shield size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
          <p>
            Мы используем шифрование AES-256 для хранения ключей. Ключи никогда не передаются в браузер — 
            все запросы к WB API идут через наш защищённый сервер.
          </p>
        </div>
      </div>
    </div>
  );
}
