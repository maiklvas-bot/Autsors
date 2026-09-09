import {readJson} from '../../lib/request';
import {identity,sameOrigin} from '../../lib/server';import {createInvite} from '../../lib/invitations';
export async function POST(r:Request){try{sameOrigin(r);const {m}=await identity();const a=await readJson(r,65536);const code=await createInvite(m,a.target,!!a.isEmployee,a.code);return Response.json({code});}catch(e){return Response.json({error:(e as Error).message},{status:400});}}
