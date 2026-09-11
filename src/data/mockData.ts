export const salesData = {
  yesterday: {
    revenue: 284500,
    orders: 156,
    avgCheck: 1824,
    returns: 12,
    conversion: 4.2,
  },
  week: {
    revenue: 1856700,
    orders: 1024,
    avgCheck: 1813,
    returns: 78,
    conversion: 4.5,
  },
  month: {
    revenue: 7234000,
    orders: 4102,
    avgCheck: 1763,
    returns: 298,
    conversion: 4.1,
  },
};

export const revenueChart = [
  { date: '01.06', revenue: 210000, orders: 120 },
  { date: '02.06', revenue: 245000, orders: 135 },
  { date: '03.06', revenue: 198000, orders: 110 },
  { date: '04.06', revenue: 312000, orders: 168 },
  { date: '05.06', revenue: 278000, orders: 152 },
  { date: '06.06', revenue: 295000, orders: 161 },
  { date: '07.06', revenue: 284500, orders: 156 },
];

export const topProducts = [
  { id: 1, name: 'Кроссовки Nike Air Max', sku: 'WB-10234', sales: 342, revenue: 1539000, stock: 45, daysLeft: 3 },
  { id: 2, name: 'Сумка кожаная женская', sku: 'WB-20456', sales: 289, revenue: 867000, stock: 120, daysLeft: 12 },
  { id: 3, name: 'Часы наручные мужские', sku: 'WB-30789', sales: 198, revenue: 1188000, stock: 15, daysLeft: 2 },
  { id: 4, name: 'Футболка хлопок oversize', sku: 'WB-40123', sales: 567, revenue: 567000, stock: 230, daysLeft: 15 },
  { id: 5, name: 'Рюкзак городской', sku: 'WB-50567', sales: 145, revenue: 435000, stock: 8, daysLeft: 1 },
];

export const stockRecommendations = [
  {
    productId: 1,
    productName: 'Кроссовки Nike Air Max',
    currentStock: 45,
    dailySales: 15,
    daysUntilStockout: 3,
    recommendedOrder: 150,
    urgency: 'critical' as const,
    reason: 'Высокий спрос, тренд роста +23% за неделю',
  },
  {
    productId: 3,
    productName: 'Часы наручные мужские',
    currentStock: 15,
    dailySales: 7,
    daysUntilStockout: 2,
    recommendedOrder: 80,
    urgency: 'critical' as const,
    reason: 'Критический остаток, сезонный пик продаж',
  },
  {
    productId: 5,
    productName: 'Рюкзак городской',
    currentStock: 8,
    dailySales: 6,
    daysUntilStockout: 1,
    recommendedOrder: 60,
    urgency: 'critical' as const,
    reason: 'Остаток на 1 день! Немедленное пополнение',
  },
  {
    productId: 2,
    productName: 'Сумка кожаная женская',
    currentStock: 120,
    dailySales: 10,
    daysUntilStockout: 12,
    recommendedOrder: 100,
    urgency: 'warning' as const,
    reason: 'Средний спрос, рекомендуется пополнить до конца недели',
  },
  {
    productId: 4,
    productName: 'Футболка хлопок oversize',
    currentStock: 230,
    dailySales: 18,
    daysUntilStockout: 15,
    recommendedOrder: 0,
    urgency: 'ok' as const,
    reason: 'Достаточный запас на 2 недели',
  },
];

export const aiResponses: Record<string, string> = {
  greeting: 'Привет! Я ваш ИИ-аналитик продаж на Wildberries. Могу помочь с анализом продаж, рекомендациями по остаткам и прогнозами. Что вас интересует?',
  sales: '📊 **Сводка продаж за вчера:**\n\n• Выручка: 284 500 ₽\n• Заказов: 156\n• Средний чек: 1 824 ₽\n• Возвратов: 12 (7.7%)\n• Конверсия: 4.2%\n\n⚠️ Конверсия снизилась на 0.3% по сравнению с предыдущим днём. Рекомендую проверить карточки товаров — возможно, нужно обновить фото или описание.',
  stock: '📦 **Рекомендации по пополнению:**\n\n🔴 КРИТИЧНО:\n• Рюкзак городской — осталось на 1 день! Заказать 60 шт.\n• Часы наручные — осталось на 2 дня. Заказать 80 шт.\n• Кроссовки Nike Air Max — осталось на 3 дня. Заказать 150 шт.\n\n💡 Совет: Учитывая сезонность, рекомендую увеличить заказ кроссовок на 20% — ожидается рост спроса.',
  forecast: '🔮 **Прогноз на неделю:**\n\n• Ожидаемая выручка: 1.9-2.1 млн ₽\n• Ожидаемые заказы: 1050-1150\n• Тренд: рост +5-8%\n\n🎯 Факторы роста:\n• Приближение лета — рост спроса на обувь и лёгкую одежду\n• Снижение конкуренции в вашей нише на 12%\n• Улучшение позиций в поиске после обновления карточек',
  default: 'Я могу помочь вам с:\n\n📊 Анализом продаж — просто спросите "как продажи?"\n📦 Рекомендациями по остаткам — спросите "что пополнить?"\n🔮 Прогнозами — спросите "прогноз на неделю"\n💡 Советами по оптимизации — спросите "как увеличить продажи?"',
};

export const notifications = [
  { id: 1, type: 'critical', text: 'Рюкзак городской — остаток на 1 день!', time: '5 мин назад' },
  { id: 2, type: 'critical', text: 'Часы наручные — критический остаток', time: '12 мин назад' },
  { id: 3, type: 'warning', text: 'Конверсия снизилась на 0.3%', time: '1 час назад' },
  { id: 4, type: 'info', text: 'Новый отзыв на Кроссовки Nike Air Max', time: '2 часа назад' },
  { id: 5, type: 'success', text: 'Заказ на 150 шт. успешно оформлен', time: '3 часа назад' },
];
