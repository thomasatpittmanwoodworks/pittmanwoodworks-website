// Runs every morning. If a blog post is scheduled for today (Central time),
// it triggers a site update so the post goes live on its date.
// Setup: create a Netlify build hook and save its URL as the BUILD_HOOK_URL environment variable.
export default async () => {
  const hook = process.env.BUILD_HOOK_URL;
  if (!hook) return new Response('BUILD_HOOK_URL is not set', { status: 200 });
  const site = process.env.URL || 'https://www.pittmanwoodworks.com';
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Chicago' }).format(new Date());
  let upcoming = [];
  try { upcoming = (await (await fetch(`${site}/blog/schedule.json`, { cache: 'no-store' })).json()).upcoming || []; } catch { /* no schedule yet */ }
  if (!upcoming.includes(today)) return new Response(`No posts scheduled for ${today}`);
  await fetch(hook, { method: 'POST' });
  return new Response(`Publishing posts scheduled for ${today}`);
};

export const config = { schedule: '0 12 * * *' }; // 12:00 UTC = 6 am Central (7 am during daylight time)
