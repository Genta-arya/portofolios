import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { contactMessages } from '../../../db/schema';
import { eq, desc } from 'drizzle-orm';

export const GET: APIRoute = async () => {
  try {
    const list = await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
    return new Response(JSON.stringify(list), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const PATCH: APIRoute = async ({ request }) => {
  try {
    const { id, isRead } = await request.json();
    await db.update(contactMessages).set({ isRead }).where(eq(contactMessages.id, Number(id)));
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ url }) => {
  try {
    const id = Number(url.searchParams.get('id'));
    if (!id) return new Response(JSON.stringify({ error: 'id required' }), { status: 400 });

    await db.delete(contactMessages).where(eq(contactMessages.id, id));
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
