import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawn,spawnSync} from 'node:child_process';

test('self-hosted runtime persists login and rejects forged platform identity',async()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'dns-docker-test-'));
  const env={...process.env,DATA_DIR:dir,PUBLIC_ORIGIN:'https://selfhost.example.test',REMINDER_SECRET:'testsecret',TELEGRAM_AUTO_CONNECT:'false'};
  const seed=spawnSync(process.execPath,['deploy/admin.mjs'],{env,input:JSON.stringify({email:'owner@example.test',pin:'0048'}),encoding:'utf8'});
  assert.equal(seed.status,0,seed.stderr);
  let server;
  async function start(){
    server=spawn(process.execPath,['deploy/server.mjs'],{env,stdio:['ignore','pipe','pipe']});
    let errors='';server.stderr.on('data',x=>errors+=x);
    for(let i=0;i<50;i++){try{const r=await fetch('http://127.0.0.1:3000/healthz');if(r.ok)return;}catch{}await new Promise(r=>setTimeout(r,100));}
    throw new Error('Server failed: '+errors);
  }
  async function stop(){if(!server||server.exitCode!==null)return;await new Promise(resolve=>{server.once('exit',resolve);server.kill('SIGTERM');});}
  let cookie='';
  async function request(p,body,extra={}){const r=await fetch('http://127.0.0.1:3000'+p,{method:body?'POST':'GET',headers:{Origin:env.PUBLIC_ORIGIN,'Content-Type':'application/json',cookie,...extra},...(body?{body:JSON.stringify(body)}:{})});if(r.headers.get('set-cookie'))cookie=r.headers.get('set-cookie').split(';')[0];return {status:r.status,body:await r.json()};}
  try{
    await start();
    let r=await request('/api/auth',null,{'oai-authenticated-user-email':'maiklvas@gmail.com'});assert.equal(r.body.canRecoverOwner,false);assert.equal(r.body.selfHosted,true);
    r=await request('/api/auth',{action:'login',email:'owner@example.test',password:'0048'});assert.equal(r.status,200,JSON.stringify(r.body));
    r=await request('/api/state');assert.equal(r.status,200);assert.equal(r.body.state.branches.length,24);
    const png=Buffer.from('89504e470d0a1a0a00000000','hex');
    let avatar=await fetch('http://127.0.0.1:3000/api/avatar',{method:'POST',headers:{Origin:env.PUBLIC_ORIGIN,cookie,'Content-Type':'image/png'},body:png});assert.equal(avatar.status,200);
    avatar=await fetch('http://127.0.0.1:3000/api/avatar',{headers:{cookie}});assert.equal(avatar.status,200);assert.deepEqual(Buffer.from(await avatar.arrayBuffer()),png);
    await stop();await start();
    r=await request('/api/state');assert.equal(r.status,200,'session should survive restart');
    const home=await fetch('http://127.0.0.1:3000/');assert.equal(home.status,200);assert.match(await home.text(),/DNS/);
  }finally{await stop();fs.rmSync(dir,{recursive:true,force:true});}
},{timeout:20000});
