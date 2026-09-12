# 🎨 Рабочие ИИ API для генерации карточек товаров

## ✅ Проверенные рабочие API

### 1. Pollinations AI ⭐⭐⭐⭐⭐ (Рекомендуется)

**Статус:** ✅ Работает  
**Базовый URL:** `https://gen.pollinations.ai`  
**Документация:** https://gen.pollinations.ai/docs

#### Модели для изображений:
- `flux` - основная модель (рекомендуется)
- `flux-realism` - фотореалистичные изображения
- `flux-anime` - аниме стиль
- `flux-3d` - 3D стиль
- `any-dark` - тёмный стиль
- `flux-pro` - профессиональная версия

#### Пример запроса:
```javascript
// Простой GET запрос
const prompt = "luxury cosmetics photography, marble surface, soft pink lighting";
const imageUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}?model=flux&width=900&height=1200&nologo=true`;

// Загрузка изображения
const response = await fetch(imageUrl);
const imageBlob = await response.blob();
```

#### Параметры:
- `model` - модель (flux, flux-realism, flux-anime, flux-3d, any-dark, flux-pro)
- `width` - ширина изображения (900 для WB)
- `height` - высота изображения (1200 для WB)
- `nologo` - убрать водяной знак (true/false)
- `seed` - случайное число для воспроизводимости

#### API ключ:
**Требуется API ключ** для генерации изображений!

**Как получить:**
1. Зарегистрируйтесь на https://enter.pollinations.ai/keys
2. Создайте API ключ
3. Добавьте в переменные окружения:
   ```
   VITE_POLLINATIONS_API_KEY=pk_your_key_here
   ```

#### Использование с API ключом:
```javascript
const response = await fetch(imageUrl, {
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_POLLINATIONS_API_KEY}`
  }
});
```

#### Стоимость:
- **Бесплатный тариф:** есть (ограниченное количество запросов)
- **Платные тарифы:** от $9/мес
- **Модель flux:** ~$0.02-0.05 за изображение

---

### 2. Hugging Face Inference API ⭐⭐⭐⭐

**Статус:** ✅ Работает  
**Базовый URL:** `https://api-inference.huggingface.co`  
**Документация:** https://huggingface.co/docs/api-inference

#### Модели для изображений:
- `stabilityai/stable-diffusion-xl-base-1.0`
- `runwayml/stable-diffusion-v1-5`
- `prompthero/openjourney`

#### Пример запроса:
```javascript
const response = await fetch(
  'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_HF_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: 'luxury cosmetics photography, marble surface, soft pink lighting',
      parameters: {
        width: 900,
        height: 1200,
      }
    }),
  }
);

const imageBlob = await response.blob();
```

#### API ключ:
**Требуется API ключ** (бесплатный)

**Как получить:**
1. Зарегистрируйтесь на https://huggingface.co/join
2. Перейдите в Settings → Access Tokens
3. Создайте новый токен
4. Добавьте в переменные окружения:
   ```
   VITE_HF_API_KEY=hf_your_token_here
   ```

#### Стоимость:
- **Бесплатный тариф:** несколько сотен запросов в час
- **Pro тариф:** $9/мес (больше запросов)

---

### 3. Replicate ⭐⭐⭐

**Статус:** ✅ Работает  
**Базовый URL:** `https://api.replicate.com`  
**Документация:** https://replicate.com/docs

#### Модели для изображений:
- `black-forest-labs/flux-schnell` (бесплатная)
- `stability-ai/stable-diffusion` (бесплатная)

#### Пример запроса:
```javascript
const response = await fetch('https://api.replicate.com/v1/predictions', {
  method: 'POST',
  headers: {
    'Authorization': `Token ${import.meta.env.VITE_REPLICATE_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    version: 'black-forest-labs/flux-schnell',
    input: {
      prompt: 'luxury cosmetics photography, marble surface, soft pink lighting',
      width: 900,
      height: 1200,
    }
  }),
});

const prediction = await response.json();

// Проверка статуса
const resultResponse = await fetch(prediction.urls.get, {
  headers: {
    'Authorization': `Token ${import.meta.env.VITE_REPLICATE_API_TOKEN}`
  }
});
const result = await resultResponse.json();

if (result.status === 'succeeded') {
  const imageUrl = result.output;
  // Загрузка изображения
  const imageResponse = await fetch(imageUrl);
  const imageBlob = await imageResponse.blob();
}
```

#### API ключ:
**Требуется API ключ**

**Как получить:**
1. Зарегистрируйтесь на https://replicate.com
2. Перейдите в Account → API Tokens
3. Создайте новый токен
4. Добавьте в переменные окружения:
   ```
   VITE_REPLICATE_API_TOKEN=r8_your_token_here
   ```

#### Стоимость:
- **Бесплатные модели:** есть (ограниченное использование)
- **Платные модели:** ~$0.003-0.01 за изображение

---

## 🚀 Моя рекомендация: Pollinations AI

### Почему Pollinations AI:

✅ **Простая интеграция** - один GET запрос  
✅ **Высокое качество** - модель Flux отличная  
✅ **Быстрая генерация** - 10-30 секунд  
✅ **Есть бесплатный тариф** - для тестирования  
✅ **Профессиональные результаты** - как в Aidentika  

### Как интегрировать:

#### Шаг 1: Получите API ключ

1. Откройте https://enter.pollinations.ai/keys
2. Зарегистрируйтесь (через GitHub или email)
3. Нажмите "Create New Key"
4. Скопируйте ключ (начинается с `pk_`)

#### Шаг 2: Добавьте в переменные окружения

В Vercel Dashboard → Settings → Environment Variables:
```
VITE_POLLINATIONS_API_KEY=pk_your_key_here
```

#### Шаг 3: Обновите код CardCreator.tsx

```typescript
const generateCard = async () => {
  if (!selectedImage || !selectedStyle) return;

  setIsProcessing(true);
  setError(null);

  try {
    // Формируем промпт
    let fullPrompt = selectedStyle.prompt;
    
    if (infographicData.title) {
      const transliteratedTitle = transliterate(infographicData.title);
      const shortTitle = transliteratedTitle.split(' ').slice(0, 3).join(' ');
      fullPrompt += `, featuring ${shortTitle}`;
    }
    
    if (infographicData.features) {
      const transliteratedFeatures = transliterate(infographicData.features);
      const shortFeatures = transliteratedFeatures.split(/[,\s]+/).slice(0, 5).join(' ');
      fullPrompt += `, ${shortFeatures}`;
    }

    fullPrompt += ', product centered, e-commerce photo';

    if (fullPrompt.length > 300) {
      fullPrompt = fullPrompt.substring(0, 300);
    }

    // Генерируем изображение через Pollinations AI
    const apiKey = import.meta.env.VITE_POLLINATIONS_API_KEY;
    
    if (!apiKey) {
      throw new Error('API ключ не настроен. Добавьте VITE_POLLINATIONS_API_KEY в переменные окружения.');
    }

    const imageUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(fullPrompt)}?model=flux&width=900&height=1200&nologo=true&seed=${Date.now()}`;
    
    console.log('Генерация карточки:', imageUrl);

    // Загружаем изображение с API ключом
    const response = await fetch(imageUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      signal: AbortSignal.timeout(60000),
    });
    
    if (!response.ok) {
      throw new Error(`Не удалось сгенерировать изображение: ${response.status}`);
    }

    const imageBlob = await response.blob();
    const generatedUrl = URL.createObjectURL(imageBlob);

    // Создаем canvas для добавления инфографики
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Не удалось создать canvas');

    canvas.width = 900;
    canvas.height = 1200;

    // Загружаем сгенерированное изображение
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = generatedUrl;
    });

    // Рисуем изображение
    ctx.drawImage(img, 0, 0, 900, 1200);

    // Добавляем инфографику если есть данные
    if (infographicData.title || infographicData.price) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 1050, 900, 150);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 36px Arial';
      ctx.textAlign = 'center';
      
      if (infographicData.title) {
        ctx.fillText(infographicData.title, 450, 1095);
      }
      
      if (infographicData.price) {
        ctx.font = 'bold 44px Arial';
        ctx.fillStyle = '#FFD700';
        ctx.fillText(infographicData.price + ' ₽', 450, 1150);
      }
    }

    const processedDataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setProcessedImage(processedDataUrl);
    setStep(4);

    URL.revokeObjectURL(generatedUrl);
  } catch (err: any) {
    console.error('Ошибка генерации:', err);
    setError('Ошибка при генерации карточки: ' + err.message);
  } finally {
    setIsProcessing(false);
  }
};
```

#### Шаг 4: Запушьте и задеплойте

```bash
git add .
git commit -m "Add Pollinations AI integration for card generation"
git push
```

---

## 📊 Сравнение API

| API | Качество | Скорость | Стоимость | Сложность |
|-----|----------|----------|-----------|-----------|
| **Pollinations AI** | ⭐⭐⭐⭐⭐ | 10-30 сек | $0.02-0.05/фото | Очень просто |
| **Hugging Face** | ⭐⭐⭐⭐ | 15-40 сек | Бесплатно | Просто |
| **Replicate** | ⭐⭐⭐⭐⭐ | 20-60 сек | $0.003-0.01/фото | Средне |

---

## 💡 Альтернатива: Бесплатный Hugging Face

Если не хотите платить, используйте **Hugging Face Inference API**:

### Преимущества:
✅ **Полностью бесплатно** (бесплатный тариф)  
✅ **Несколько сотен запросов в час**  
✅ **Хорошее качество** (Stable Diffusion XL)  
✅ **Простая интеграция**  

### Недостатки:
⚠️ Медленнее чем Pollinations (15-40 сек)  
⚠️ Ограничения на бесплатном тарифе  

### Код для Hugging Face:

```typescript
const generateCard = async () => {
  if (!selectedImage || !selectedStyle) return;

  setIsProcessing(true);
  setError(null);

  try {
    // Формируем промпт (как в Pollinations)
    let fullPrompt = selectedStyle.prompt;
    
    if (infographicData.title) {
      const transliteratedTitle = transliterate(infographicData.title);
      const shortTitle = transliteratedTitle.split(' ').slice(0, 3).join(' ');
      fullPrompt += `, featuring ${shortTitle}`;
    }
    
    if (infographicData.features) {
      const transliteratedFeatures = transliterate(infographicData.features);
      const shortFeatures = transliteratedFeatures.split(/[,\s]+/).slice(0, 5).join(' ');
      fullPrompt += `, ${shortFeatures}`;
    }

    fullPrompt += ', product centered, e-commerce photo';

    if (fullPrompt.length > 300) {
      fullPrompt = fullPrompt.substring(0, 300);
    }

    // Генерируем изображение через Hugging Face
    const apiKey = import.meta.env.VITE_HF_API_KEY;
    
    if (!apiKey) {
      throw new Error('API ключ не настроен. Добавьте VITE_HF_API_KEY в переменные окружения.');
    }

    const response = await fetch(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: fullPrompt,
          parameters: {
            width: 900,
            height: 1200,
            num_inference_steps: 50,
          }
        }),
        signal: AbortSignal.timeout(120000), // 2 минуты
      }
    );

    if (!response.ok) {
      throw new Error(`Не удалось сгенерировать изображение: ${response.status}`);
    }

    const imageBlob = await response.blob();
    const generatedUrl = URL.createObjectURL(imageBlob);

    // Дальше как в Pollinations - добавляем инфографику
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 900;
    canvas.height = 1200;

    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = generatedUrl;
    });

    ctx.drawImage(img, 0, 0, 900, 1200);

    if (infographicData.title || infographicData.price) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 1050, 900, 150);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 36px Arial';
      ctx.textAlign = 'center';
      
      if (infographicData.title) {
        ctx.fillText(infographicData.title, 450, 1095);
      }
      
      if (infographicData.price) {
        ctx.font = 'bold 44px Arial';
        ctx.fillStyle = '#FFD700';
        ctx.fillText(infographicData.price + ' ₽', 450, 1150);
      }
    }

    const processedDataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setProcessedImage(processedDataUrl);
    setStep(4);

    URL.revokeObjectURL(generatedUrl);
  } catch (err: any) {
    console.error('Ошибка генерации:', err);
    setError('Ошибка при генерации карточки: ' + err.message);
  } finally {
    setIsProcessing(false);
  }
};
```

---

## ✅ Итого

**Лучший выбор:** **Pollinations AI**
- ✅ Отличное качество
- ✅ Простая интеграция
- ✅ Быстрая генерация
- ✅ Есть бесплатный тариф

**Альтернатива:** **Hugging Face**
- ✅ Полностью бесплатно
- ✅ Хорошее качество
- ⚠️ Медленнее

**Что нужно сделать:**
1. Выберите API (Pollinations или Hugging Face)
2. Получите API ключ
3. Добавьте в переменные окружения Vercel
4. Обновите код CardCreator.tsx
5. Запушьте и задеплойте

**Стоимость:**
- Pollinations AI: ~$0.02-0.05 за карточку
- Hugging Face: $0 (бесплатный тариф)

---

**Проект готов к интеграции!** 🎨

Выберите API, получите ключ, и карточки будут генерироваться с профессиональным качеством!
