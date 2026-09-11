import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, MessageSquare } from 'lucide-react';
import { useWBApi } from '../services/wbApi';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

const quickActions = [
  { label: '📊 Как продажи?', key: 'sales' },
  { label: '📦 Что пополнить?', key: 'stock' },
  { label: '🔮 Прогноз', key: 'forecast' },
  { label: '💡 Помощь', key: 'default' },
];

export default function AIChat() {
  const { user } = useAuth();
  const { getSales, getStockRecommendations } = useWBApi();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: 'Привет! Я ваш ИИ-аналитик продаж на Wildberries. Могу помочь с анализом продаж, рекомендациями по остаткам и прогнозами. Что вас интересует?',
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Генерация ответа на основе реальных данных
  const generateResponse = async (query: string): Promise<string> => {
    const lowerQuery = query.toLowerCase();

    try {
      // Запрос о продажах
      if (lowerQuery.includes('продаж') || lowerQuery.includes('выруч') || lowerQuery.includes('сводк')) {
        const salesData = await getSales();
        const yesterday = salesData.yesterday;
        const week = salesData.week;
        const month = salesData.month;

        // Получаем топ-5 товаров за месяц
        const topProducts = salesData.topProducts?.slice(0, 5) || [];

        let response = `📊 **Сводка продаж из вашего кабинета WB:**\n\n` +
          `**Вчера:**\n` +
          `• Выручка: ${yesterday.revenue.toLocaleString('ru-RU')} ₽\n` +
          `• Заказов: ${yesterday.orders}\n` +
          `• Средний чек: ${yesterday.avgCheck.toLocaleString('ru-RU')} ₽\n` +
          `• Возвратов: ${yesterday.returns}\n\n` +
          `**За неделю:**\n` +
          `• Выручка: ${week.revenue.toLocaleString('ru-RU')} ₽\n` +
          `• Заказов: ${week.orders}\n` +
          `• Средний чек: ${week.avgCheck.toLocaleString('ru-RU')} ₽\n\n` +
          `**За месяц:**\n` +
          `• Выручка: ${month.revenue.toLocaleString('ru-RU')} ₽\n` +
          `• Заказов: ${month.orders}\n` +
          `• Средний чек: ${month.avgCheck.toLocaleString('ru-RU')} ₽\n\n`;

        if (topProducts.length > 0) {
          response += `**🏆 Топ-5 товаров за месяц:**\n`;
          topProducts.forEach((product: any, index: number) => {
            response += `${index + 1}. Артикул ${product.nmId} - ${product.orders} заказов (${product.revenue.toLocaleString('ru-RU')} ₽)\n`;
          });
          response += `\n`;
        }

        response += `💡 Данные получены из вашего кабинета Wildberries в реальном времени.`;
        return response;
      }

      // Запрос об остатках
      if (lowerQuery.includes('остат') || lowerQuery.includes('пополн') || lowerQuery.includes('запас')) {
        const recommendations = await getStockRecommendations();
        const critical = recommendations.filter(r => r.urgency === 'critical');
        const warning = recommendations.filter(r => r.urgency === 'warning');

        let response = `📦 **Рекомендации по пополнению из вашего кабинета WB:**\n\n`;

        if (critical.length > 0) {
          response += `🔴 **КРИТИЧНО (${critical.length} товаров):**\n`;
          critical.slice(0, 5).forEach(rec => {
            response += `• **${rec.productName}**\n`;
            response += `  WB: ${rec.productId}`;
            if (rec.vendorCode) response += ` | Продавец: ${rec.vendorCode}`;
            if (rec.barcode) response += ` | Баркод: ${rec.barcode}`;
            response += `\n`;
            response += `  Остаток WB: ${rec.currentStockWB} шт. | Склад продавца: ${rec.currentStockSeller} шт.\n`;
            response += `  ${rec.reason}\n`;
            if (rec.recommendedOrder > 0) {
              response += `  ➡️ Заказать: ${rec.recommendedOrder} шт.\n`;
            }
            response += `\n`;
          });
        }

        if (warning.length > 0) {
          response += `🟡 **ВНИМАНИЕ (${warning.length} товаров):**\n`;
          warning.slice(0, 3).forEach(rec => {
            response += `• **${rec.productName}** (WB: ${rec.productId}`;
            if (rec.vendorCode) response += `, ${rec.vendorCode}`;
            response += `) - ${rec.reason}\n`;
          });
        }

        if (critical.length === 0 && warning.length === 0) {
          response += `✅ Все товары в норме! Критических остатков не обнаружено.`;
        }

        response += `\n💡 Данные получены из вашего кабинета Wildberries.`;
        return response;
      }

      // Прогноз
      if (lowerQuery.includes('прогноз') || lowerQuery.includes('будет') || lowerQuery.includes('ожид')) {
        try {
          const salesData = await getSales();
          const month = salesData.month;

          // Простой прогноз на основе средних значений
          const avgDailyRevenue = month.revenue / 30;
          const avgDailyOrders = month.orders / 30;
          const forecastRevenue = Math.round(avgDailyRevenue * 7);
          const forecastOrders = Math.round(avgDailyOrders * 7);

          return `🔮 **Прогноз на следующую неделю:**\n\n` +
            `На основе данных из вашего кабинета WB:\n\n` +
            `• Ожидаемая выручка: ${forecastRevenue.toLocaleString('ru-RU')} ₽\n` +
            `• Ожидаемые заказы: ${forecastOrders}\n` +
            `• Средний дневной доход: ${Math.round(avgDailyRevenue).toLocaleString('ru-RU')} ₽\n\n` +
            `💡 Прогноз основан на данных за последний месяц из вашего кабинета Wildberries.`;
        } catch (error) {
          return `🔮 **Прогноз на следующую неделю:**\n\n` +
            `Не удалось получить данные для прогноза. Проверьте подключение API-ключа.\n\n` +
            `💡 Прогноз рассчитывается на основе данных за последний месяц.`;
        }
      }

      // По умолчанию
      return `Я могу помочь вам с:\n\n` +
        `📊 **Анализом продаж** - спросите "как продажи?"\n` +
        `📦 **Рекомендациями по остаткам** - спросите "что пополнить?"\n` +
        `🔮 **Прогнозами** - спросите "прогноз на неделю"\n\n` +
        `Все данные берутся из вашего кабинета Wildberries в реальном времени.`;

    } catch (error) {
      console.error('Ошибка генерации ответа:', error);
      return `⚠️ Не удалось получить данные из WB API. Проверьте подключение API-ключа в настройках профиля.`;
    }
  };

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMsg: Message = {
      id: messages.length + 1,
      text: messageText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Генерируем ответ на основе реальных данных
    try {
      const responseText = await generateResponse(messageText);

      const aiMsg: Message = {
        id: messages.length + 2,
        text: responseText,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error('Ошибка:', error);
      const errorMsg: Message = {
        id: messages.length + 2,
        text: '⚠️ Произошла ошибка при получении данных. Попробуйте ещё раз.',
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">ИИ Аналитик</h2>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Онлайн — Бесплатный тариф
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1.5 rounded-full">
          <Sparkles size={14} className="text-purple-600" />
          <span className="text-xs font-medium text-purple-700">GPT-powered</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mb-4">
        {quickActions.map((action) => (
          <button
            key={action.key}
            onClick={() => handleSend(action.label)}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 transition-all"
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 bg-gray-50/50 rounded-2xl p-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                msg.sender === 'ai'
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                  : 'bg-gradient-to-br from-blue-500 to-cyan-500'
              }`}
            >
              {msg.sender === 'ai' ? <Bot size={14} className="text-white" /> : <User size={14} className="text-white" />}
            </div>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                msg.sender === 'ai'
                  ? 'bg-white border border-gray-100 shadow-sm'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
              }`}
            >
              <p className="text-sm whitespace-pre-line leading-relaxed">{msg.text}</p>
              <p className={`text-[10px] mt-1 ${msg.sender === 'ai' ? 'text-gray-400' : 'text-white/60'}`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Bot size={14} className="text-white" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-2">
        <div className="flex-1 relative">
          <MessageSquare size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Спросите что-нибудь о продажах..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
          />
        </div>
        <button
          onClick={() => handleSend()}
          disabled={!input.trim()}
          className="px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
