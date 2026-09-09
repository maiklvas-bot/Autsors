// Exercise the deployed bundle and its real request/cookie context, not auth mocks.
import test from 'node:test';import assert from 'node:assert/strict';import {DatabaseSync} from 'node:sqlite';import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';import {registerHooks} from 'node:module';
const sql=new DatabaseSync(':memory:');for(const f of fs.readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort())sql.exec(fs.readFileSync('drizzle/'+f,'utf8'));
class Statement{constructor(q,p=[]){this.q=q;this.p=p;}bind(...p){return new Statement(this.q,p);}async first(){return sql.prepare(this.q).get(...this.p)||null;}async all(){return {results:sql.prepare(this.q).all(...this.p),meta:{changes:0}};}async run(){return {meta:{changes:Number(sql.prepare(this.q).run(...this.p).changes)}};}}
globalThis.__env={DB:{prepare:q=>new Statement(q),batch:async stmts=>{sql.exec('BEGIN');try{const a=[];for(const s of stmts)a.push(await s.run());sql.exec('COMMIT');return a;}catch(e){sql.exec('ROLLBACK');throw e;}}}};

registerHooks({resolve(specifier,context,next){if(specifier==='cloudflare:workers')return {url:'data:text/javascript,export const env=globalThis.__env',shortCircuit:true};return next(specifier,context);}});
const worker=(await import(pathToFileURL(path.resolve(process.env.TEST_WORKER||'dist/server/index.js')).href)).default;
const ctx={waitUntil(){},passThroughOnException(){}};
let cookie='';
async function call(route,body,verified=false){const headers={origin:'https://app.test','Content-Type':'application/json',cookie};if(verified){headers['oai-authenticated-user-email']='maiklvas@gmail.com';headers['oai-authenticated-user-name']='Test owner';}const response=await worker.fetch(new Request('https://app.test'+route,{method:body?'POST':'GET',headers,...(body?{body:JSON.stringify(body)}:{})}),globalThis.__env,ctx);if(response.headers.get('set-cookie'))cookie=response.headers.get('set-cookie').split(';')[0];return {status:response.status,body:await response.json()};}
test('built worker: login, state, repeated requests, logout and login again',async()=>{
let r=await call('/api/auth',{action:'setup',password:process.env.LEGACY_TEST?'Test owner password 987':'038492'},true);assert.equal(r.status,200,JSON.stringify(r.body));
r=await call('/api/auth');assert.equal(r.body.authenticated,true);
for(let i=0;i<3;i++){r=await call('/api/state');assert.equal(r.status,200,JSON.stringify(r.body));assert.equal(r.body.user.role,'admin');assert.deepEqual(r.body.user.branches,[]);}
r=await call('/api/auth',{action:'logout'});assert.equal(r.status,200);
r=await call('/api/state');assert.equal(r.status,401);
r=await call('/api/auth',{action:'login',email:'maiklvas@gmail.com',password:'038492'});assert.equal(r.status,200,JSON.stringify(r.body));
r=await call('/api/state');assert.equal(r.status,200,JSON.stringify(r.body));
});

test('built worker: manager must replace temporary PIN and sees only assigned branch',async()=>{
let r=await call('/api/users',{type:'member',name:'Тестовый УМ',email:'manager@example.test',role:'manager',branches:['b1'],temporaryPassword:'0123'});assert.equal(r.status,200,JSON.stringify(r.body));
await call('/api/auth',{action:'logout'});
r=await call('/api/auth',{action:'login',email:'manager@example.test',password:'0123'});assert.equal(r.status,200);assert.equal(r.body.mustChange,true);
r=await call('/api/state');assert.equal(r.status,403);
r=await call('/api/auth');assert.equal(r.body.authenticated,true);assert.equal(r.body.mustChange,true);
r=await call('/api/auth',{action:'changePassword',currentPassword:'0123',newPassword:'0056'});assert.equal(r.status,200,JSON.stringify(r.body));
for(let i=0;i<3;i++){r=await call('/api/state');assert.equal(r.status,200,JSON.stringify(r.body));assert.equal(r.body.user.role,'manager');assert.deepEqual(r.body.state.branches.map(b=>b.id),['b1']);}
await call('/api/auth',{action:'logout'});
r=await call('/api/auth',{action:'login',email:'manager@example.test',password:'0123'});assert.equal(r.status,400);
r=await call('/api/auth',{action:'login',email:'manager@example.test',password:'0056'});assert.equal(r.status,200);
r=await call('/api/state');assert.equal(r.status,200);
});
test('built worker: Telegram code binds user and /menu replies; webhook secret required',async()=>{
let r=await call('/api/state');const id=r.body.user.id;
r=await call('/api/invite',{target:id,isEmployee:false,code:'SampleBot48'});assert.equal(r.status,200,JSON.stringify(r.body));const code=r.body.code;
const original=globalThis.fetch;const messages=[];globalThis.__env.TELEGRAM_BOT_TOKEN='test-only-token';globalThis.__env.TELEGRAM_WEBHOOK_SECRET='test-only-secret';globalThis.fetch=async(url,options)=>{assert.ok(String(url).startsWith('https://api.telegram.org/'));const body=JSON.parse(options.body);messages.push(body.text||'');return Response.json({ok:true,result:{message_id:1}});};
try{const update=(n,text,secret)=>worker.fetch(new Request('https://app.test/api/telegram',{method:'POST',headers:{'Content-Type':'application/json',...(secret?{'X-Telegram-Bot-Api-Secret-Token':secret}:{})},body:JSON.stringify({update_id:n,message:{chat:{id:123,type:'private'},from:{id:123},text}})}),globalThis.__env,ctx);
let response=await update(1,'/start '+code,null);assert.equal(response.status,403);assert.equal(messages.length,0);
response=await update(1,'/start '+code,'test-only-secret');assert.equal(response.status,200);assert.ok(messages.some(x=>x.includes('Аккаунт привязан')));assert.ok(messages.some(x=>x.includes('Здравствуйте')));
messages.length=0;response=await update(2,'/menu','test-only-secret');assert.equal(response.status,200);assert.ok(messages.some(x=>x.includes('Здравствуйте')));
r=await call('/api/state');assert.equal(r.body.user.telegramId,123);
}finally{globalThis.fetch=original;}
await call('/api/auth',{action:'logout'});r=await call('/api/state');assert.equal(r.status,401);
});
