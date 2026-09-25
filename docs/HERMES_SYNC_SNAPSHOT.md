# Hermes ↔ GitHub ↔ Obsidian snapshot — 2026-09-25

## Назначение

Выборочный проверенный снимок проектного контекста Hermes. Он фиксирует безопасные долговечные знания и состояние синхронизации, но не заменяет исходный код, первичные документы, CI или рабочие данные.

## Provenance

- Репозиторий: `D:/MyProject/Autsors`
- GitHub: `https://github.com/maiklvas-bot/Autsors.git`
- Интеграционная ветка: `develop`
- Подготовленная рабочая ветка: `feature/hermes-knowledge-sync`
- База рабочей ветки: `origin/develop` at `997900d`
- Obsidian: `D:/MyProject/Obsidian/Pedro78`
- Obsidian note: `01-projects/autsors/README.md`

## Подготовленные изменения Autsors

Рабочая ветка собрана в отдельном worktree от актуальной `origin/develop`, поэтому исходный смешанный checkout не перезаписывался.

- `d9b1116` — улучшенная навигация, временный единый brand mark и мобильные карточки смен; конфликт с более свежей логикой подтверждения часов разрешён в пользу `shiftReviewReady`.
- `c71d572` — правила маршрутизации coding agents и CI.
- `909b1b4` — явный loopback-only local preview: HTTP разрешён только для `127.0.0.1`/`localhost` при `LOCAL_PREVIEW=true`; production cookie остаётся `Secure`, локальный cookie получает отдельное имя; восстановление PIN владельца доступно только в этом ограниченном режиме.
- Текущий документ и уточнённая CX Forge policy входят в следующий локальный docs commit.

## Проверка

- `npm test`: **56 tests passed**.
- Сборка `vinext build`: **passed** в составе `npm test`.
- `git diff --check`: **passed** для code stage.
- `npm run lint`: **failed** — в текущей базе 74 errors и 18 warnings, включая ранее существующие `no-explicit-any`, React hooks и `<img>` diagnostics. Поэтому lint и CI зелёными не объявляются.
- GitHub Actions для рабочей ветки ещё не запускался.

## Связанные Hermes-проекты

На момент снимка read-back удалённых refs подтверждает:

- Claude Jarvis: `origin/feat/vault-sync` → `65f9a0684f2ee26e62b8f35ca93ca879fbd78a2a`.
- Hermes DNS RRS Tumen: `master` и `feature/rrs-news-balance-numbering-callback` → `121eb08564a94ec431432a6712c0e082df05ad7b`.
- DNS SimCenter: `feature/methodology-v2` → `aa82156380acafa8367b821c3f9ae22f6759ba8b`; knowledge branch `chore/hermes-knowledge-sync` → `9328bbd498903ba99d91e23b84aebd2ded4c0198`.

Канонические подробности остаются в соответствующих репозиториях и Obsidian-папках проектов.

## Границы безопасности

Не переносятся secrets, `.env`, токены, локальные базы, фотографии, raw XLSX/SQLite, runtime state, полные логи и персональные данные. `IDEA.md` и исходный dirty checkout Autsors не включены автоматически. Публикация ветки, PR, merge и deploy требуют отдельного разрешения владельца.

## Статус публикации

Первичный project snapshot опубликован в commit `d7df45a0ed9127585deeeeb65e2f9e5d3da55f26` на remote-ветке `feature/hermes-knowledge-sync`. Открыт PR #7 в `main`. Два GitHub Actions run для этого commit завершились успешно: `npm ci`, `npm test` и Docker build прошли на `ubuntu-latest`.

Этот metadata update следует после project snapshot, поэтому его собственный HEAD и CI проверяются отдельно и не подменяют provenance commit `d7df45a`.
