#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Запрос остатков с WB API
Запустите в PyCharm для проверки работы
"""

import requests
import json
from datetime import datetime, timedelta

# ============================================
# ВАШ API КЛЮЧ - ЗАМЕНИТЕ!
# ============================================
API_KEY = "YOUR_API_KEY_HERE"

# URL для остатков
URL = "https://statistics-api.wildberries.ru/api/v1/supplier/stocks"

# Заголовки
HEADERS = {
    "Authorization": API_KEY,
    "Content-Type": "application/json"
}


def get_stocks():
    """Получение остатков товаров"""
    
    print("=" * 60)
    print("📦 ЗАПРОС ОСТАТКОВ С WB API")
    print("=" * 60)
    print()
    
    if API_KEY == "YOUR_API_KEY_HERE":
        print("❌ Замените YOUR_API_KEY на реальный ключ!")
        return
    
    # Дата с которой получаем данные (вчера)
    date_from = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
    
    print(f"🔗 URL: {URL}")
    print(f"📅 Дата от: {date_from}")
    print(f"🔑 Ключ: {API_KEY[:20]}...")
    print()
    
    try:
        print("⏳ Отправка запроса...")
        
        response = requests.get(
            URL,
            headers=HEADERS,
            params={"dateFrom": date_from},
            timeout=30
        )
        
        print(f"📡 Статус: {response.status_code}")
        print()
        
        if response.status_code == 200:
            stocks = response.json()
            
            print(f"✅ УСПЕХ! Получено остатков: {len(stocks)}")
            print()
            
            if len(stocks) > 0:
                # Группируем по складам
                warehouses = {}
                for stock in stocks:
                    wh = stock.get('warehouseName', 'Неизвестный')
                    if wh not in warehouses:
                        warehouses[wh] = []
                    warehouses[wh].append(stock)
                
                print(f"📊 Складов: {len(warehouses)}")
                print()
                
                for wh_name, items in warehouses.items():
                    total_qty = sum(item.get('quantity', 0) for item in items)
                    print(f"🏭 {wh_name}")
                    print(f"   Товаров: {len(items)}, Количество: {total_qty} шт.")
                    print()
                
                # Первые 5 товаров
                print("=" * 60)
                print("📋 ПЕРВЫЕ 5 ТОВАРОВ:")
                print("=" * 60)
                print()
                
                for i, stock in enumerate(stocks[:5]):
                    print(f"{i+1}. Артикул: {stock.get('barcode', 'N/A')}")
                    print(f"   Название: {stock.get('subject', 'N/A')}")
                    print(f"   Бренд: {stock.get('brand', 'N/A')}")
                    print(f"   Склад: {stock.get('warehouseName', 'N/A')}")
                    print(f"   Количество: {stock.get('quantity', 0)} шт.")
                    print(f"   В пути: {stock.get('inWayToClient', 0)} шт.")
                    print(f"   На сборке: {stock.get('inWayFromClient', 0)} шт.")
                    print()
                
                # Общая статистика
                total_quantity = sum(s.get('quantity', 0) for s in stocks)
                total_in_way = sum(s.get('inWayToClient', 0) for s in stocks)
                
                print("=" * 60)
                print("📊 ОБЩАЯ СТАТИСТИКА:")
                print("=" * 60)
                print(f"   Всего товаров: {len(stocks)}")
                print(f"   Общее количество: {total_quantity} шт.")
                print(f"   В пути к клиенту: {total_in_way} шт.")
                print()
                
                return stocks
            else:
                print("⚠️  Остатков нет")
                return []
                
        elif response.status_code == 401:
            print("❌ ОШИБКА 401: Неверный API ключ!")
            print(f"   Ответ: {response.text}")
            
        elif response.status_code == 403:
            print("❌ ОШИБКА 403: Нет доступа!")
            print("   Проверьте что у ключа есть права на 'Статистику'")
            print(f"   Ответ: {response.text}")
            
        elif response.status_code == 429:
            print("❌ ОШИБКА 429: Превышен лимит запросов!")
            print("   Подождите 1-2 минуты и попробуйте снова")
            print(f"   Ответ: {response.text}")
            
        else:
            print(f"❌ ОШИБКА {response.status_code}")
            print(f"   Ответ: {response.text}")
            
    except requests.exceptions.ConnectionError as e:
        print("❌ ОШИБКА СОЕДИНЕНИЯ")
        print(f"   Детали: {e}")
        print()
        print("   Возможные причины:")
        print("   1. Нет интернета")
        print("   2. Firewall блокирует")
        print("   3. WB API временно недоступен")
        
    except requests.exceptions.Timeout:
        print("❌ ОШИБКА: Превышено время ожидания (30 сек)")
        
    except Exception as e:
        print(f"❌ НЕОЖИДАННАЯ ОШИБКА: {e}")


def get_sales():
    """Получение продаж (бонус)"""
    
    print()
    print("=" * 60)
    print("📊 ЗАПРОС ПРОДАЖ С WB API")
    print("=" * 60)
    print()
    
    if API_KEY == "YOUR_API_KEY_HERE":
        print("❌ Замените YOUR_API_KEY на реальный ключ!")
        return
    
    # Дата с которой получаем данные (последние 30 дней)
    date_from = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
    
    url = "https://statistics-api.wildberries.ru/api/v1/supplier/sales"
    
    print(f"🔗 URL: {url}")
    print(f"📅 Дата от: {date_from}")
    print()
    
    try:
        print("⏳ Отправка запроса...")
        
        response = requests.get(
            url,
            headers=HEADERS,
            params={"dateFrom": date_from},
            timeout=30
        )
        
        print(f"📡 Статус: {response.status_code}")
        print()
        
        if response.status_code == 200:
            sales = response.json()
            
            print(f"✅ УСПЕХ! Получено продаж: {len(sales)}")
            print()
            
            if len(sales) > 0:
                # Общая выручка
                total_revenue = sum(s.get('retailPriceWithDiscRub', 0) for s in sales)
                
                print(f"💰 Общая выручка: {total_revenue:,.2f} ₽")
                print()
                
                # Первые 3 продажи
                print("📋 ПЕРВЫЕ 3 ПРОДАЖИ:")
                print()
                
                for i, sale in enumerate(sales[:3]):
                    print(f"{i+1}. Артикул: {sale.get('barcode', 'N/A')}")
                    print(f"   Дата: {sale.get('date', 'N/A')}")
                    print(f"   Цена: {sale.get('retailPriceWithDiscRub', 0):,.2f} ₽")
                    print(f"   Статус: {'Продано' if not sale.get('isCancel') and not sale.get('isReturn') else 'Возврат/Отмена'}")
                    print()
                
                return sales
            else:
                print("⚠️  Продаж нет за выбранный период")
                return []
                
        elif response.status_code == 429:
            print("❌ ОШИБКА 429: Превышен лимит запросов!")
            print("   Подождите 1-2 минуты")
            
        else:
            print(f"❌ ОШИБКА {response.status_code}")
            print(f"   Ответ: {response.text}")
            
    except Exception as e:
        print(f"❌ ОШИБКА: {e}")


if __name__ == "__main__":
    print()
    print("🚀 ТЕСТ WB API В PYCHARM")
    print()
    
    # Запрос остатков
    stocks = get_stocks()
    
    # Запрос продаж (через 2 секунды чтобы не было 429)
    import time
    time.sleep(2)
    
    sales = get_sales()
    
    print()
    print("=" * 60)
    print("🏁 ТЕСТ ЗАВЕРШЁН")
    print("=" * 60)
    print()
    
    if stocks and sales:
        print("✅ ОБА ЗАПРОСА УСПЕШНЫ!")
        print()
        print("🎉 WB API работает с вашего компьютера!")
        print()
        print("💡 Это значит что:")
        print("   • API ключ правильный")
        print("   • У ключа есть нужные права")
        print("   • Ваш IP не заблокирован")
        print()
        print("🚀 Теперь можно использовать эти URL в проекте!")
    elif stocks or sales:
        print("⚠️  ЧАСТИЧНЫЙ УСПЕХ")
        print()
        print(f"   Остатки: {'✅' if stocks else '❌'}")
        print(f"   Продажи: {'✅' if sales else '❌'}")
    else:
        print("❌ ОБА ЗАПРОСА ПРОВАЛИЛИСЬ")
        print()
        print("   Проверьте:")
        print("   • API ключ")
        print("   • Права доступа")
        print("   • Интернет-соединение")
    
    print()
