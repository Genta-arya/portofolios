import type { APIRoute } from 'astro';
import { db } from '../../../../db';
import { blogPosts } from '../../../../db/schema';
import { eq, sql } from 'drizzle-orm';

export const POST: APIRoute = async ({ params }) => {
  const { slug } = params;
  if (!slug) {
    return new Response(JSON.stringify({ error: 'Slug is required' }), { status: 400 });
  }

  try {
    await db
      .update(blogPosts)
      .set({ viewsCount: sql`${blogPosts.viewsCount} + 1` })
      .where(eq(blogPosts.slug, slug));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error incrementing view count:', err);
    return new Response(JSON.stringify({ error: 'Failed to update views' }), { status: 500 });
  }
};

