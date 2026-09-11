#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Универсальный тест WB API - проверяет ВСЕ возможные URL
"""

import requests
import json
from datetime import datetime, timedelta

# ВАШ API КЛЮЧ
API_KEY = "YOUR_API_KEY_HERE"

# ВСЕ возможные базовые URL для WB API
BASE_URLS = [
    "https://statistics-api.wildberries.ru",
    "https://marketplace-api.wildberries.ru",
    "https://seller-analytics-api.wildberries.ru",
    "https://common-api.wildberries.ru",
    "https://content-api.wildberries.ru",
    "https://suppliers-api.wildberries.ru",
]

# Эндпоинты для тестирования
ENDPOINTS = {
    "sales": [
        "/api/v1/supplier/sales",
        "/api/v2/supplier/sales",
        "/api/v3/supplier/sales",
        "/api/v5/supplier/reportDetailByPeriod",
    ],
    "stocks": [
        "/api/v1/supplier/stocks",
        "/api/v2/supplier/stocks",
        "/api/v3/supplier/stocks",
    ],
    "orders": [
        "/api/v3/orders/new",
        "/api/v3/orders",
        "/api/v1/supplier/orders",
    ],
}

headers = {"Authorization": API_KEY}

def test_url(base_url, endpoint, params=None):
    """Тест одного URL"""
    url = f"{base_url}{endpoint}"
    
    try:
        response = requests.get(url, headers=headers, params=params, timeout=10)
        
        if response.status_code == 200:
            try:
                data = response.json()
                count = len(data) if isinstance(data, list) else "N/A"
                return {
                    "status": "✅ SUCCESS",
                    "code": 200,
                    "count": count,
                    "url": url
                }
            except:
                return {
                    "status": "✅ OK (не JSON)",
                    "code": 200,
                    "count": "N/A",
                    "url": url
                }
        elif response.status_code == 401:
            return {"status": "❌ 401 Неверный ключ", "code": 401, "url": url}
        elif response.status_code == 403:
            return {"status": "❌ 403 Нет доступа", "code": 403, "url": url}
        elif response.status_code == 404:
            return {"status": "⚠️  404 Не найден", "code": 404, "url": url}
        elif response.status_code == 429:
            return {"status": "⚠️  429 Лимит", "code": 429, "url": url}
        else:
            return {"status": f"❌ {response.status_code}", "code": response.status_code, "url": url}
            
    except requests.exceptions.ConnectionError:
        return {"status": "❌ Connection Error", "code": 0, "url": url}
    except requests.exceptions.Timeout:
        return {"status": "❌ Timeout", "code": 0, "url": url}
    except Exception as e:
        return {"status": f"❌ Error: {e}", "code": 0, "url": url}


def main():
    print("=" * 70)
    print("🔍 УНИВЕРСАЛЬНЫЙ ТЕСТ WB API")
    print("=" * 70)
    print()
    
    if API_KEY == "YOUR_API_KEY_HERE":
        print("❌ Замените YOUR_API_KEY на реальный ключ!")
        return
    
    print(f"🔑 API ключ: {API_KEY[:20]}...")
    print(f"📅 Дата: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Дата для параметров
    date_from = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
    
    # Тестируем ВСЕ комбинации
    results = []
    
    for category, endpoints in ENDPOINTS.items():
        print(f"\n{'='*70}")
        print(f"📊 КАТЕГОРИЯ: {category.upper()}")
        print(f"{'='*70}")
        
        for base_url in BASE_URLS:
            for endpoint in endpoints:
                params = {"dateFrom": date_from} if "sales" in endpoint or "stocks" in endpoint else None
                
                result = test_url(base_url, endpoint, params)
                results.append({
                    "category": category,
                    "base_url": base_url,
                    "endpoint": endpoint,
                    **result
                })
                
                # Выводим результат
                status_icon = "✅" if result["code"] == 200 else "❌" if result["code"] in [401, 403] else "⚠️"
                print(f"{status_icon} {base_url[:40]:40} | {endpoint:40} | {result['status']}")
    
    # Итоговый отчёт
    print(f"\n\n{'='*70}")
    print("📋 ИТОГОВЫЙ ОТЧЁТ")
    print(f"{'='*70}\n")
    
    # Находим успешные URL
    success = [r for r in results if r["code"] == 200]
    auth_errors = [r for r in results if r["code"] == 401]
    forbidden = [r for r in results if r["code"] == 403]
    not_found = [r for r in results if r["code"] == 404]
    rate_limited = [r for r in results if r["code"] == 429]
    connection_errors = [r for r in results if r["code"] == 0]
    
    print(f"✅ Успешных запросов: {len(success)}")
    print(f"❌ Ошибки авторизации (401): {len(auth_errors)}")
    print(f"❌ Доступ запрещён (403): {len(forbidden)}")
    print(f"⚠️  Не найдено (404): {len(not_found)}")
    print(f"⚠️  Превышен лимит (429): {len(rate_limited)}")
    print(f"❌ Ошибки соединения: {len(connection_errors)}")
    
    if success:
        print(f"\n🎉 РАБОЧИЕ URL:\n")
        for r in success:
            print(f"   ✅ {r['url']}")
            print(f"      Записей: {r['count']}")
            print()
    
    if auth_errors and not success:
        print(f"\n⚠️  ВСЕ ЗАПРОСЫ ВОЗВРАЩАЮТ 401")
        print(f"   Возможно API ключ неверный или устарел")
    
    if connection_errors and not success:
        print(f"\n❌ ВСЕ ЗАПРОСЫ ВОЗВРАЩАЮТ CONNECTION ERROR")
        print(f"   Возможно WB блокирует все IP или есть проблемы с сетью")
        print(f"   Попробуйте:")
        print(f"   • Проверить интернет")
        print(f"   • Отключить VPN")
        print(f"   • Проверить firewall")
        print(f"   • Попробовать с другого устройства")
    
    print(f"\n{'='*70}")


if __name__ == "__main__":
    main()
