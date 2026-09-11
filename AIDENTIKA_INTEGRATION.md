# 🎨 Создание карточек как в Aidentika.com

## ✅ Что сделано

Создан интерфейс для создания карточек товаров по принципу Aidentika.com:

### 4 шага создания:

1. **Загрузка фото товара**
   - Загрузка с телефона или компьютера
   - Проверка размера и формата
   - Предпросмотр загруженного фото

2. **Выбор концепции**
   - 8 профессиональных концепций:
     - 📸 Студийное фото (белый фон)
     - 🎨 Студия с градиентом
     - 🏠 В интерьере (дом)
     - 💼 В офисе
     - 🌆 На улице
     - 🌿 На природе
     - 📐 Flatlay (композиция сверху)
     - ⚪ Минимализм

3. **Добавление инфографики**
   - Название товара
   - Цена
   - Особенности
   - Материал

4. **Результат**
   - Готовая карточка 900x1200 px (3:4)
   - Скачивание в JPEG
   - Готово к загрузке на WB

## 🤖 Текущая реализация

Сейчас используется **базовая обработка через Canvas API**:
- ✅ Масштабирование под размер WB
- ✅ Выбор фона (белый/градиент)
- ✅ Добавление инфографики
- ✅ Улучшение качества

**Но нет:**
- ❌ Удаление фона (как в Aidentika)
- ❌ Генерация окружения (ИИ создает фон)
- ❌ Размещение товара в сцене
- ❌ Профессиональная ИИ обработка

## 🚀 Как сделать как в Aidentika

Aidentika использует **генеративный ИИ** для создания профессиональных фото. Вот как это реализовать:

### Принцип работы Aidentika:

```
1. Пользователь загружает фото товара
        ↓
2. ИИ удаляет фон (сегментация)
        ↓
3. Пользователь выбирает концепцию
        ↓
4. ИИ генерирует новое изображение:
   - Товар размещается в выбранном окружении
   - Добавляются тени и отражения
   - Создается реалистичная сцена
        ↓
5. Добавление инфографики
        ↓
6. Готовая карточка
```

### Что нужно для полноценной ИИ генерации:

#### Вариант 1: OpenAI DALL-E 3 + Remove.bg

**Что нужно:**
1. API ключ OpenAI ($0.04-0.08 за изображение)
2. API ключ Remove.bg ($0.05 за изображение)

**Как работает:**
```typescript
// 1. Удаляем фон
const removeBgResponse = await fetch('https://api.remove.bg/v1/remove-bg', {
  method: 'POST',
  headers: {
    'X-API-Key': process.env.REMOVE_BG_API_KEY,
  },
  body: formData, // изображение
});

const imageWithoutBg = await removeBgResponse.blob();

// 2. Генерируем новое изображение с ИИ
const prompt = `Product photo of ${infographicData.title} in ${selectedConcept.name} setting, 
  professional studio lighting, white background, e-commerce product photography, 
  high quality, 8k resolution`;

const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'dall-e-3',
    prompt: prompt,
    n: 1,
    size: '1024x1024',
    image: imageWithoutBg, // исходное изображение без фона
  }),
});

const generatedImage = await openaiResponse.json();
```

**Стоимость:** ~$0.10 за карточку

---

#### Вариант 2: Stability AI (Stable Diffusion)

**Что нужно:**
1. API ключ Stability AI ($0.002-0.006 за изображение)

**Как работает:**
```typescript
// Используем img2img для генерации на основе загруженного фото
const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/image-to-image', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
    'Content-Type': 'multipart/form-data',
  },
  body: formData,
});

const result = await response.json();
```

**Стоимость:** ~$0.005 за карточку (в 20 раз дешевле!)

---

#### Вариант 3: Replicate (разные модели)

**Что нужно:**
1. API ключ Replicate ($0.001-0.01 за изображение)

**Модели:**
- `remove-bg` - удаление фона
- `real-esrgan` - увеличение качества
- `sdxl` - генерация изображений

**Стоимость:** ~$0.01 за карточку

---

#### Вариант 4: Clipdrop API (рекомендуется)

**Что нужно:**
1. API ключ Clipdrop ($9/мес или pay-as-you-go)

**Возможности:**
- ✅ Удаление фона
- ✅ Замена фона
- ✅ Увеличение разрешения
- ✅ Удаление объектов
- ✅ Генерация изображений

**Как работает:**
```typescript
// 1. Удаляем фон
const removeBgResponse = await fetch('https://clipdrop-api.co/remove-background/v1', {
  method: 'POST',
  headers: {
    'x-api-key': process.env.CLIPDROP_API_KEY,
  },
  body: formData,
});

const imageWithoutBg = await removeBgResponse.blob();

// 2. Заменяем фон
const replaceBgResponse = await fetch('https://clipdrop-api.co/replace-background/v1', {
  method: 'POST',
  headers: {
    'x-api-key': process.env.CLIPDROP_API_KEY,
  },
  body: formData, // изображение без фона + промпт для нового фона
});

const finalImage = await replaceBgResponse.blob();
```

**Стоимость:** $9/мес за 1000 изображений (~$0.009 за карточку)

---

## 🔧 Как интегрировать ИИ API

### Шаг 1: Выберите сервис

**Рекомендация:** Clipdrop API
- Простая интеграция
- Хорошее качество
- Разумная цена
- Все функции в одном месте

### Шаг 2: Получите API ключ

1. Зарегистрируйтесь на https://clipdrop.co/apis
2. Выберите тариф (есть бесплатный для теста)
3. Получите API ключ

### Шаг 3: Добавьте переменные окружения

В Vercel Dashboard → Settings → Environment Variables:
```
VITE_CLIPDROP_API_KEY=your_api_key_here
```

### Шаг 4: Создайте серверную функцию

Создайте файл `api/generate-card.ts`:

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image, concept, infographicData } = req.body;

    const apiKey = process.env.VITE_CLIPDROP_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // 1. Удаляем фон
    const removeBgFormData = new FormData();
    removeBgFormData.append('image_file', image);
    
    const removeBgResponse = await fetch('https://clipdrop-api.co/remove-background/v1', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
      },
      body: removeBgFormData,
    });

    if (!removeBgResponse.ok) {
      throw new Error('Failed to remove background');
    }

    const imageWithoutBg = await removeBgResponse.blob();

    // 2. Генерируем промпт для замены фона
    const prompts = {
      'studio-white': 'white studio background, professional lighting, clean',
      'studio-gradient': 'gradient background, soft lighting, modern',
      'interior-living': 'cozy living room interior, warm lighting, lifestyle',
      'interior-office': 'modern office interior, professional lighting',
      'lifestyle-outdoor': 'urban street background, natural lighting',
      'lifestyle-nature': 'nature background, green plants, outdoor',
      'composition-flatlay': 'flat lay composition, top view, clean background',
      'composition-minimal': 'minimalist background, simple, elegant',
    };

    const prompt = prompts[concept as keyof typeof prompts] || 'white background';

    // 3. Заменяем фон
    const replaceBgFormData = new FormData();
    replaceBgFormData.append('image_file', imageWithoutBg);
    replaceBgFormData.append('prompt', prompt);

    const replaceBgResponse = await fetch('https://clipdrop-api.co/replace-background/v1', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
      },
      body: replaceBgFormData,
    });

    if (!replaceBgResponse.ok) {
      throw new Error('Failed to replace background');
    }

    const finalImage = await replaceBgResponse.arrayBuffer();

    // 4. Добавляем инфографику (через Canvas API)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    img.src = URL.createObjectURL(new Blob([finalImage]));
    
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    canvas.width = 900;
    canvas.height = 1200;
    
    // Масштабируем изображение
    const scale = Math.min(900 / img.width, 1200 / img.height);
    const width = img.width * scale;
    const height = img.height * scale;
    const x = (900 - width) / 2;
    const y = (1200 - height) / 2;
    
    ctx.drawImage(img, x, y, width, height);

    // Добавляем инфографику
    if (infographicData.title || infographicData.price) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 1050, 900, 150);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      
      if (infographicData.title) {
        ctx.fillText(infographicData.title, 450, 1090);
      }
      
      if (infographicData.price) {
        ctx.font = 'bold 40px Arial';
        ctx.fillStyle = '#FFD700';
        ctx.fillText(infographicData.price + ' ₽', 450, 1140);
      }
    }

    const result = canvas.toDataURL('image/jpeg', 0.95);

    return res.status(200).json({ image: result });
  } catch (error: any) {
    console.error('Error generating card:', error);
    return res.status(500).json({ error: error.message });
  }
}
```

### Шаг 5: Обновите CardCreator.tsx

Замените функцию `processImage`:

```typescript
const processImage = async () => {
  if (!selectedImage || !selectedConcept) return;

  setIsProcessing(true);
  setError(null);

  try {
    // Отправляем запрос на серверную функцию
    const response = await fetch('/api/generate-card', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: selectedImage,
        concept: selectedConcept.id,
        infographicData,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate card');
    }

    const result = await response.json();
    setProcessedImage(result.image);
    setStep(4);
  } catch (err: any) {
    setError('Ошибка при генерации карточки: ' + err.message);
  } finally {
    setIsProcessing(false);
  }
};
```

### Шаг 6: Запушьте и задеплойте

```bash
git add .
git commit -m "Add AI image generation with Clipdrop API"
git push
```

## 💰 Сравнение стоимости

| Сервис | Стоимость за карточку | Качество | Скорость |
|--------|----------------------|----------|----------|
| **Текущая версия** | $0 | Базовое | Мгновенно |
| **Clipdrop** | ~$0.009 | Отличное | 10-20 сек |
| **Stability AI** | ~$0.005 | Хорошее | 5-15 сек |
| **OpenAI DALL-E** | ~$0.10 | Отличное | 10-30 сек |
| **Replicate** | ~$0.01 | Хорошее | 10-20 сек |

**Рекомендация:** Clipdrop API - лучшее соотношение цены и качества

## 📱 Как это будет выглядеть

### Текущая версия:
- Простое масштабирование фото
- Белый/градиентный фон
- Базовая инфографика

### С Clipdrop API (как в Aidentika):
- ✅ Удаление фона с фото
- ✅ Генерация реалистичного окружения
- ✅ Размещение товара в сцене
- ✅ Добавление теней и отражений
- ✅ Профессиональное качество

### Примеры концепций:

**Студийное фото:**
```
Исходное фото → Удаление фона → Белый фон + студийное освещение
```

**В интерьере:**
```
Исходное фото → Удаление фона → Гостиная с диваном и растением
```

**На природе:**
```
Исходное фото → Удаление фона → Фон с деревьями и травой
```

## 🚀 Быстрый старт

### Если хотите попробовать сейчас:

1. Зарегистрируйтесь на https://clipdrop.co/apis
2. Получите бесплатный API ключ (100 изображений бесплатно)
4. Следуйте инструкции выше
5. Задеплойте на Vercel

### Если хотите сначала протестировать:

Текущая версия уже работает и создает базовые карточки. Можно использовать её, а потом добавить ИИ генерацию.

## ✅ Итого

**Что работает:**
✅ Интерфейс как в Aidentika (4 шага)
✅ 8 профессиональных концепций
✅ Добавление инфографики
✅ Скачивание готовой карточки
✅ Базовая обработка фото

**Что нужно добавить:**
⏳ Интеграция с Clipdrop API (или другим ИИ сервисом)
⏳ Удаление фона
⏳ Генерация окружения
⏳ Размещение товара в сцене

**Стоимость:**
- Текущая версия: **$0**
- С ИИ генерацией: **~$0.009 за карточку**

**Время интеграции:** 30-60 минут

---

**Проект готов к использованию!** 🎨

Для полноценной ИИ генерации как в Aidentika нужно интегрировать API (рекомендую Clipdrop). Инструкция выше.
