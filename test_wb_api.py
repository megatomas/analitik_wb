#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Тестовый скрипт для проверки работы с WB API с локального компьютера.
Этот скрипт покажет, блокирует ли WB API ваш IP или нет.

Использование:
1. Установите Python 3.7+ (если ещё не установлен)
2. Установите зависимости: pip install requests
3. Замените YOUR_API_KEY на ваш реальный API ключ от WB
4. Запустите: python test_wb_api.py
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

# Базовый URL для статистики WB
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
        print("   Откройте файл test_wb_api.py и измените переменную API_KEY")
        return False
    
    print(f"✅ API ключ установлен: {API_KEY[:20]}...")
    print(f"🌐 Базовый URL: {BASE_URL}")
    print()
    
    return True


def get_sales():
    """Получение данных о продажах"""
    print("=" * 60)
    print("📊 ТЕСТ 2: Получение данных о продажах")
    print("=" * 60)
    
    # Дата за последние 30 дней
    date_from = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
    
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
        
        if response.status_code == 200:
            print("✅ УСПЕХ! Запрос выполнен успешно!")
            print()
            
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
                return False
                
        elif response.status_code == 401:
            print("❌ ОШИБКА 401: Неверный API ключ!")
            print("   Проверьте что ключ скопирован правильно")
            return False
            
        elif response.status_code == 403:
            print("❌ ОШИБКА 403: Доступ запрещён!")
            print("   У ключа нет прав на этот раздел")
            print("   Проверьте что отмечены категории: Статистика + Аналитика")
            return False
            
        elif response.status_code == 429:
            print("❌ ОШИБКА 429: Превышен лимит запросов!")
            print("   Подождите 1-2 минуты и попробуйте снова")
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
        print(f"❌ НЕОЖИДАННАЯ ОШИБКА: {e}")
        return False


def get_stocks():
    """Получение данных об остатках"""
    print()
    print("=" * 60)
    print("📦 ТЕСТ 3: Получение данных об остатках")
    print("=" * 60)
    
    # Дата за последние 30 дней
    date_from = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
    
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
        
        if response.status_code == 200:
            print("✅ УСПЕХ! Запрос выполнен успешно!")
            print()
            
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
                return False
                
        else:
            print(f"❌ ОШИБКА {response.status_code}")
            print(f"   Ответ: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ ОШИБКА: {e}")
        return False


def main():
    """Главная функция"""
    print()
    print("🚀 ТЕСТ WB API С ЛОКАЛЬНОГО КОМПЬЮТЕРА")
    print()
    print("Этот скрипт проверит:")
    print("  1. Работает ли подключение к WB API")
    print("  2. Можно ли получить данные о продажах")
    print("  3. Можно ли получить данные об остатках")
    print()
    print("Если все тесты пройдут успешно - значит WB API")
    print("блокирует только облачные IP (Vercel, Cloudflare)")
    print("и работает с домашнего IP!")
    print()
    
    # Тест 1: Проверка подключения
    if not test_connection():
        return
    
    # Тест 2: Получение продаж
    sales_ok = get_sales()
    
    # Тест 3: Получение остатков
    stocks_ok = get_stocks()
    
    # Итоговый результат
    print()
    print("=" * 60)
    print("📊 ИТОГОВЫЙ РЕЗУЛЬТАТ")
    print("=" * 60)
    print()
    
    if sales_ok and stocks_ok:
        print("✅ ВСЕ ТЕСТЫ ПРОЙДЕНУ УСПЕШНО!")
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
        print()
    
    print("=" * 60)
    print()


if __name__ == "__main__":
    main()
