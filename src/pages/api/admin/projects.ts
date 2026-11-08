import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { projects } from '../../../db/schema';
import { eq, desc } from 'drizzle-orm';
import { deleteCloudinaryImage } from '../../../lib/cloudinary';

export const GET: APIRoute = async () => {
  try {
    const list = await db.select().from(projects).orderBy(desc(projects.displayOrder), desc(projects.id));
    return new Response(JSON.stringify(list), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    await db.insert(projects).values(data);
    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const { id, ...data } = await request.json();
    if (!id) return new Response(JSON.stringify({ error: 'id is required' }), { status: 400 });

    await db.update(projects).set(data).where(eq(projects.id, Number(id)));
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ url }) => {
  try {
    const id = url.searchParams.get('id');
    if (!id) return new Response(JSON.stringify({ error: 'id is required' }), { status: 400 });

    const [item] = await db.select().from(projects).where(eq(projects.id, Number(id))).limit(1);
    if (item?.thumbnailPublicId) {
      await deleteCloudinaryImage(item.thumbnailPublicId);
    }

    await db.delete(projects).where(eq(projects.id, Number(id)));
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
