CREATE TABLE `_branch_catalog_v4` (`id` text PRIMARY KEY NOT NULL, `name` text NOT NULL, `city` text NOT NULL);
--> statement-breakpoint
INSERT INTO `_branch_catalog_v4` (`id`,`name`,`city`) VALUES
('irbit-zhukov','Ирбит на Площади Жукова','Ирбит'),('b4','Тавда ТЦ Советский','Тавда'),('tob-pearl','Тобольск ТРЦ Жемчужина Сибири','Тобольск'),('tob-rio','Тобольск ТРЦ РИО','Тобольск'),('b1','Тобольск ТЦ Лента','Тобольск'),('b5','Туринск ТЦ ГлавныйПроспект','Туринск'),('tyumen-zarechny','Тюмень Заречный Гипер','Тюмень'),('tyumen-lenta','Тюмень Лента Тобольский тракт','Тюмень'),('tyumen-magellan','Тюмень МФК Магеллан','Тюмень'),('tyumen-pobedy','Тюмень на Победы ТП','Тюмень'),('tyumen-prof','Тюмень Окей на Профсоюзной ТП','Тюмень'),('tyumen-preob','Тюмень Преображенский','Тюмень'),('tyumen-goodwin','Тюмень ТРЦ Гудвин SMART','Тюмень'),('tyumen-columb','Тюмень ТРЦ Колумб','Тюмень'),('b6','Тюмень ТРЦ Кристалл','Тюмень'),('tyumen-matreshka','Тюмень ТРЦ Матрешка','Тюмень'),('tyumen-city','Тюмень ТРЦ Стар Сити Молл','Тюмень'),('tyumen-arsib','Тюмень ТЦ Арсиб Тауэр Гипер','Тюмень'),('tyumen-galaxy','Тюмень ТЦ Галактика','Тюмень'),('b2','Тюмень ТЦ Заречный двор ТП','Тюмень'),('b3','Тюмень ТЦ Остров','Тюмень'),('tyumen-hoz','Тюмень ТЦ ХозДвор Гипер','Тюмень'),('tyumen-tsum','Тюмень ТЦ ЦУМ SMART','Тюмень'),('tyumen-yamskaya','Тюмень Ямская Гипер','Тюмень');
--> statement-breakpoint
UPDATE records SET body=json_set(body,'$.branchName',COALESCE(json_extract(body,'$.branchName'),CASE json_extract(body,'$.branch') WHEN 'tyumen-panama' THEN 'Тюмень · ТРЦ Панама' WHEN 'tyumen-shirot' THEN 'Тюмень · Окей Широтная' ELSE (SELECT name FROM `_branch_catalog_v4` WHERE id=json_extract(records.body,'$.branch')) END)) WHERE kind='shifts';
--> statement-breakpoint
UPDATE records SET body=json_set(body,'$.status','cancelled','$.reason','Филиал исключён из актуального справочника') WHERE kind='shifts' AND json_extract(body,'$.branch') IN ('tyumen-panama','tyumen-shirot') AND json_extract(body,'$.status') IN ('planned','working','review');
--> statement-breakpoint
UPDATE records SET body=json_set(body,'$.active',json('false')) WHERE kind='employees' AND json_extract(body,'$.branch') IN ('tyumen-panama','tyumen-shirot');
--> statement-breakpoint
UPDATE records SET body=json_remove(json_set(body,'$.active',json('false')),'$.telegramId') WHERE kind='members' AND json_extract(body,'$.role')='employee' AND json_extract(body,'$.employeeId') IN (SELECT json_extract(body,'$.id') FROM records WHERE kind='employees' AND json_extract(body,'$.branch') IN ('tyumen-panama','tyumen-shirot'));
--> statement-breakpoint
UPDATE records SET body=json_set(body,'$.branches',json(COALESCE((SELECT json_group_array(value) FROM json_each(records.body,'$.branches') WHERE value NOT IN ('tyumen-panama','tyumen-shirot')),'[]'))) WHERE kind='members' AND json_extract(body,'$.role')='manager';
--> statement-breakpoint
UPDATE app_state SET body=json_set(body,'$.branches',json((SELECT json_group_array(json(CASE WHEN old.value IS NULL THEN json_object('id',catalog.id,'name',catalog.name,'city',catalog.city) ELSE json_set(old.value,'$.name',catalog.name,'$.city',catalog.city) END)) FROM `_branch_catalog_v4` AS catalog LEFT JOIN json_each(app_state.body,'$.branches') AS old ON json_extract(old.value,'$.id')=catalog.id)));
--> statement-breakpoint
INSERT OR IGNORE INTO records(key,kind,body) SELECT 'audit:catalog-2026-09-v4','audit','{"id":"catalog-2026-09-v4","at":"2026-09-09T12:00:00.000Z","actor":"Обновление системы","action":"Справочник филиалов актуализирован","detail":"24 филиала. Исключённые подразделения удалены из выбора; их сотрудники, смены и отчёты сохранены в истории."}' WHERE EXISTS(SELECT 1 FROM app_state WHERE id=1);
--> statement-breakpoint
UPDATE app_state SET version=version+1,body=json_set(body,'$.version',version+1) WHERE id=1;
--> statement-breakpoint
DROP TABLE `_branch_catalog_v4`;
