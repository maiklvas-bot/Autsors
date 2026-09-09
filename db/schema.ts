import {sqliteTable,text,integer} from 'drizzle-orm/sqlite-core';
export const store=sqliteTable('app_state',{id:integer('id').primaryKey(),body:text('body').notNull(),version:integer('version').notNull().default(0)});
export const invitations=sqliteTable('invitations',{code:text('code').primaryKey(),memberId:text('member_id').notNull(),expires:integer('expires').notNull(),used:integer('used').notNull().default(0)});
export const telegramUpdates=sqliteTable('telegram_updates',{id:integer('id').primaryKey(),at:integer('at').notNull()});
export const botSessions=sqliteTable('bot_sessions',{id:text('id').primaryKey(),body:text('body').notNull()});
export const records=sqliteTable('records',{key:text('key').primaryKey(),kind:text('kind').notNull(),body:text('body').notNull()});
export const credentials=sqliteTable('credentials',{userId:text('user_id').primaryKey(),passwordHash:text('password_hash').notNull(),mustChange:integer('must_change').notNull().default(1),version:integer('version').notNull().default(1),tempExpires:integer('temp_expires'),changedAt:integer('changed_at').notNull()});
export const sessions=sqliteTable('sessions',{tokenHash:text('token_hash').primaryKey(),userId:text('user_id').notNull(),credentialVersion:integer('credential_version').notNull(),expires:integer('expires').notNull(),lastSeen:integer('last_seen').notNull()});
export const authAttempts=sqliteTable('auth_attempts',{key:text('key').primaryKey(),count:integer('count').notNull(),until:integer('until').notNull()});
