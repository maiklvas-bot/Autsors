import {identity} from '../../lib/server';
import {canManageBranch} from '../../lib/model';
import {telegramFile} from '../../lib/telegram';

export async function GET(r:Request){
  try{
    const {s,m}=await identity();
    const q=new URL(r.url).searchParams,shiftId=q.get('shift')||'',taskId=q.get('task'),index=Number(q.get('index'));
    if(!Number.isInteger(index)||index<0||index>4)return new Response(null,{status:400});
    const shift=s.shifts.find(x=>x.id===shiftId);
    if(!shift||!canManageBranch(s,m,shift.branch))return new Response(null,{status:403});
    const photos=taskId?shift.taskReports?.find(x=>x.taskId===taskId)?.photos:shift.photos;
    const fileId=photos?.[index];
    if(!fileId)return new Response(null,{status:404});
    const source=await telegramFile(fileId);
    return new Response(source.body,{headers:{'Content-Type':source.headers.get('content-type')||'image/jpeg','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; img-src 'self'; sandbox"}});
  }catch(e){
    const error=e as Error & {status?:number};
    const status=error.status&&error.status>=400&&error.status<600?error.status:502;
    if(status>=500)console.error('Task photo load failed:',error.message);
    return new Response(null,{status});
  }
}
