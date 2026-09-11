import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Key, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, Save, Trash2, Calendar, Shield, AlertTriangle } from 'lucide-react';

export default function ProfileSettings() {
  const { user, updateApiKey, logout } = useAuth();
  const [newApiKey, setNewApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleUpdateKey = async () => {
    if (!newApiKey.trim()) {
      setMessage({ type: 'error', text: 'Введите API-ключ' });
      return;
    }

    setIsValidating(true);
    setMessage(null);

    try {
      // Имитация проверки ключа
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (newApiKey.length < 10) {
        setMessage({ type: 'error', text: 'Неверный формат API-ключа' });
        setIsValidating(false);
        return;
      }

      const success = await updateApiKey(newApiKey);
      if (success) {
        setMessage({ type: 'success', text: 'API-ключ успешно обновлён!' });
        setNewApiKey('');
      } else {
        setMessage({ type: 'error', text: 'Не удалось обновить ключ' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка при обновлении ключа' });
    } finally {
      setIsValidating(false);
    }
  };

  const handleDeleteKey = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    try {
      await updateApiKey('');
      setMessage({ type: 'success', text: 'API-ключ удалён' });
      setConfirmDelete(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка при удалении ключа' });
    }
  };

  // Получаем дату создания ключа из профиля или вычисляем
  const keyCreatedAt = user?.apiKeyCreatedAt ? new Date(user.apiKeyCreatedAt) : 
                       (user?.wbApiKey ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) : null);
  const keyExpiresAt = keyCreatedAt ? new Date(keyCreatedAt.getTime() + 365 * 24 * 60 * 60 * 1000) : null; // +1 год
  const daysUntilExpiry = keyExpiresAt ? Math.ceil((keyExpiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Настройки профиля</h2>
        <p className="text-gray-500 mt-1">Управление аккаунтом и API-ключом</p>
      </div>

      {/* User Info */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Shield size={18} className="text-purple-600" />
          Информация об аккаунте
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Имя</span>
            <span className="text-sm font-medium text-gray-800">{user?.name || 'Не указано'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Email</span>
            <span className="text-sm font-medium text-gray-800">{user?.email}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-600">Дата регистрации</span>
            <span className="text-sm font-medium text-gray-800">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* API Key Section */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Key size={18} className="text-purple-600" />
          API-ключ Wildberries
        </h3>

        {/* Current Key Info */}
        {user?.wbApiKey && (
          <div className="mb-6 space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900 mb-1">API-ключ активен</p>
                  <p className="text-xs text-green-700">
                    Ключ: <code className="bg-white/50 px-1.5 py-0.5 rounded font-mono">
                      {showKey ? user.wbApiKey : `${user.wbApiKey.substring(0, 20)}...`}
                    </code>
                  </p>
                </div>
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="text-green-700 hover:text-green-900"
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Key Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={14} className="text-gray-500" />
                  <span className="text-xs text-gray-600">Дата создания</span>
                </div>
                <p className="text-sm font-medium text-gray-800">
                  {keyCreatedAt?.toLocaleDateString('ru-RU') || '—'}
                </p>
              </div>

              <div className={`rounded-xl p-4 ${daysUntilExpiry <= 30 ? 'bg-amber-50' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={14} className={daysUntilExpiry <= 30 ? 'text-amber-600' : 'text-gray-500'} />
                  <span className="text-xs text-gray-600">Действует до</span>
                </div>
                <p className={`text-sm font-medium ${daysUntilExpiry <= 30 ? 'text-amber-800' : 'text-gray-800'}`}>
                  {keyExpiresAt?.toLocaleDateString('ru-RU') || '—'}
                </p>
                <p className={`text-xs mt-0.5 ${daysUntilExpiry <= 30 ? 'text-amber-600' : 'text-gray-500'}`}>
                  {daysUntilExpiry > 0 ? `Осталось ${daysUntilExpiry} дней` : 'Истёк'}
                </p>
              </div>
            </div>

            {/* Expiry Warning */}
            {daysUntilExpiry <= 30 && daysUntilExpiry > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-900">Срок действия скоро истекает</p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Рекомендуется обновить ключ в кабинете Wildberries до истечения срока действия.
                  </p>
                </div>
              </div>
            )}

            {daysUntilExpiry <= 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900">Срок действия ключа истёк</p>
                  <p className="text-xs text-red-700 mt-0.5">
                    Создайте новый ключ в кабинете Wildberries и обновите его здесь.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Update Key Form */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              {user?.wbApiKey ? 'Новый API-ключ' : 'API-ключ Wildberries'}
            </label>
            <div className="relative">
              <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showKey ? 'text' : 'password'}
                value={newApiKey}
                onChange={(e) => setNewApiKey(e.target.value)}
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

          {message && (
            <div className={`rounded-xl p-4 flex items-start gap-3 ${
              message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle2 size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <p className={`text-sm ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {message.text}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleUpdateKey}
              disabled={isValidating || !newApiKey.trim()}
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isValidating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Проверка...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {user?.wbApiKey ? 'Обновить ключ' : 'Сохранить ключ'}
                </>
              )}
            </button>

            {user?.wbApiKey && (
              <button
                onClick={handleDeleteKey}
                disabled={isValidating}
                className={`px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 ${
                  confirmDelete
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                }`}
              >
                <Trash2 size={16} />
                {confirmDelete ? 'Подтвердить' : 'Удалить'}
              </button>
            )}
          </div>

          {confirmDelete && (
            <p className="text-xs text-red-600 text-center">
              Нажмите ещё раз для подтверждения удаления ключа
            </p>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h4 className="font-semibold text-blue-900 mb-3">💡 Как обновить API-ключ?</h4>
        <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
          <li>Войдите в <a href="https://seller.wildberries.ru" target="_blank" rel="noreferrer" className="underline">кабинет WB</a></li>
          <li>Перейдите в Настройки → Доступ к API</li>
          <li>Создайте новый токен с правами: <strong>Статистика</strong> + <strong>Аналитика</strong></li>
          <li>Скопируйте ключ и вставьте в поле выше</li>
          <li>Нажмите "Обновить ключ"</li>
        </ol>
      </div>

      {/* Rate Limit Info */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
          <AlertTriangle size={18} className="text-amber-600" />
          Лимиты запросов WB API
        </h4>
        <div className="text-sm text-amber-800 space-y-2">
          <p>Wildberries ограничивает количество запросов к API:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Не более <strong>10 запросов в минуту</strong></li>
            <li>Не более <strong>100 запросов в час</strong></li>
          </ul>
          <p className="mt-2">
            <strong>Решение:</strong> Данные кэшируются на 5 минут. Если видите ошибку 429, подождите 1-2 минуты и обновите страницу.
          </p>
        </div>
      </div>

      {/* Logout */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <button
          onClick={logout}
          className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
        >
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
}
