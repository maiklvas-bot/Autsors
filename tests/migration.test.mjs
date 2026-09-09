import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DatabaseSync} from 'node:sqlite';

const migrations=['0000_legal_layla_miller.sql','0001_nice_mysterio.sql','0002_clever_nicolaos.sql','0003_branch_catalog.sql','0004_current_branches_and_city_access.sql'];
const statements=file=>fs.readFileSync(new URL('../drizzle/'+file,import.meta.url),'utf8').split('--> statement-breakpoint').map(x=>x.trim()).filter(Boolean);

test('branch catalog migration preserves history and revokes removed locations',()=>{
  const db=new DatabaseSync(':memory:');
  for(const file of migrations.slice(0,3))for(const sql of statements(file))db.exec(sql);
  const body={version:7,branches:[
    {id:'b1',name:'Старое имя Ленты',city:'Тобольск',hours:[{day:0,closed:false,open:'08:00',close:'22:00'}]},
    {id:'tyumen-panama',name:'Тюмень · ТРЦ Панама',city:'Тюмень'},
    {id:'tyumen-shirot',name:'Тюмень · Окей Широтная',city:'Тюмень'}
  ],jobs:[],tasks:[],employees:[],shifts:[],members:[],audit:[]};
  db.prepare('INSERT INTO app_state(id,body,version) VALUES (1,?,7)').run(JSON.stringify(body));
  const rows=[
    ['employees:e-old','employees',{id:'e-old',name:'Архивный сотрудник',branch:'tyumen-panama',job:'hall',active:true,created:'2026-01-01'}],
    ['shifts:s-old','shifts',{id:'s-old',employee:'e-old',branch:'tyumen-panama',date:'2026-08-01',start:'09:00',end:'18:00',breakMinutes:60,tasks:[],status:'planned'}],
    ['members:m-old','members',{id:'m-old',name:'Архивный сотрудник',email:'',role:'employee',branches:['tyumen-panama'],employeeId:'e-old',telegramId:12345,active:true}],
    ['members:manager','members',{id:'manager',name:'УМ',email:'um@example.test',role:'manager',branches:['b1','tyumen-shirot'],active:true}]
  ];
  for(const [key,kind,value] of rows)db.prepare('INSERT INTO records(key,kind,body) VALUES (?,?,?)').run(key,kind,JSON.stringify(value));
  for(const file of migrations.slice(3))for(const sql of statements(file))db.exec(sql);

  const state=JSON.parse(db.prepare('SELECT body FROM app_state WHERE id=1').get().body);
  assert.equal(state.branches.length,24);
  assert.equal(state.branches.find(x=>x.id==='b1').name,'Тобольск ТЦ Лента');
  assert.deepEqual(state.branches.find(x=>x.id==='b1').hours,[{day:0,closed:false,open:'08:00',close:'22:00'}]);
  assert.equal(state.branches.some(x=>['tyumen-panama','tyumen-shirot'].includes(x.id)),false);
  const record=key=>JSON.parse(db.prepare('SELECT body FROM records WHERE key=?').get(key).body);
  assert.equal(record('employees:e-old').active,false);
  assert.equal(record('shifts:s-old').status,'cancelled');
  assert.equal(record('shifts:s-old').branchName,'Тюмень · ТРЦ Панама');
  assert.equal(record('members:m-old').active,false);
  assert.equal(record('members:m-old').telegramId,undefined);
  assert.deepEqual(record('members:manager').branches,['b1']);
  assert.match(record('audit:catalog-2026-09-v4').detail,/24 филиала/);
});
