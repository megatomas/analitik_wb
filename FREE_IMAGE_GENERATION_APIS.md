# 🎨 Бесплатные API для генерации профессиональных карточек

## 🏆 Лучшие бесплатные варианты 2026

### 1. Pollinations AI ⭐⭐⭐⭐⭐ (Рекомендуется)
**Полностью бесплатно, без API ключа, без регистрации!**

**Что умеет:**
- ✅ Генерация изображений по текстовому описанию
- ✅ Удаление фона
- ✅ Генерация сцен и окружения
- ✅ Безлимитное использование
- ✅ Не нужен API ключ
- ✅ Не нужна регистрация

**Как использовать:**
```javascript
// Простой GET запрос
const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=900&height=1200&nologo=true`;

// Или POST запрос для сложных сценариев
const response = await fetch('https://image.pollinations.ai/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Professional product photography of sneakers on white background, studio lighting, 8k, high quality',
    width: 900,
    height: 1200,
    model: 'flux',
    nologo: true,
  }),
});

const imageBlob = await response.blob();
```

**Примеры промптов для карточек:**
```javascript
// Студийное фото
'Professional product photography of [товар] on pure white background, studio lighting, 8k resolution, high quality, e-commerce'

// В интерьере
'Product photography of [товар] in modern living room interior, natural lighting, lifestyle, professional, 8k'

// На природе
'Product photography of [товар] in nature setting, green plants, outdoor, natural lighting, professional, 8k'
```

**Стоимость:** $0 (навсегда!)  
**Лимиты:** Безлимитно  
**Качество:** Отличное (Flux модель)

---

### 2. Google Gemini API ⭐⭐⭐⭐
**Бесплатный тариф с генерацией изображений**

**Что умеет:**
- ✅ Генерация изображений через Gemini 2.0 Flash
- ✅ До 500 запросов в день (бесплатно)
- ✅ Высокое качество
- ✅ Нужен API ключ (бесплатно)

**Как получить API ключ:**
1. Откройте https://aistudio.google.com/apikey
2. Создайте API ключ
3. Добавьте в переменные окружения

**Как использовать:**
```javascript
const response = await fetch(
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=' + API_KEY,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: 'Generate a professional product photo of sneakers on white background'
        }]
      }],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"]
      }
    }),
  }
);

const data = await response.json();
const imageBase64 = data.candidates[0].content.parts[0].inlineData.data;
```

**Стоимость:** $0 (до 500 запросов/день)  
**Лимиты:** 500 запросов в день  
**Качество:** Отличное

---

### 3. Hugging Face Inference API ⭐⭐⭐⭐
**Бесплатный доступ к тысячам моделей**

**Что умеет:**
- ✅ Stable Diffusion XL
- ✅ Flux модели
- ✅ Удаление фона
- ✅ Бесплатный тариф с ограничениями

**Как получить API ключ:**
1. Зарегистрируйтесь на https://huggingface.co
2. Получите API ключ в настройках
3. Добавьте в переменные окружения

**Как использовать:**
```javascript
// Stable Diffusion XL
const response = await fetch(
  'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HF_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: 'Professional product photography of sneakers on white background, 8k, high quality',
      parameters: {
        width: 900,
        height: 1200,
      }
    }),
  }
);

const imageBlob = await response.blob();
```

**Стоимость:** $0 (бесплатный тариф)  
**Лимиты:** Несколько сотен запросов в час  
**Качество:** Хорошее

---

### 4. Replicate ⭐⭐⭐
**Бесплатные модели для тестирования**

**Что умеет:**
- ✅ Flux модели
- ✅ Stable Diffusion
- ✅ Бесплатные модели ("Try for Free")

**Как использовать:**
```javascript
const response = await fetch('https://api.replicate.com/v1/predictions', {
  method: 'POST',
  headers: {
    'Authorization': `Token ${REPLICATE_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    version: 'black-forest-labs/flux-schnell',
    input: {
      prompt: 'Professional product photography of sneakers on white background',
      width: 900,
      height: 1200,
    }
  }),
});
```

**Стоимость:** $0 (бесплатные модели)  
**Лимиты:** Ограничено  
**Качество:** Отличное

---

### 5. Leonardo AI ⭐⭐⭐
**$5 бесплатных кредитов при регистрации**

**Что умеет:**
- ✅ Генерация продуктовых фото
- ✅ Удаление фона
- ✅ Профессиональные шаблоны

**Стоимость:** $5 бесплатно при регистрации  
**Лимиты:** Зависит от кредитов  
**Качество:** Отличное

---

## 🎯 Сравнение бесплатных API

| API | Бесплатно | Лимиты | API ключ | Качество | Скорость |
|-----|-----------|--------|----------|----------|----------|
| **Pollinations AI** | ✅ Безлимит | ✅ Нет | ❌ Не нужен | ⭐⭐⭐⭐⭐ | 10-30 сек |
| **Google Gemini** | ✅ 500/день | ⚠️ 500/день | ✅ Нужен | ⭐⭐⭐⭐⭐ | 5-15 сек |
| **Hugging Face** | ✅ Ограничено | ⚠️ Несколько сотен/час | ✅ Нужен | ⭐⭐⭐⭐ | 10-30 сек |
| **Replicate** | ⚠️ Бесплатные модели | ⚠️ Ограничено | ✅ Нужен | ⭐⭐⭐⭐⭐ | 10-30 сек |
| **Leonardo AI** | ⚠️ $5 кредитов | ⚠️ Зависит | ✅ Нужен | ⭐⭐⭐⭐⭐ | 10-20 сек |

---

## 🚀 Моя рекомендация

### Для вашего проекта: **Pollinations AI**

**Почему:**
✅ Полностью бесплатно  
✅ Безлимитное использование  
✅ Не нужен API ключ  
✅ Не нужна регистрация  
✅ Отличное качество (Flux модель)  
✅ Простая интеграция  
✅ Работает прямо сейчас  

**Как интегрировать:**

```typescript
// src/services/imageGenerator.ts

export async function generateProductImage(
  productDescription: string,
  background: string,
  width: number = 900,
  height: number = 1200
): Promise<Blob> {
  // Формируем промпт
  const prompt = `Professional product photography of ${productDescription} on ${background} background, studio lighting, 8k resolution, high quality, e-commerce, professional`;
  
  // Генерируем изображение через Pollinations AI
  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&nologo=true&model=flux`;
  
  // Загружаем изображение
  const response = await fetch(imageUrl);
  
  if (!response.ok) {
    throw new Error('Не удалось сгенерировать изображение');
  }
  
  return response.blob();
}

// Использование
const imageBlob = await generateProductImage(
  'white sneakers',
  'pure white',
  900,
  1200
);
```

---

## 💡 Как создать профессиональную карточку

### Полный процесс:

```typescript
// 1. Удаляем фон с товара (уже реализовано)
const productWithoutBg = await removeBackground(productImage);

// 2. Генерируем сцену с товаром через Pollinations AI
const scenePrompt = `Professional product photography of ${productName} on ${backgroundType} background, studio lighting, 8k resolution, high quality, e-commerce`;
const sceneImage = await generateProductImage(scenePrompt, backgroundType);

// 3. Комбинируем товар и сцену (опционально)
// Или используем готовое изображение от Pollinations

// 4. Добавляем инфографику
const finalCard = await addInfographic(sceneImage, {
  title: productName,
  price: productPrice,
});

// 5. Скачиваем готовую карточку
downloadImage(finalCard);
```

---

## 📊 Примеры промптов для разных категорий

### Обувь:
```
'Professional product photography of white sneakers on pure white background, studio lighting, 8k resolution, high quality, e-commerce, side view'
```

### Одежда:
```
'Professional product photography of blue denim jacket on gray gradient background, studio lighting, 8k resolution, high quality, e-commerce, folded'
```

### Электроника:
```
'Professional product photography of wireless headphones on dark background, dramatic lighting, 8k resolution, high quality, e-commerce, premium'
```

### Косметика:
```
'Professional product photography of skincare bottle on marble surface, soft lighting, 8k resolution, high quality, e-commerce, luxury'
```

### Продукты питания:
```
'Professional product photography of coffee bag on wooden table, warm lighting, 8k resolution, high quality, e-commerce, lifestyle'
```

---

## 🔧 Интеграция в CardCreator

### Обновите функцию `processImage`:

```typescript
const processImage = async () => {
  if (!selectedImage || !selectedConcept) return;

  setIsProcessing(true);
  setError(null);

  try {
    // Шаг 1: Удаляем фон с товара
    const imageBlob = await fetch(selectedImage).then(r => r.blob());
    const removedBgBlob = await removeBackground(imageBlob);

    // Шаг 2: Генерируем профессиональную карточку через Pollinations AI
    const productName = infographicData.title || 'product';
    const prompt = `Professional product photography of ${productName} on ${selectedConcept.description} background, studio lighting, 8k resolution, high quality, e-commerce`;
    
    const generatedImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=900&height=1200&nologo=true&model=flux`;
    
    const generatedResponse = await fetch(generatedImageUrl);
    const generatedBlob = await generatedResponse.blob();

    // Шаг 3: Создаем canvas для финальной обработки
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 900;
    canvas.height = 1200;

    // Шаг 4: Загружаем сгенерированное изображение
    const generatedImg = new Image();
    const generatedUrl = URL.createObjectURL(generatedBlob);
    
    await new Promise((resolve, reject) => {
      generatedImg.onload = resolve;
      generatedImg.onerror = reject;
      generatedImg.src = generatedUrl;
    });

    // Шаг 5: Рисуем на canvas
    ctx.drawImage(generatedImg, 0, 0, 900, 1200);

    // Шаг 6: Добавляем инфографику
    if (infographicData.title || infographicData.price) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
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

    // Шаг 7: Конвертируем в JPEG
    const processedDataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setProcessedImage(processedDataUrl);
    setStep(4);

    URL.revokeObjectURL(generatedUrl);
  } catch (err: any) {
    setError('Ошибка при обработке: ' + err.message);
  } finally {
    setIsProcessing(false);
  }
};
```

---

## ✅ Итого

**Лучший бесплатный API:** **Pollinations AI**
- ✅ Полностью бесплатно
- ✅ Безлимитно
- ✅ Без API ключа
- ✅ Без регистрации
- ✅ Отличное качество
- ✅ Простая интеграция

**Альтернативы:**
- Google Gemini (500 запросов/день)
- Hugging Face (бесплатный тариф)
- Replicate (бесплатные модели)
- Leonardo AI ($5 кредитов)

**Стоимость:** $0 (все варианты бесплатны!)

---

**Проект готов к интеграции!** 🎨

Используйте Pollinations AI для бесплатной генерации профессиональных карточек товаров.
