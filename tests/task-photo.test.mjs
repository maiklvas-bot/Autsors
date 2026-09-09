import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';

const result=await build({entryPoints:['app/api/task-photo/route.ts'],bundle:true,platform:'node',format:'esm',write:false,plugins:[{name:'route-mocks',setup(b){b.onResolve({filter:/lib\/server$/},()=>({path:'server',namespace:'mock'}));b.onResolve({filter:/lib\/telegram$/},()=>({path:'telegram',namespace:'mock'}));b.onLoad({filter:/.*/,namespace:'mock'},args=>({contents:args.path==='server'?'export async function identity(){return globalThis.__photoIdentity;}':"export async function telegramFile(id){globalThis.__fileId=id;return new Response(new Uint8Array([1,2,3]),{headers:{'Content-Type':'image/jpeg'}});}"}));}}]});
const api=await import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text).toString('base64'));
const shift={id:'s1',employee:'e1',branch:'b1',date:'2026-09-09',start:'09:00',end:'18:00',breakMinutes:60,tasks:['hall-dust'],status:'review',taskReports:[{taskId:'hall-dust',status:'done',photos:['private-file'],updatedAt:'2026-09-09T12:00:00Z'}]};
const state={branches:[{id:'b1',name:'Филиал',city:'Тобольск'}],employees:[],shifts:[shift],members:[],audit:[],settings:{reminderMinutes:15,timezone:'Asia/Yekaterinburg'},version:1};

test('task photos require branch access and are proxied without exposing Telegram token',async()=>{globalThis.__photoIdentity={s:state,m:{id:'m',name:'УМ',email:'',role:'manager',branches:['b1'],active:true}};let r=await api.GET(new Request('https://app.test/api/task-photo?shift=s1&task=hall-dust&index=0'));assert.equal(r.status,200);assert.equal(r.headers.get('content-type'),'image/jpeg');assert.equal(globalThis.__fileId,'private-file');globalThis.__photoIdentity={s:state,m:{id:'m2',name:'Другой УМ',email:'',role:'manager',branches:[],active:true}};r=await api.GET(new Request('https://app.test/api/task-photo?shift=s1&task=hall-dust&index=0'));assert.equal(r.status,403);});
