import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Download, Loader2, Sparkles, CheckCircle2, AlertCircle, Camera, Wand2 } from 'lucide-react';

interface ProcessedImage {
  original: string;
  processed: string;
  width: number;
  height: number;
}

export default function CardCreator() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBg, setSelectedBg] = useState<'white' | 'gradient' | 'custom'>('white');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Требования WB к фото
  const WB_REQUIREMENTS = {
    minWidth: 900,
    minHeight: 1200,
    aspectRatio: 3 / 4, // 3:4
    maxSizeMB: 10,
    format: 'JPEG',
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Проверка размера файла
    if (file.size > WB_REQUIREMENTS.maxSizeMB * 1024 * 1024) {
      setError(`Размер файла не должен превышать ${WB_REQUIREMENTS.maxSizeMB} МБ`);
      return;
    }

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, выберите изображение');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setProcessedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Создаем canvas для обработки изображения
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

      // Рассчитываем размеры для WB (3:4)
      const targetWidth = WB_REQUIREMENTS.minWidth;
      const targetHeight = WB_REQUIREMENTS.minHeight;
      
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Заполняем фон
      if (selectedBg === 'white') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      } else if (selectedBg === 'gradient') {
        const gradient = ctx.createLinearGradient(0, 0, 0, targetHeight);
        gradient.addColorStop(0, '#f8f9fa');
        gradient.addColorStop(1, '#e9ecef');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      // Рассчитываем масштабирование изображения
      const imgAspectRatio = img.width / img.height;
      const canvasAspectRatio = targetWidth / targetHeight;
      
      let drawWidth, drawHeight, drawX, drawY;
      
      if (imgAspectRatio > canvasAspectRatio) {
        // Изображение шире - масштабируем по высоте
        drawHeight = targetHeight * 0.85; // 85% высоты для отступов
        drawWidth = drawHeight * imgAspectRatio;
        drawX = (targetWidth - drawWidth) / 2;
        drawY = (targetHeight - drawHeight) / 2;
      } else {
        // Изображение выше - масштабируем по ширине
        drawWidth = targetWidth * 0.85; // 85% ширины для отступов
        drawHeight = drawWidth / imgAspectRatio;
        drawX = (targetWidth - drawWidth) / 2;
        drawY = (targetHeight - drawHeight) / 2;
      }

      // Рисуем изображение
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

      // Имитация ИИ обработки (в реальном приложении здесь будет API вызов)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Добавляем легкие улучшения
      ctx.filter = 'contrast(1.05) saturate(1.1)';
      ctx.drawImage(canvas, 0, 0);
      ctx.filter = 'none';

      // Конвертируем в JPEG
      const processedDataUrl = canvas.toDataURL('image/jpeg', 0.95);

      setProcessedImage({
        original: selectedImage,
        processed: processedDataUrl,
        width: targetWidth,
        height: targetHeight,
      });

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
    link.href = processedImage.processed;
    link.click();
  };

  const resetImage = () => {
    setSelectedImage(null);
    setProcessedImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Camera size={28} className="text-purple-600" />
          Создание карточки товара
        </h2>
        <p className="text-gray-500 mt-1">
          Загрузите фото товара, и мы создадим продающую карточку по требованиям Wildberries
        </p>
      </div>

      {/* Requirements Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <ImageIcon size={20} className="text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Требования WB к фото</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Минимальный размер: {WB_REQUIREMENTS.minWidth}x{WB_REQUIREMENTS.minHeight} пикселей</li>
              <li>• Соотношение сторон: 3:4</li>
              <li>• Формат: JPEG</li>
              <li>• Максимальный размер: {WB_REQUIREMENTS.maxSizeMB} МБ</li>
              <li>• Рекомендуется белый фон</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Upload */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Upload size={20} className="text-purple-600" />
              Загрузка фото
            </h3>

            {!selectedImage ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all"
              >
                <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 font-medium mb-2">
                  Нажмите для загрузки фото
                </p>
                <p className="text-sm text-gray-500">
                  или перетащите файл сюда
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  JPG, PNG до {WB_REQUIREMENTS.maxSizeMB} МБ
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Original"
                    className="w-full h-auto rounded-xl border border-gray-200"
                  />
                  <button
                    onClick={resetImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>

                {/* Background Selection */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Фон карточки
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setSelectedBg('white')}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        selectedBg === 'white'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="w-full h-16 bg-white rounded-lg border border-gray-200"></div>
                      <p className="text-xs text-center mt-1">Белый</p>
                    </button>
                    <button
                      onClick={() => setSelectedBg('gradient')}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        selectedBg === 'gradient'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="w-full h-16 bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg"></div>
                      <p className="text-xs text-center mt-1">Градиент</p>
                    </button>
                    <button
                      onClick={() => setSelectedBg('custom')}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        selectedBg === 'custom'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="w-full h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg"></div>
                      <p className="text-xs text-center mt-1">Скоро</p>
                    </button>
                  </div>
                </div>

                <button
                  onClick={processImage}
                  disabled={isProcessing}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Обработка...
                    </>
                  ) : (
                    <>
                      <Wand2 size={20} />
                      Создать карточку с ИИ
                    </>
                  )}
                </button>
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

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </div>

        {/* Right Column - Result */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Sparkles size={20} className="text-purple-600" />
              Результат
            </h3>

            {!processedImage ? (
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
                <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">
                  Здесь появится готовая карточка
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Загрузите фото и нажмите "Создать карточку"
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={processedImage.processed}
                    alt="Processed"
                    className="w-full h-auto rounded-xl border border-gray-200"
                  />
                  <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                    <CheckCircle2 size={14} />
                    Готово
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Информация:</h4>
                  <div className="space-y-1 text-xs text-gray-600">
                    <p>• Размер: {processedImage.width}x{processedImage.height} пикселей</p>
                    <p>• Соотношение: 3:4 (требование WB)</p>
                    <p>• Формат: JPEG</p>
                    <p>• Готово к загрузке на WB</p>
                  </div>
                </div>

                <button
                  onClick={downloadImage}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Скачать карточку
                </button>

                <button
                  onClick={resetImage}
                  className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Создать другую карточку
                </button>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-4">
            <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
              <Sparkles size={18} className="text-purple-600" />
              Советы по созданию карточек
            </h4>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• Используйте качественное фото товара</li>
              <li>• Товар должен занимать 70-85% кадра</li>
              <li>• Белый фон увеличивает конверсию</li>
              <li>• Избегайте теней и бликов</li>
              <li>• Фото должно быть четким и ярким</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
