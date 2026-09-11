import { useState, useRef } from 'react';
import { Upload, Download, Loader2, Sparkles, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

interface Concept {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export default function CardCreator() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const [infographicData, setInfographicData] = useState({
    title: '',
    price: '',
    features: '',
    material: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const concepts: Concept[] = [
    { id: 'studio-white', name: 'Студийное фото', description: 'Каталожная съемка на белом фоне', icon: '📸' },
    { id: 'studio-gradient', name: 'Студия с градиентом', description: 'Профессиональная съемка с градиентным фоном', icon: '🎨' },
    { id: 'interior-living', name: 'В интерьере', description: 'Товар в домашней обстановке', icon: '🏠' },
    { id: 'interior-office', name: 'В офисе', description: 'Товар в офисной обстановке', icon: '💼' },
    { id: 'lifestyle-outdoor', name: 'На улице', description: 'Товар в городской среде', icon: '🌆' },
    { id: 'lifestyle-nature', name: 'На природе', description: 'Товар на фоне природы', icon: '🌿' },
    { id: 'composition-flatlay', name: 'Flatlay', description: 'Композиция сверху', icon: '📐' },
    { id: 'composition-minimal', name: 'Минимализм', description: 'Минималистичная композиция', icon: '⚪' },
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

  const processImage = async () => {
    if (!selectedImage || !selectedConcept) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Имитация ИИ обработки (в реальности здесь будет API вызов)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Создаем canvas для обработки
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Не удалось создать canvas');

      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = selectedImage;
      });

      // Размер для WB (3:4)
      canvas.width = 900;
      canvas.height = 1200;

      // Фон в зависимости от концепции
      if (selectedConcept.id === 'studio-white') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, 900, 1200);
      } else if (selectedConcept.id === 'studio-gradient') {
        const gradient = ctx.createLinearGradient(0, 0, 0, 1200);
        gradient.addColorStop(0, '#f8f9fa');
        gradient.addColorStop(1, '#e9ecef');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 900, 1200);
      } else {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, 900, 1200);
      }

      // Масштабируем изображение
      const imgAspectRatio = img.width / img.height;
      const canvasAspectRatio = 900 / 1200;
      
      let drawWidth, drawHeight, drawX, drawY;
      
      if (imgAspectRatio > canvasAspectRatio) {
        drawHeight = 1200 * 0.85;
        drawWidth = drawHeight * imgAspectRatio;
        drawX = (900 - drawWidth) / 2;
        drawY = (1200 - drawHeight) / 2;
      } else {
        drawWidth = 900 * 0.85;
        drawHeight = drawWidth / imgAspectRatio;
        drawX = (900 - drawWidth) / 2;
        drawY = (1200 - drawHeight) / 2;
      }

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

      // Добавляем инфографику если есть данные
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

      const processedDataUrl = canvas.toDataURL('image/jpeg', 0.95);
      setProcessedImage(processedDataUrl);
      setStep(4);
    } catch (err: any) {
      setError('Ошибка при обработке изображения: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.download = `wb-card-${Date.now()}.jpg`;
    link.href = processedImage;
    link.click();
  };

  const resetAll = () => {
    setStep(1);
    setSelectedImage(null);
    setSelectedConcept(null);
    setInfographicData({ title: '', price: '', features: '', material: '' });
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Создание карточки товара</h1>
        <p className="text-gray-600">Создайте профессиональную карточку товара с помощью ИИ за 3 шага</p>
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
          <span>Концепция</span>
          <span>Инфографика</span>
          <span>Результат</span>
        </div>
      </div>

      {/* Step 1: Upload */}
      {step === 1 && (
        <div className="bg-white rounded-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Шаг 1: Загрузите фото товара</h2>
          <p className="text-gray-600 mb-6">Подойдет обычное фото с телефона</p>

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

      {/* Step 2: Concept */}
      {step === 2 && (
        <div className="bg-white rounded-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Шаг 2: Выберите концепцию</h2>
          <p className="text-gray-600 mb-6">ИИ создаст профессиональное фото в выбранном стиле</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {concepts.map((concept) => (
              <button
                key={concept.id}
                onClick={() => setSelectedConcept(concept)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedConcept?.id === concept.id
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-4xl mb-2">{concept.icon}</div>
                <h3 className="font-semibold text-sm mb-1">{concept.name}</h3>
                <p className="text-xs text-gray-500">{concept.description}</p>
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
              disabled={!selectedConcept}
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Далее <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Infographic */}
      {step === 3 && (
        <div className="bg-white rounded-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Шаг 3: Добавьте инфографику</h2>
          <p className="text-gray-600 mb-6">Укажите характеристики товара (необязательно)</p>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Название товара</label>
              <input
                type="text"
                value={infographicData.title}
                onChange={(e) => setInfographicData({ ...infographicData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Например: Кроссовки Nike Air Max"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Цена</label>
              <input
                type="text"
                value={infographicData.price}
                onChange={(e) => setInfographicData({ ...infographicData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Например: 5990"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Особенности</label>
              <textarea
                value={infographicData.features}
                onChange={(e) => setInfographicData({ ...infographicData, features: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Например: Натуральная кожа, амортизация"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Материал</label>
              <input
                type="text"
                value={infographicData.material}
                onChange={(e) => setInfographicData({ ...infographicData, material: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Например: 100% хлопок"
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
              onClick={processImage}
              disabled={isProcessing}
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Обработка...
                </>
              ) : (
                <>
                  <Sparkles size={20} /> Создать карточку
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Result */}
      {step === 4 && processedImage && (
        <div className="bg-white rounded-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Готово!</h2>
          <p className="text-gray-600 mb-6">Ваша карточка готова к загрузке на Wildberries</p>

          <img src={processedImage} alt="Result" className="w-full max-w-md mx-auto rounded-xl mb-6" />

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={20} className="text-green-600 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900 mb-1">Карточка готова!</p>
                <p className="text-sm text-green-800">
                  Размер: 900x1200 px (3:4) • Формат: JPEG • Готово к загрузке на WB
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
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>💡 Совет:</strong> Для создания карточек как в Aidentika.com с полноценной ИИ генерацией 
          (удаление фона, генерация окружения) необходимо подключить API генеративного ИИ 
          (например, OpenAI DALL-E, Stability AI или Midjourney API). 
          Текущая версия использует базовую обработку через Canvas API.
        </p>
      </div>
    </div>
  );
}
