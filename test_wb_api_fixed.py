#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Тестовый скрипт для проверки работы с WB API с локального компьютера.
ИСПРАВЛЕННАЯ ВЕРСИЯ с правильными URL

Использование:
1. Установите Python 3.7+ (если ещё не установлен)
2. Установите зависимости: pip install requests
3. Замените YOUR_API_KEY на ваш реальный API ключ от WB
4. Запустите: python test_wb_api_fixed.py
"""

import requests
import json
from datetime import datetime, timedelta

# ============================================
# НАСТРОЙКИ - ЗАМЕНИТЕ НА СВОИ ДАННЫЕ
# ============================================

# Ваш API ключ от Wildberries
# Получить можно здесь: https://seller.wildberries.ru → Настройки → Доступ к API
API_KEY = "YOUR_API_KEY_HERE"

# ПРАВИЛЬНЫЕ URL для WB API
BASE_URL = "https://statistics-api.wildberries.ru"

# ============================================
# ФУНКЦИИ ДЛЯ РАБОТЫ С API
# ============================================

def test_connection():
    """Проверка базового подключения к API"""
    print("=" * 60)
    print("🔍 ТЕСТ 1: Проверка подключения к WB API")
    print("=" * 60)
    
    if API_KEY == "YOUR_API_KEY_HERE":
        print("❌ ОШИБКА: Замените YOUR_API_KEY на ваш реальный API ключ!")
        print("   Откройте файл test_wb_api_fixed.py и измените переменную API_KEY")
        return False
    
    print(f"✅ API ключ установлен: {API_KEY[:20]}...")
    print(f"🌐 Базовый URL: {BASE_URL}")
    print()
    
    # Проверяем доступность сервера
    try:
        print("⏳ Проверяем доступность сервера WB API...")
        response = requests.get("https://statistics-api.wildberries.ru", timeout=10)
        print(f"✅ Сервер доступен (статус: {response.status_code})")
    except Exception as e:
        print(f"❌ Сервер недоступен: {e}")
        print("   Возможно проблема с интернетом или DNS")
        return False
    
    return True


def get_sales():
    """Получение данных о продажах"""
    print("=" * 60)
    print("📊 ТЕСТ 2: Получение данных о продажах")
    print("=" * 60)
    
    # Дата за последние 30 дней
    date_from = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
    
    # ПРАВИЛЬНЫЙ URL для продаж
    url = f"{BASE_URL}/api/v1/supplier/sales"
    params = {"dateFrom": date_from}
    headers = {"Authorization": API_KEY}
    
    print(f"🔗 URL: {url}")
    print(f"📅 Дата от: {date_from}")
    print(f"🔑 Заголовки: Authorization: {API_KEY[:20]}...")
    print()
    
    try:
        print("⏳ Отправка запроса...")
        response = requests.get(url, params=params, headers=headers, timeout=30)
        
        print(f"📡 Статус ответа: {response.status_code}")
        print(f"📦 Размер ответа: {len(response.content)} байт")
        
        if response.status_code == 200:
            print("✅ УСПЕХ! Запрос выполнен успешно!")
            print()
            
            try:
                sales_data = response.json()
                
                if isinstance(sales_data, list):
                    print(f"📦 Получено продаж: {len(sales_data)}")
                    
                    if len(sales_data) > 0:
                        print()
                        print("📋 Пример первой продажи:")
                        first_sale = sales_data[0]
                        print(json.dumps(first_sale, indent=2, ensure_ascii=False))
                        
                        # Подсчёт общей выручки
                        total_revenue = sum(sale.get('retailPriceWithDiscRub', 0) for sale in sales_data)
                        print()
                        print(f"💰 Общая выручка за период: {total_revenue:,.2f} ₽")
                        
                        return True
                    else:
                        print("⚠️  Продаж нет за выбранный период")
                        return True
                else:
                    print(f"⚠️  Неожиданный формат данных: {type(sales_data)}")
                    print(f"   Ответ: {response.text[:500]}")
                    return False
            except json.JSONDecodeError as e:
                print(f"❌ Ошибка парсинга JSON: {e}")
                print(f"   Ответ: {response.text[:500]}")
                return False
                
        elif response.status_code == 401:
            print("❌ ОШИБКА 401: Неверный API ключ!")
            print("   Проверьте что ключ скопирован правильно")
            print(f"   Ответ: {response.text}")
            return False
            
        elif response.status_code == 403:
            print("❌ ОШИБКА 403: Доступ запрещён!")
            print("   У ключа нет прав на этот раздел")
            print("   Проверьте что отмечены категории: Статистика + Аналитика")
            print(f"   Ответ: {response.text}")
            return False
            
        elif response.status_code == 429:
            print("❌ ОШИБКА 429: Превышен лимит запросов!")
            print("   Подождите 1-2 минуты и попробуйте снова")
            print(f"   Ответ: {response.text}")
            return False
            
        else:
            print(f"❌ ОШИБКА {response.status_code}")
            print(f"   Ответ: {response.text}")
            return False
            
    except requests.exceptions.Timeout:
        print("❌ ОШИБКА: Превышено время ожидания (30 сек)")
        return False
        
    except requests.exceptions.ConnectionError as e:
        print("❌ ОШИБКА: Не удалось подключиться к серверу")
        print(f"   Детали: {e}")
        print()
        print("   Возможные причины:")
        print("   1. Проблема с интернетом")
        print("   2. DNS не может разрешить statistics-api.wildberries.ru")
        print("   3. Firewall блокирует соединение")
        print("   4. WB API временно недоступен")
        return False
        
    except Exception as e:
        print(f"❌ НЕОЖИДАННАЯ ОШИБКА: {e}")
        import traceback
        traceback.print_exc()
        return False


def get_stocks():
    """Получение данных об остатках"""
    print()
    print("=" * 60)
    print("📦 ТЕСТ 3: Получение данных об остатках")
    print("=" * 60)
    
    # Дата за последние 30 дней
    date_from = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
    
    # ПРАВИЛЬНЫЙ URL для остатков
    url = f"{BASE_URL}/api/v1/supplier/stocks"
    params = {"dateFrom": date_from}
    headers = {"Authorization": API_KEY}
    
    print(f"🔗 URL: {url}")
    print(f"📅 Дата от: {date_from}")
    print()
    
    try:
        print("⏳ Отправка запроса...")
        response = requests.get(url, params=params, headers=headers, timeout=30)
        
        print(f"📡 Статус ответа: {response.status_code}")
        print(f"📦 Размер ответа: {len(response.content)} байт")
        
        if response.status_code == 200:
            print("✅ УСПЕХ! Запрос выполнен успешно!")
            print()
            
            try:
                stocks_data = response.json()
                
                if isinstance(stocks_data, list):
                    print(f"📦 Получено остатков: {len(stocks_data)}")
                    
                    if len(stocks_data) > 0:
                        print()
                        print("📋 Пример первого остатка:")
                        first_stock = stocks_data[0]
                        print(json.dumps(first_stock, indent=2, ensure_ascii=False))
                        
                        # Подсчёт общего количества
                        total_quantity = sum(stock.get('quantity', 0) for stock in stocks_data)
                        print()
                        print(f"📊 Общее количество товаров: {total_quantity} шт.")
                        
                        return True
                    else:
                        print("⚠️  Остатков нет")
                        return True
                else:
                    print(f"⚠️  Неожиданный формат данных: {type(stocks_data)}")
                    print(f"   Ответ: {response.text[:500]}")
                    return False
            except json.JSONDecodeError as e:
                print(f"❌ Ошибка парсинга JSON: {e}")
                print(f"   Ответ: {response.text[:500]}")
                return False
                
        else:
            print(f"❌ ОШИБКА {response.status_code}")
            print(f"   Ответ: {response.text}")
            return False
            
    except requests.exceptions.Timeout:
        print("❌ ОШИБКА: Превышено время ожидания (30 сек)")
        return False
        
    except requests.exceptions.ConnectionError as e:
        print("❌ ОШИБКА: Не удалось подключиться к серверу")
        print(f"   Детали: {e}")
        return False
        
    except Exception as e:
        print(f"❌ ОШИБКА: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_alternative_endpoints():
    """Проверка альтернативных эндпоинтов"""
    print()
    print("=" * 60)
    print("🔍 ТЕСТ 4: Проверка альтернативных эндпоинтов")
    print("=" * 60)
    
    endpoints = [
        ("/api/v1/supplier/orders", "Заказы"),
        ("/api/v1/supplier/incomes", "Поставки"),
    ]
    
    date_from = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
    headers = {"Authorization": API_KEY}
    
    for endpoint, name in endpoints:
        print(f"\n🔗 Проверяем: {name}")
        url = f"{BASE_URL}{endpoint}"
        params = {"dateFrom": date_from}
        
        try:
            response = requests.get(url, params=params, headers=headers, timeout=10)
            print(f"   Статус: {response.status_code}")
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    if isinstance(data, list):
                        print(f"   ✅ Получено записей: {len(data)}")
                    else:
                        print(f"   ✅ Ответ получен")
                except:
                    print(f"   ✅ Ответ получен (не JSON)")
            elif response.status_code == 404:
                print(f"   ❌ Эндпоинт не найден (404)")
            else:
                print(f"   ⚠️  Статус: {response.status_code}")
                
        except Exception as e:
            print(f"   ❌ Ошибка: {e}")


def main():
    """Главная функция"""
    print()
    print("🚀 ТЕСТ WB API С ЛОКАЛЬНОГО КОМПЬЮТЕРА (ИСПРАВЛЕННАЯ ВЕРСИЯ)")
    print()
    print("Этот скрипт проверит:")
    print("  1. Доступность сервера WB API")
    print("  2. Получение данных о продажах")
    print("  3. Получение данных об остатках")
    print("  4. Альтернативные эндпоинты")
    print()
    print("Используются ПРАВИЛЬНЫЕ URL:")
    print(f"  • {BASE_URL}")
    print()
    
    # Тест 1: Проверка подключения
    if not test_connection():
        print("\n❌ Базовое подключение не работает. Дальнейшие тесты бессмысленны.")
        return
    
    # Тест 2: Получение продаж
    sales_ok = get_sales()
    
    # Тест 3: Получение остатков
    stocks_ok = get_stocks()
    
    # Тест 4: Альтернативные эндпоинты
    test_alternative_endpoints()
    
    # Итоговый результат
    print()
    print("=" * 60)
    print("📊 ИТОГОВЫЙ РЕЗУЛЬТАТ")
    print("=" * 60)
    print()
    
    if sales_ok and stocks_ok:
        print("✅ ВСЕ ТЕСТЫ ПРОЙДЕНЫ УСПЕШНО!")
        print()
        print("🎉 WB API работает с вашего домашнего IP!")
        print()
        print("📝 ВЫВОД:")
        print("   WB API блокирует облачные IP (Vercel, Cloudflare Workers)")
        print("   но работает с домашнего IP.")
        print()
        print("💡 РЕШЕНИЕ:")
        print("   Для работы сайта нужно использовать прокси-сервер")
        print("   с домашним/мобильным IP, а не облачный.")
        print()
        print("   Варианты:")
        print("   1. Арендовать VPS с российским IP (Hetzner, Timeweb)")
        print("   2. Использовать домашний компьютер как сервер")
        print("   3. Использовать мобильный интернет через роутер")
        print()
    elif sales_ok or stocks_ok:
        print("⚠️  ЧАСТИЧНЫЙ УСПЕХ")
        print()
        print(f"   Продажи: {'✅' if sales_ok else '❌'}")
        print(f"   Остатки: {'✅' if stocks_ok else '❌'}")
        print()
        print("   Возможно у ключа нет прав на какой-то раздел")
        print()
    else:
        print("❌ ТЕСТЫ НЕ ПРОЙДЕНЫ")
        print()
        print("   Возможные причины:")
        print("   1. Неверный API ключ")
        print("   2. Нет прав доступа (Статистика/Аналитика)")
        print("   3. WB API временно недоступен")
        print("   4. Проблемы с интернетом")
        print("   5. Firewall блокирует соединение")
        print()
        print("💡 ПОПРОБУЙТЕ:")
        print("   • Проверить интернет-соединение")
        print("   • Отключить VPN/прокси")
        print("   • Проверить firewall")
        print("   • Попробовать с другого устройства")
        print()
    
    print("=" * 60)
    print()


if __name__ == "__main__":
    main()
