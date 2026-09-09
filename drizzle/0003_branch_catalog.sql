UPDATE app_state SET body=json_set(body,'$.branches',json((SELECT json_group_array(json(CASE WHEN json_extract(value,'$.id')='b1' AND json_extract(value,'$.city') IS NULL THEN json_set(value,'$.city','Тобольск') ELSE value END)) FROM json_each(body,'$.branches'))));
--> statement-breakpoint
UPDATE app_state SET body=json_set(body,'$.branches',json((SELECT json_group_array(json(CASE WHEN json_extract(value,'$.id')='b2' AND json_extract(value,'$.city') IS NULL THEN json_set(value,'$.city','Тюмень') ELSE value END)) FROM json_each(body,'$.branches'))));
--> statement-breakpoint
UPDATE app_state SET body=json_set(body,'$.branches',json((SELECT json_group_array(json(CASE WHEN json_extract(value,'$.id')='b3' AND json_extract(value,'$.city') IS NULL THEN json_set(value,'$.city','Тюмень') ELSE value END)) FROM json_each(body,'$.branches'))));
--> statement-breakpoint
UPDATE app_state SET body=json_set(body,'$.branches',json((SELECT json_group_array(json(CASE WHEN json_extract(value,'$.id')='b4' AND json_extract(value,'$.city') IS NULL THEN json_set(value,'$.city','Тавда') ELSE value END)) FROM json_each(body,'$.branches'))));
--> statement-breakpoint
UPDATE app_state SET body=json_set(body,'$.branches',json((SELECT json_group_array(json(CASE WHEN json_extract(value,'$.id')='b5' AND json_extract(value,'$.city') IS NULL THEN json_set(value,'$.city','Туринск') ELSE value END)) FROM json_each(body,'$.branches'))));
--> statement-breakpoint
UPDATE app_state SET body=json_set(body,'$.branches',json((SELECT json_group_array(json(CASE WHEN json_extract(value,'$.id')='b6' AND json_extract(value,'$.city') IS NULL THEN json_set(value,'$.city','Тюмень') ELSE value END)) FROM json_each(body,'$.branches'))));
--> statement-breakpoint
UPDATE app_state SET body=json_insert(body,'$.branches[#]',json('{"id": "tyumen-pobedy", "name": "Тюмень · На Победы ТП", "city": "Тюмень"}')) WHERE NOT EXISTS(SELECT 1 FROM json_each(body,'$.branches') WHERE json_extract(value,'$.id')='tyumen-pobedy' OR json_extract(value,'$.name')='Тюмень · На Победы ТП');
--> statement-breakpoint
UPDATE app_state SET body=json_insert(body,'$.branches[#]',json('{"id": "tyumen-prof", "name": "Тюмень · Окей Профсоюзная ТП", "city": "Тюмень"}')) WHERE NOT EXISTS(SELECT 1 FROM json_each(body,'$.branches') WHERE json_extract(value,'$.id')='tyumen-prof' OR json_extract(value,'$.name')='Тюмень · Окей Профсоюзная ТП');
--> statement-breakpoint
UPDATE app_state SET body=json_insert(body,'$.branches[#]',json('{"id": "tyumen-city", "name": "Тюмень · ТРЦ Стар Сити Молл", "city": "Тюмень"}')) WHERE NOT EXISTS(SELECT 1 FROM json_each(body,'$.branches') WHERE json_extract(value,'$.id')='tyumen-city' OR json_extract(value,'$.name')='Тюмень · ТРЦ Стар Сити Молл');
--> statement-breakpoint
UPDATE app_state SET body=json_insert(body,'$.branches[#]',json('{"id": "tyumen-panama", "name": "Тюмень · ТРЦ Панама", "city": "Тюмень"}')) WHERE NOT EXISTS(SELECT 1 FROM json_each(body,'$.branches') WHERE json_extract(value,'$.id')='tyumen-panama' OR json_extract(value,'$.name')='Тюмень · ТРЦ Панама');
--> statement-breakpoint
UPDATE app_state SET body=json_insert(body,'$.branches[#]',json('{"id": "tyumen-goodwin", "name": "Тюмень · ТРЦ Гудвин", "city": "Тюмень"}')) WHERE NOT EXISTS(SELECT 1 FROM json_each(body,'$.branches') WHERE json_extract(value,'$.id')='tyumen-goodwin' OR json_extract(value,'$.name')='Тюмень · ТРЦ Гудвин');
--> statement-breakpoint
UPDATE app_state SET body=json_insert(body,'$.branches[#]',json('{"id": "tyumen-columb", "name": "Тюмень · ТРЦ Колумб", "city": "Тюмень"}')) WHERE NOT EXISTS(SELECT 1 FROM json_each(body,'$.branches') WHERE json_extract(value,'$.id')='tyumen-columb' OR json_extract(value,'$.name')='Тюмень · ТРЦ Колумб');
--> statement-breakpoint
UPDATE app_state SET body=json_insert(body,'$.branches[#]',json('{"id": "tyumen-lenta", "name": "Тюмень · Лента Тобольский тракт", "city": "Тюмень"}')) WHERE NOT EXISTS(SELECT 1 FROM json_each(body,'$.branches') WHERE json_extract(value,'$.id')='tyumen-lenta' OR json_extract(value,'$.name')='Тюмень · Лента Тобольский тракт');
--> statement-breakpoint
UPDATE app_state SET body=json_insert(body,'$.branches[#]',json('{"id": "tyumen-zarechny", "name": "Тюмень · Заречный Гипер", "city": "Тюмень"}')) WHERE NOT EXISTS(SELECT 1 FROM json_each(body,'$.branches') WHERE json_extract(value,'$.id')='tyumen-zarechny' OR json_extract(value,'$.name')='Тюмень · Заречный Гипер');
--> statement-breakpoint
UPDATE app_state SET body=json_insert(body,'$.branches[#]',json('{"id": "tyumen-arsib", "name": "Тюмень · ТЦ Арсиб Тауэр Гипер", "city": "Тюмень"}')) WHERE NOT EXISTS(SELECT 1 FROM json_each(body,'$.branches') WHERE json_extract(value,'$.id')='tyumen-arsib' OR json_extract(value,'$.name')='Тюмень · ТЦ Арсиб Тауэр Гипер');
--> statement-breakpoint
UPDATE app_state SET body=json_insert(body,'$.branches[#]',json('{"id": "tyumen-hoz", "name": "Тюмень · ТЦ ХозДвор Гипер", "city": "Тюмень"}')) WHERE NOT EXISTS(SELECT 1 FROM json_each(body,'$.branches') WHERE json_extract(value,'$.id')='tyumen-hoz' OR json_extract(value,'$.name')='Тюмень · ТЦ ХозДвор Гипер');
--> statement-breakpoint
UPDATE app_state SET body=json_insert(body,'$.branches[#]',json('{"id": "tyumen-matreshka", "name": "Тюмень · ТРЦ Матрешка", "city": "Тюмень"}')) WHERE NOT EXISTS(SELECT 1 FROM json_each(body,'$.branches') WHERE json_extract(value,'$.id')='tyumen-matreshka' OR json_extract(value,'$.name')='Тюмень · ТРЦ Матрешка');
--> statement-breakpoint
UPDATE app_state SET body=json_insert(body,'$.branches[#]',json('{"id": "tyumen-magellan", "name": "Тюмень · МФК Магеллан", "city": "Тюмень"}')) WHERE NOT EXISTS(SELECT 1 FROM json_each(body,'$.branches') WHERE json_extract(value,'$.id')='tyumen-magellan' OR json_extract(value,'$.name')='Тюмень · МФК Магеллан');
--> statement-breakpoint
UPDATE app_state SET body=json_insert(body,'$.branches[#]',json('{"id": "tyumen-preob", "name": "Тюмень · Преображенский", "city": "Тюмень"}')) WHERE NOT EXISTS(SELECT 1 FROM json_each(body,'$.branches') WHERE json_extract(value,'$.id')='tyumen-preob' OR json_extract(value,'$.name')='Тюмень · Преображенский');
--> statement-breakpoint
UPDATE app_state SET body=json_insert(body,'$.branches[#]',json('{"id": "tyumen-tsum", "name": "Тюмень · ЦУМ", "city": "Тюмень"}')) WHERE NOT EXISTS(SELECT 1 FROM json_each(body,'$.branches') WHERE json_extract(value,'$.id')='tyumen-tsum' OR json_extract(value,'$.name')='Тюмень · ЦУМ');
--> statement-breakpoint
UPDATE app_state SET body=json_insert(body,'$.branches[#]',json('{"id": "tyumen-galaxy", "name": "Тюмень · Галактика", "city": "Тюмень"}')) WHERE NOT EXISTS(SELECT 1 FROM json_each(body,'$.branches') WHERE json_extract(value,'$.id')='tyumen-galaxy' OR json_extract(value,'$.name')='Тюмень · Галактика');
--> statement-breakpoint
UPDATE app_state SET body=json_insert(body,'$.branches[#]',json('{"id": "tyumen-yamskaya", "name": "Тюмень · Ямская", "city": "Тюмень"}')) WHERE NOT EXISTS(SELECT 1 FROM json_each(body,'$.branches') WHERE json_extract(value,'$.id')='tyumen-yamskaya' OR json_extract(value,'$.name')='Тюмень · Ямская');
--> statement-breakpoint
UPDATE app_state SET body=json_insert(body,'$.branches[#]',json('{"id": "tyumen-shirot", "name": "Тюмень · Окей Широтная", "city": "Тюмень"}')) WHERE NOT EXISTS(SELECT 1 FROM json_each(body,'$.branches') WHERE json_extract(value,'$.id')='tyumen-shirot' OR json_extract(value,'$.name')='Тюмень · Окей Широтная');
--> statement-breakpoint
UPDATE app_state SET body=json_insert(body,'$.branches[#]',json('{"id": "tob-pearl", "name": "Тобольск · Жемчужина Сибири", "city": "Тобольск"}')) WHERE NOT EXISTS(SELECT 1 FROM json_each(body,'$.branches') WHERE json_extract(value,'$.id')='tob-pearl' OR json_extract(value,'$.name')='Тобольск · Жемчужина Сибири');
--> statement-breakpoint
UPDATE app_state SET body=json_insert(body,'$.branches[#]',json('{"id": "tob-rio", "name": "Тобольск · ТРЦ РИО", "city": "Тобольск"}')) WHERE NOT EXISTS(SELECT 1 FROM json_each(body,'$.branches') WHERE json_extract(value,'$.id')='tob-rio' OR json_extract(value,'$.name')='Тобольск · ТРЦ РИО');
--> statement-breakpoint
UPDATE app_state SET body=json_insert(body,'$.branches[#]',json('{"id": "irbit-zhukov", "name": "Ирбит · На Площади Жукова", "city": "Ирбит"}')) WHERE NOT EXISTS(SELECT 1 FROM json_each(body,'$.branches') WHERE json_extract(value,'$.id')='irbit-zhukov' OR json_extract(value,'$.name')='Ирбит · На Площади Жукова');
--> statement-breakpoint
INSERT OR IGNORE INTO records(key,kind,body) SELECT 'audit:catalog-2026-09','audit','{"id": "catalog-2026-09", "at": "2026-09-09T00:00:00.000Z", "actor": "Обновление системы", "action": "Справочник филиалов расширен", "detail": "26 филиалов из материалов РРС. Ранее созданные записи и привязки сохранены; рабочие часы задают управляющие."}' WHERE EXISTS(SELECT 1 FROM app_state WHERE id=1);
--> statement-breakpoint
UPDATE app_state SET version=version+1,body=json_set(body,'$.version',version+1) WHERE id=1;
