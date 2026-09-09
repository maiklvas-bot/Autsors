#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.."
read -r -p 'Email существующего администратора: ' email
read -r -s -p 'Новый PIN (4–12 цифр): ' pin; echo
[[ "$pin" =~ ^[0-9]{4,12}$ ]] || exit 1
read -r -s -p 'Повторите PIN: ' again; echo
[[ "$pin" == "$again" ]] || exit 1
trap 'unset pin again' EXIT
printf '%s\n%s\n' "$email" "$pin" | docker compose exec -T app node --input-type=module -e 'import fs from "node:fs";import{spawnSync}from"node:child_process";const[email,pin]=fs.readFileSync(0,"utf8").trim().split("\n");const r=spawnSync(process.execPath,["deploy/admin.mjs"],{input:JSON.stringify({email,pin}),stdio:["pipe","inherit","inherit"]});process.exit(r.status??1);'
