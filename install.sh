#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
umask 077
command -v docker >/dev/null || { echo 'Установите Docker Engine и Docker Compose plugin, затем повторите запуск.'; exit 1; }
docker compose version >/dev/null
if [[ -f .env ]]; then echo 'Установка уже настроена. Для обновления: docker compose up -d --build. Файл .env сохранён.'; exit 1; fi
read -r -p 'Домен без https:// (DNS должен указывать на этот сервер): ' domain
[[ "$domain" =~ ^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$ ]] || { echo 'Некорректный домен'; exit 1; }
read -r -p 'Email первого администратора: ' owner_email
[[ "$owner_email" =~ ^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$ ]] || exit 1
read -r -s -p 'PIN администратора (4–12 цифр): ' owner_pin; echo
[[ "$owner_pin" =~ ^[0-9]{4,12}$ ]] || { echo 'PIN должен содержать 4–12 цифр'; exit 1; }
read -r -s -p 'Повторите PIN: ' repeat_pin; echo
[[ "$owner_pin" == "$repeat_pin" ]] || { echo 'PIN не совпадают'; exit 1; }
read -r -s -p 'Токен Telegram-бота: ' bot_token; echo
[[ "$bot_token" =~ ^[0-9]+:[a-zA-Z0-9_-]+$ ]] || { echo 'Некорректный формат токена'; exit 1; }
command -v openssl >/dev/null || { echo 'Нужен openssl'; exit 1; }
webhook_secret=$(openssl rand -hex 32); reminder_secret=$(openssl rand -hex 32)
printf 'DOMAIN=%s\nPUBLIC_ORIGIN=https://%s\nTELEGRAM_BOT_TOKEN=%s\nTELEGRAM_WEBHOOK_SECRET=%s\nREMINDER_SECRET=%s\nTELEGRAM_BOT_USERNAME=HandyManRRS_bot\nSELF_HOSTED=true\nTELEGRAM_AUTO_CONNECT=true\n' "$domain" "$domain" "$bot_token" "$webhook_secret" "$reminder_secret" > .env
trap 'unset owner_pin repeat_pin bot_token webhook_secret reminder_secret' EXIT
docker compose build
# Encode stdin with Node in the image, without passing secrets as process arguments.
printf '%s\n%s\n' "$owner_email" "$owner_pin" | docker compose run --rm -T app node --input-type=module -e 'import fs from "node:fs";import{spawnSync}from"node:child_process";const[email,pin]=fs.readFileSync(0,"utf8").trim().split("\n");const r=spawnSync(process.execPath,["deploy/admin.mjs"],{input:JSON.stringify({email,pin}),stdio:["pipe","inherit","inherit"]});process.exit(r.status??1);'
unset owner_pin repeat_pin
echo 'Подключение токена перенесёт этого бота на указанный домен.'
docker compose up -d --wait --wait-timeout 180
docker compose exec -T app node -e "fetch('http://127.0.0.1:3000/api/telegram').then(r=>{if(!r.ok)process.exit(1)})"
echo "Сайт запущен: https://$domain"
echo 'HTTPS и бот требуют доступного домена и портов 80/443. Проверьте подключение в разделе Telegram-бот.'
