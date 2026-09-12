#!/bin/bash

# Скрипт автоматического развертывания WB Analytics на Timeweb Cloud
# Использование: bash scripts/deploy-timeweb.sh

set -e  # Остановить при ошибке

echo "🚀 Начало развертывания WB Analytics на Timeweb Cloud"
echo "======================================================"
echo ""

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Проверка аргументов
if [ -z "$1" ]; then
    echo -e "${RED}❌ Ошибка: Укажите IP адрес сервера${NC}"
    echo "Использование: bash scripts/deploy-timeweb.sh <IP_адрес>"
    echo "Пример: bash scripts/deploy-timeweb.sh 185.12.94.123"
    exit 1
fi

SERVER_IP=$1
SERVER_USER="deploy"
PROJECT_NAME="wb-analytics"
PROJECT_DIR="/home/${SERVER_USER}/${PROJECT_NAME}"

echo -e "${YELLOW}📋 Конфигурация:${NC}"
echo "  Сервер: ${SERVER_IP}"
echo "  Пользователь: ${SERVER_USER}"
echo "  Проект: ${PROJECT_NAME}"
echo "  Директория: ${PROJECT_DIR}"
echo ""

# Шаг 1: Проверка подключения
echo -e "${YELLOW}🔍 Шаг 1: Проверка подключения к серверу...${NC}"
if ssh -o ConnectTimeout=5 -o BatchMode=yes ${SERVER_USER}@${SERVER_IP} "echo 'OK'" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Подключение успешно${NC}"
else
    echo -e "${RED}❌ Не удалось подключиться к серверу${NC}"
    echo "Убедитесь, что:"
    echo "  1. SSH ключ добавлен на сервер"
    echo "  2. Сервер доступен по IP ${SERVER_IP}"
    echo "  3. Пользователь ${SERVER_USER} существует"
    exit 1
fi
echo ""

# Шаг 2: Создание директории проекта
echo -e "${YELLOW}📁 Шаг 2: Создание директории проекта...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} "mkdir -p ${PROJECT_DIR}"
echo -e "${GREEN}✅ Директория создана${NC}"
echo ""

# Шаг 3: Синхронизация файлов
echo -e "${YELLOW}📦 Шаг 3: Синхронизация файлов...${NC}"
rsync -avz --exclude='node_modules' --exclude='.env' --exclude='dist' --exclude='.git' \
    ./ ${SERVER_USER}@${SERVER_IP}:${PROJECT_DIR}/
echo -e "${GREEN}✅ Файлы синхронизированы${NC}"
echo ""

# Шаг 4: Установка зависимостей
echo -e "${YELLOW}📥 Шаг 4: Установка зависимостей...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} "cd ${PROJECT_DIR} && npm install --production"
echo -e "${GREEN}✅ Зависимости установлены${NC}"
echo ""

# Шаг 5: Сборка frontend
echo -e "${YELLOW}🔨 Шаг 5: Сборка frontend...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} "cd ${PROJECT_DIR} && npm run build"
echo -e "${GREEN}✅ Frontend собран${NC}"
echo ""

# Шаг 6: Инициализация базы данных
echo -e "${YELLOW}🗄️  Шаг 6: Инициализация базы данных...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} "cd ${PROJECT_DIR} && npm run db:init"
echo -e "${GREEN}✅ База данных инициализирована${NC}"
echo ""

# Шаг 7: Настройка PM2
echo -e "${YELLOW}⚙️  Шаг 7: Настройка PM2...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} "cd ${PROJECT_DIR} && pm2 delete ${PROJECT_NAME} || true"
ssh ${SERVER_USER}@${SERVER_IP} "cd ${PROJECT_DIR} && pm2 start ecosystem.config.js"
ssh ${SERVER_USER}@${SERVER_IP} "pm2 save"
echo -e "${GREEN}✅ PM2 настроен${NC}"
echo ""

# Шаг 8: Перезапуск Nginx
echo -e "${YELLOW}🌐 Шаг 8: Перезапуск Nginx...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} "sudo systemctl restart nginx"
echo -e "${GREEN}✅ Nginx перезапущен${NC}"
echo ""

# Шаг 9: Проверка статуса
echo -e "${YELLOW}🔍 Шаг 9: Проверка статуса...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} "pm2 status"
echo ""

# Шаг 10: Проверка здоровья
echo -e "${YELLOW}🏥 Шаг 10: Проверка здоровья API...${NC}"
HEALTH_CHECK=$(ssh ${SERVER_USER}@${SERVER_IP} "curl -s http://localhost:4000/api/health || echo 'FAILED'")
if [[ "$HEALTH_CHECK" == *"ok"* ]]; then
    echo -e "${GREEN}✅ API работает корректно${NC}"
else
    echo -e "${RED}⚠️  API не отвечает. Проверьте логи: pm2 logs ${PROJECT_NAME}${NC}"
fi
echo ""

echo "======================================================"
echo -e "${GREEN}✅ Развертывание завершено!${NC}"
echo ""
echo "📊 Ваш сайт доступен по адресу:"
echo "   http://${SERVER_IP}"
echo ""
echo "📝 Полезные команды:"
echo "   Логи:           ssh ${SERVER_USER}@${SERVER_IP} 'pm2 logs ${PROJECT_NAME}'"
echo "   Статус:         ssh ${SERVER_USER}@${SERVER_IP} 'pm2 status'"
echo "   Перезапуск:     ssh ${SERVER_USER}@${SERVER_IP} 'pm2 restart ${PROJECT_NAME}'"
echo "   Остановка:      ssh ${SERVER_USER}@${SERVER_IP} 'pm2 stop ${PROJECT_NAME}'"
echo ""
echo "🔧 Следующие шаги:"
echo "   1. Настройте .env файл на сервере:"
echo "      ssh ${SERVER_USER}@${SERVER_IP} 'nano ${PROJECT_DIR}/.env'"
echo "   2. Перезапустите приложение:"
echo "      ssh ${SERVER_USER}@${SERVER_IP} 'pm2 restart ${PROJECT_NAME}'"
echo ""
