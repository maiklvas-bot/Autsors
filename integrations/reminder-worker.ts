// Deploy separately only after the protected reminder endpoint is externally reachable.
// Cloudflare cron: */5 * * * *. Secrets are configured in the host, never in source.
interface ReminderEnv { APP_ORIGIN: string; REMINDER_SECRET: string }
export default {
 async scheduled(_event: unknown, env: ReminderEnv): Promise<void> {
  const response=await fetch(new URL('/api/reminders',env.APP_ORIGIN),{
   method:'POST',headers:{Authorization:`Bearer ${env.REMINDER_SECRET}`},redirect:'error'
  });
  if(!response.ok)throw new Error(`Reminder delivery returned ${response.status}`);
 }
};
