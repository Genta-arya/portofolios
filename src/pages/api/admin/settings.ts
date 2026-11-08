import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { siteSettings } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export const GET: APIRoute = async () => {
  try {
    const [settings] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1);
    return new Response(JSON.stringify(settings || {}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    await db.update(siteSettings).set(data).where(eq(siteSettings.id, 1));
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
