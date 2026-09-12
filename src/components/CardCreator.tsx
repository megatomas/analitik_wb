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

  // Стили карточек с профессиональными промптами
  const styles: Style[] = [
    {
      id: 'cosmetics',
      name: 'Косметика',
      description: 'Элегантный стиль для косметики и ухода',
      icon: '💄',
      prompt: 'luxury cosmetics product photography, elegant marble surface, soft pink lighting, premium beauty brand, professional studio shot, 8k resolution, high-end aesthetic, minimalist composition'
    },
    {
      id: 'electronics',
      name: 'Электроника',
      description: 'Современный стиль для гаджетов',
      icon: '📱',
      prompt: 'modern electronics product photography, sleek dark background, dramatic blue accent lighting, tech gadget showcase, professional studio shot, 8k resolution, futuristic aesthetic, clean composition'
    },
    {
      id: 'fashion',
      name: 'Одежда',
      description: 'Стильный образ для моды',
      icon: '👗',
      prompt: 'fashion product photography, stylish clothing display, neutral beige background, soft natural lighting, editorial style shot, 8k resolution, trendy aesthetic, professional composition'
    },
    {
      id: 'food',
      name: 'Продукты питания',
      description: 'Аппетитный стиль для еды',
      icon: '🍕',
      prompt: 'appetizing food product photography, rustic wooden surface, warm golden lighting, fresh ingredients visible, professional food styling, 8k resolution, inviting aesthetic, close-up composition'
    },
    {
      id: 'sports',
      name: 'Спорт',
      description: 'Динамичный стиль для спорта',
      icon: '⚽',
      prompt: 'dynamic sports product photography, energetic composition, vibrant background, action-oriented lighting, athletic brand aesthetic, 8k resolution, powerful visual, professional shot'
    },
    {
      id: 'home',
      name: 'Дом и сад',
      description: 'Уютный стиль для дома',
      icon: '🏠',
      prompt: 'cozy home product photography, warm interior setting, natural daylight, lifestyle composition, comfortable aesthetic, 8k resolution, inviting atmosphere, professional shot'
    },
    {
      id: 'auto',
      name: 'Автотовары',
      description: 'Премиум стиль для авто',
      icon: '🚗',
      prompt: 'premium automotive product photography, sleek metallic surface, dramatic lighting, luxury car accessories showcase, professional studio shot, 8k resolution, high-end aesthetic, sophisticated composition'
    },
    {
      id: 'kids',
      name: 'Детские товары',
      description: 'Яркий стиль для детей',
      icon: '🧸',
      prompt: 'cheerful kids product photography, bright playful colors, fun composition, child-friendly aesthetic, professional studio shot, 8k resolution, joyful atmosphere, engaging visual'
    },
    {
      id: 'premium',
      name: 'Премиум',
      description: 'Люксовый стиль для дорогих товаров',
      icon: '💎',
      prompt: 'luxury premium product photography, elegant black and gold theme, dramatic spotlight lighting, exclusive brand aesthetic, professional studio shot, 8k resolution, sophisticated composition, high-end visual'
    },
    {
      id: 'eco',
      name: 'Эко товары',
      description: 'Натуральный стиль для эко',
      icon: '🌿',
      prompt: 'eco-friendly product photography, natural green setting, organic materials visible, sustainable brand aesthetic, soft natural lighting, 8k resolution, earthy tones, professional composition'
    },
    {
      id: 'tech',
      name: 'Технологии',
      description: 'Футуристичный стиль для tech',
      icon: '🔬',
      prompt: 'cutting-edge technology product photography, futuristic holographic elements, neon accent lighting, innovative design showcase, professional studio shot, 8k resolution, modern aesthetic, clean composition'
    },
    {
      id: 'minimal',
      name: 'Минимализм',
      description: 'Чистый минималистичный стиль',
      icon: '⚪',
      prompt: 'minimalist product photography, pure white background, clean simple composition, soft diffused lighting, Scandinavian aesthetic, 8k resolution, professional shot, elegant simplicity'
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

  const generateCard = async () => {
    if (!selectedImage || !selectedStyle) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Формируем промпт на основе стиля и информации о товаре
      let fullPrompt = selectedStyle.prompt;
      
      if (infographicData.title) {
        fullPrompt += `, featuring ${infographicData.title}`;
      }
      
      if (infographicData.features) {
        fullPrompt += `, showcasing ${infographicData.features}`;
      }

      fullPrompt += ', product centered, professional e-commerce photography, ready for marketplace listing';

      // Генерируем изображение через Pollinations AI
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=900&height=1200&nologo=true&model=flux&seed=${Date.now()}`;
      
      console.log('Генерация карточки:', imageUrl);

      // Загружаем сгенерированное изображение
      const response = await fetch(imageUrl);
      
      if (!response.ok) {
        throw new Error('Не удалось сгенерировать изображение');
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
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles size={24} className="text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-green-900 mb-2">
              🎨 ИИ генерация продающих карточек
            </h3>
            <p className="text-sm text-green-800 mb-3">
              Используется <strong>Pollinations AI</strong> с моделью Flux для генерации профессиональных карточек.
              ИИ создаёт продающие изображения в выбранном стиле с учётом информации о товаре.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-green-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-green-600" />
                <span>12 профессиональных стилей</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-green-600" />
                <span>Полностью бесплатно</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-green-600" />
                <span>Безлимитное использование</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-green-600" />
                <span>Без API ключей</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-green-600" />
                <span>Размер 900x1200 (WB)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-green-600" />
                <span>Инфографика и цена</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
