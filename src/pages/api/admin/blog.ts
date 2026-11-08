import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { blogPosts, blogCategories } from '../../../db/schema';
import { eq, desc } from 'drizzle-orm';
import { deleteCloudinaryImage } from '../../../lib/cloudinary';

export const GET: APIRoute = async ({ url }) => {
  const type = url.searchParams.get('type');
  try {
    if (type === 'categories') {
      const cats = await db.select().from(blogCategories);
      return new Response(JSON.stringify(cats), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
    return new Response(JSON.stringify(posts), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { type, ...data } = await request.json();
    if (type === 'category') {
      await db.insert(blogCategories).values(data);
    } else {
      await db.insert(blogPosts).values({
        ...data,
        publishedAt: data.status === 'published' ? new Date() : null,
      });
    }
    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const { type, id, ...data } = await request.json();
    if (!id) return new Response(JSON.stringify({ error: 'id required' }), { status: 400 });

    if (type === 'category') {
      await db.update(blogCategories).set(data).where(eq(blogCategories.id, Number(id)));
    } else {
      await db.update(blogPosts).set(data).where(eq(blogPosts.id, Number(id)));
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

    if (type === 'category') {
      await db.delete(blogCategories).where(eq(blogCategories.id, id));
    } else {
      const [item] = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
      if (item?.coverImagePublicId) {
        await deleteCloudinaryImage(item.coverImagePublicId);
      }
      await db.delete(blogPosts).where(eq(blogPosts.id, id));
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
