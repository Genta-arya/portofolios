import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { services, techStacks } from '../../../db/schema';
import { eq, asc } from 'drizzle-orm';

export const GET: APIRoute = async ({ url }) => {
  const type = url.searchParams.get('type') || 'services';
  try {
    if (type === 'tech') {
      const data = await db.select().from(techStacks).orderBy(asc(techStacks.displayOrder));
      return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    const data = await db.select().from(services).orderBy(asc(services.displayOrder));
    return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { type, ...data } = await request.json();
    if (type === 'tech') {
      await db.insert(techStacks).values(data);
    } else {
      await db.insert(services).values(data);
    }
    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const { type, id, ...data } = await request.json();
    if (type === 'tech') {
      await db.update(techStacks).set(data).where(eq(techStacks.id, Number(id)));
    } else {
      await db.update(services).set(data).where(eq(services.id, Number(id)));
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ url }) => {
  try {
    const type = url.searchParams.get('type');
    const id = Number(url.searchParams.get('id'));
    if (!id) return new Response(JSON.stringify({ error: 'id required' }), { status: 400 });

    if (type === 'tech') {
      await db.delete(techStacks).where(eq(techStacks.id, id));
    } else {
      await db.delete(services).where(eq(services.id, id));
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
