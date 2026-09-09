import {scryptSync,randomBytes,timingSafeEqual,createHash} from 'node:crypto';
const N=16384,r=8,p=5;
export function checkPasswordPolicy(password:unknown){if(typeof password!=='string'||!/^\d{4,12}$/.test(password))throw new Error('Введите PIN: от 4 до 12 цифр');return password;}
export function hashPassword(password:string){checkPasswordPolicy(password);const salt=randomBytes(16).toString('hex');return `scrypt$${N}$${r}$${p}$${salt}$${scryptSync(password,salt,32,{N,r,p,maxmem:32*1024*1024}).toString('hex')}`;}
export function verifyPassword(password:string,encoded:string){const [algorithm,n,rr,pp,salt,hash]=encoded.split('$');if(algorithm!=='scrypt'||Number(n)!==N||Number(rr)!==r||Number(pp)!==p||!salt||!hash)return false;const actual=scryptSync(password,salt,32,{N,r,p,maxmem:32*1024*1024});const expected=Buffer.from(hash,'hex');return expected.length===actual.length&&timingSafeEqual(actual,expected);}
export function token(){return randomBytes(32).toString('hex');}
export function digest(s:string){return createHash('sha256').update(s).digest('hex');}
