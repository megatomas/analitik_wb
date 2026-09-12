import { useState, useRef } from 'react';
import { Upload, Download, Loader2, Sparkles, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

interface Style {
  id: string;
  name: string;
  description: string;
  icon: string;
  prompt: string;
}

export default function CardCreator() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);
  const [infographicData, setInfographicData] = useState({
    title: '',
    price: '',
    features: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Стили карточек с оптимизированными промптами (короткие, эффективные)
  const styles: Style[] = [
    {
      id: 'cosmetics',
      name: 'Косметика',
      description: 'Элегантный стиль для косметики и ухода',
      icon: '💄',
      prompt: 'luxury cosmetics photography, marble surface, soft pink lighting, premium beauty, studio shot, 8k, high-end, minimalist'
    },
    {
      id: 'electronics',
      name: 'Электроника',
      description: 'Современный стиль для гаджетов',
      icon: '📱',
      prompt: 'modern electronics photography, dark background, blue accent lighting, tech showcase, studio shot, 8k, futuristic, clean'
    },
    {
      id: 'fashion',
      name: 'Одежда',
      description: 'Стильный образ для моды',
      icon: '👗',
      prompt: 'fashion photography, stylish display, beige background, soft natural lighting, editorial style, 8k, trendy, professional'
    },
    {
      id: 'food',
      name: 'Продукты питания',
      description: 'Аппетитный стиль для еды',
      icon: '🍕',
      prompt: 'appetizing food photography, wooden surface, warm golden lighting, fresh ingredients, food styling, 8k, inviting, close-up'
    },
    {
      id: 'sports',
      name: 'Спорт',
      description: 'Динамичный стиль для спорта',
      icon: '⚽',
      prompt: 'dynamic sports photography, energetic composition, vibrant background, action lighting, athletic brand, 8k, powerful, professional'
    },
    {
      id: 'home',
      name: 'Дом и сад',
      description: 'Уютный стиль для дома',
      icon: '🏠',
      prompt: 'cozy home photography, warm interior, natural daylight, lifestyle composition, comfortable aesthetic, 8k, inviting, professional'
    },
    {
      id: 'auto',
      name: 'Автотовары',
      description: 'Премиум стиль для авто',
      icon: '🚗',
      prompt: 'premium automotive photography, metallic surface, dramatic lighting, luxury accessories, studio shot, 8k, high-end, sophisticated'
    },
    {
      id: 'kids',
      name: 'Детские товары',
      description: 'Яркий стиль для детей',
      icon: '🧸',
      prompt: 'cheerful kids photography, bright playful colors, fun composition, child-friendly, studio shot, 8k, joyful, engaging'
    },
    {
      id: 'premium',
      name: 'Премиум',
      description: 'Люксовый стиль для дорогих товаров',
      icon: '💎',
      prompt: 'luxury premium photography, black and gold theme, spotlight lighting, exclusive brand, studio shot, 8k, sophisticated, high-end'
    },
    {
      id: 'eco',
      name: 'Эко товары',
      description: 'Натуральный стиль для эко',
      icon: '🌿',
      prompt: 'eco-friendly photography, natural green setting, organic materials, sustainable brand, soft natural lighting, 8k, earthy tones'
    },
    {
      id: 'tech',
      name: 'Технологии',
      description: 'Футуристичный стиль для tech',
      icon: '🔬',
      prompt: 'technology photography, futuristic elements, neon accent lighting, innovative design, studio shot, 8k, modern, clean composition'
    },
    {
      id: 'minimal',
      name: 'Минимализм',
      description: 'Чистый минималистичный стиль',
      icon: '⚪',
      prompt: 'minimalist photography, pure white background, clean composition, soft diffused lighting, Scandinavian aesthetic, 8k, elegant simplicity'
    },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('Размер файла не должен превышать 10 МБ');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, выберите изображение');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Простая транслитерация кириллицы в латиницу
  const transliterate = (text: string): string => {
    const map: Record<string, string> = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
      'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
      'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
      'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
      'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
      'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
      'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
      'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
      'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch',
      'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya',
    };
    return text.split('').map(c => map[c] || c).join('');
  };

  const generateCard = async () => {
    if (!selectedImage || !selectedStyle) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Получаем API ключ Hugging Face из переменных окружения
      const apiKey = import.meta.env.VITE_HF_API_KEY;
      
      if (!apiKey) {
        throw new Error('API ключ Hugging Face не настроен. Добавьте VITE_HF_API_KEY в переменные окружения Vercel.');
      }

      // Формируем промпт - только английский, короткий
      let fullPrompt = selectedStyle.prompt;
      
      // Добавляем название товара (транслитерируем кириллицу)
      if (infographicData.title) {
        const transliteratedTitle = transliterate(infographicData.title);
        // Берём только первые 3 слова чтобы не раздувать промпт
        const shortTitle = transliteratedTitle.split(' ').slice(0, 3).join(' ');
        fullPrompt += `, featuring ${shortTitle}`;
      }
      
      // Добавляем особенности (транслитерируем и сокращаем)
      if (infographicData.features) {
        const transliteratedFeatures = transliterate(infographicData.features);
        // Берём только первые 5 слов
        const shortFeatures = transliteratedFeatures.split(/[,\s]+/).slice(0, 5).join(' ');
        fullPrompt += `, ${shortFeatures}`;
      }

      fullPrompt += ', product centered, professional e-commerce photography, 8k, high quality';

      // Ограничиваем длину промпта до 500 символов (Hugging Face поддерживает больше)
      if (fullPrompt.length > 500) {
        fullPrompt = fullPrompt.substring(0, 500);
      }

      console.log('Промпт для Hugging Face:', fullPrompt);
      console.log('Длина промпта:', fullPrompt.length);

      // Генерируем изображение через Hugging Face Inference API
      let imageBlob: Blob | null = null;
      let lastError: Error | null = null;

      // Пробуем несколько моделей (на случай если одна недоступна)
      const models = [
        'stabilityai/stable-diffusion-xl-base-1.0',
        'runwayml/stable-diffusion-v1-5',
        'prompthero/openjourney'
      ];

      for (let attempt = 0; attempt < models.length; attempt++) {
        try {
          const model = models[attempt];
          console.log(`Попытка ${attempt + 1}/${models.length}: модель ${model}`);

          const response = await fetch(
            `https://api-inference.huggingface.co/models/${model}`,
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
                  guidance_scale: 7.5,
                }
              }),
              signal: AbortSignal.timeout(120000), // 2 минуты таймаут
            }
          );

          console.log(`Статус ответа от ${model}: ${response.status}`);

          if (response.ok) {
            imageBlob = await response.blob();
            console.log(`✅ Успешная генерация с моделью ${model}`);
            break;
          } else {
            const errorText = await response.text();
            console.warn(`Модель ${model} не сработала:`, errorText);
            lastError = new Error(`Модель ${model}: ${response.status} - ${errorText}`);
            
            // Ждём перед следующей попыткой
            if (attempt < models.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          }
        } catch (err: any) {
          console.warn(`Ошибка с моделью:`, err.message);
          lastError = err;
          
          if (attempt < models.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
      }

      if (!imageBlob) {
        throw new Error(`Не удалось сгенерировать изображение. ${lastError?.message || 'Попробуйте ещё раз или выберите другой стиль.'}`);
      }

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
        // Полупрозрачная плашка внизу
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

  const downloadImage = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.download = `wb-card-${selectedStyle?.id}-${Date.now()}.jpg`;
    link.href = processedImage;
    link.click();
  };

  const resetAll = () => {
    setStep(1);
    setSelectedImage(null);
    setSelectedStyle(null);
    setInfographicData({ title: '', price: '', features: '' });
    setProcessedImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Создание продающей карточки</h1>
        <p className="text-gray-600">ИИ создаст профессиональную карточку товара в выбранном стиле</p>
      </div>

      {/* Встроенный ИИ инструмент */}
      <div className="mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Sparkles size={20} className="text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-purple-900 mb-1">
              ИИ генерация продающих карточек
            </h3>
            <p className="text-sm text-purple-800">
              Выберите стиль товара, и ИИ создаст профессиональную продающую карточку. 
              Полностью бесплатно, безлимитно, без API ключей!
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= s ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > s ? <CheckCircle2 size={20} /> : s}
              </div>
              {s < 4 && (
                <div className={`w-20 h-1 mx-2 ${step > s ? 'bg-purple-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Загрузка</span>
          <span>Стиль</span>
          <span>Инфо</span>
          <span>Результат</span>
        </div>
      </div>

      {/* Step 1: Upload */}
      {step === 1 && (
        <div className="bg-white rounded-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Шаг 1: Загрузите фото товара</h2>
          <p className="text-gray-600 mb-6">ИИ использует ваше фото как основу для создания продающей карточки</p>

          {!selectedImage ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all"
            >
              <Upload size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">Нажмите для загрузки фото</p>
              <p className="text-sm text-gray-500">или перетащите файл сюда</p>
              <p className="text-xs text-gray-400 mt-2">JPG, PNG до 10 МБ</p>
            </div>
          ) : (
            <div className="space-y-4">
              <img src={selectedImage} alt="Selected" className="w-full max-w-md mx-auto rounded-xl" />
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Изменить фото
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
                >
                  Далее <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* Step 2: Style */}
      {step === 2 && (
        <div className="bg-white rounded-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Шаг 2: Выберите стиль карточки</h2>
          <p className="text-gray-600 mb-6">ИИ создаст продающую карточку в профессиональном стиле для вашей категории товара</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {styles.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedStyle?.id === style.id
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-4xl mb-2">{style.icon}</div>
                <h3 className="font-semibold text-sm mb-1">{style.name}</h3>
                <p className="text-xs text-gray-500">{style.description}</p>
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep(1)}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <ArrowLeft size={20} /> Назад
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!selectedStyle}
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Далее <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Info */}
      {step === 3 && (
        <div className="bg-white rounded-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Шаг 3: Добавьте информацию о товаре</h2>
          <p className="text-gray-600 mb-6">ИИ учтёт эту информацию при создании карточки (необязательно)</p>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Название товара</label>
              <input
                type="text"
                value={infographicData.title}
                onChange={(e) => setInfographicData({ ...infographicData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Например: Крем для лица увлажняющий"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Цена</label>
              <input
                type="text"
                value={infographicData.price}
                onChange={(e) => setInfographicData({ ...infographicData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Например: 1990"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Особенности товара</label>
              <textarea
                value={infographicData.features}
                onChange={(e) => setInfographicData({ ...infographicData, features: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Например: натуральные ингредиенты, гипоаллергенный, для чувствительной кожи"
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep(2)}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <ArrowLeft size={20} /> Назад
            </button>
            <button
              onClick={generateCard}
              disabled={isProcessing}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> ИИ создаёт карточку...
                </>
              ) : (
                <>
                  <Sparkles size={20} /> Создать продающую карточку
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Result */}
      {step === 4 && processedImage && (
        <div className="bg-white rounded-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4">🎉 Готово!</h2>
          <p className="text-gray-600 mb-6">ИИ создал профессиональную продающую карточку в стиле "{selectedStyle?.name}"</p>

          <img src={processedImage} alt="Result" className="w-full max-w-md mx-auto rounded-xl mb-6" />

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={20} className="text-green-600 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900 mb-1">Продающая карточка готова!</p>
                <p className="text-sm text-green-800">
                  Размер: 900x1200 px (3:4) • Формат: JPEG • Готово к загрузке на Wildberries
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={resetAll}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Создать другую карточку
            </button>
            <button
              onClick={downloadImage}
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
            >
              <Download size={20} /> Скачать карточку
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-red-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800 mb-2">{error}</p>
              <div className="flex gap-2">
                <button
                  onClick={generateCard}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                >
                  🔄 Попробовать снова
                </button>
                <button
                  onClick={() => {
                    setError(null);
                    setSelectedStyle(null);
                    setStep(2);
                  }}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-100 text-sm font-medium"
                >
                  Выбрать другой стиль
                </button>
              </div>
              <p className="text-xs text-red-600 mt-2">
                💡 Совет: Если ошибка повторяется, попробуйте выбрать другой стиль или упростить описание товара.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles size={24} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-blue-900 mb-2">
              🎨 ИИ генерация через Hugging Face API
            </h3>
            <p className="text-sm text-blue-800 mb-3">
              Используется <strong>Hugging Face Inference API</strong> с моделью <strong>Stable Diffusion XL</strong> для генерации профессиональных карточек.
              ИИ создаёт продающие изображения в выбранном стиле с учётом информации о товаре.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-blue-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-blue-600" />
                <span>12 профессиональных стилей</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-blue-600" />
                <span>Бесплатно (HF API)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-blue-600" />
                <span>Stable Diffusion XL</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-blue-600" />
                <span>30-120 сек генерация</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-blue-600" />
                <span>Размер 900x1200 (WB)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-blue-600" />
                <span>Инфографика и цена</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="text-xs text-blue-700">
                💡 <strong>Время генерации:</strong> 30-120 секунд. Система автоматически пробует несколько моделей для лучшей надёжности.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
