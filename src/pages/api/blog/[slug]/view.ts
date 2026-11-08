import type { APIRoute } from 'astro';
import { db } from '../../../../db';
import { blogPosts } from '../../../../db/schema';
import { eq, sql } from 'drizzle-orm';

export const POST: APIRoute = async ({ params, cookies, request }) => {
  const { slug } = params;
  if (!slug) {
    return new Response(JSON.stringify({ error: 'Slug is required' }), { status: 400 });
  }

  try {
    // 1. Check if user already viewed this specific post in the last 24 hours
    const cookieKey = `viewed_post_${slug}`;
    const alreadyViewed = cookies.get(cookieKey)?.value;

    if (alreadyViewed) {
      // User has already viewed recently: do not increment, return current views
      const [current] = await db
        .select({ viewsCount: blogPosts.viewsCount })
        .from(blogPosts)
        .where(eq(blogPosts.slug, slug))
        .limit(1);

      return new Response(
        JSON.stringify({ 
          success: true, 
          incremented: false, 
          viewsCount: current?.viewsCount || 0 
        }), 
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 2. Increment view count in database
    await db
      .update(blogPosts)
      .set({ viewsCount: sql`COALESCE(${blogPosts.viewsCount}, 0) + 1` })
      .where(eq(blogPosts.slug, slug));

    // 3. Fetch latest count to return to client
    const [updated] = await db
      .select({ viewsCount: blogPosts.viewsCount })
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1);

    // 4. Set cookie with 24 hours (86,400 seconds) expiration
    cookies.set(cookieKey, '1', {
      path: '/',
      maxAge: 86400,
      httpOnly: true,
      sameSite: 'lax',
      secure: import.meta.env.PROD,
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        incremented: true, 
        viewsCount: updated?.viewsCount || 1 
      }), 
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('Error incrementing view count:', err);
    return new Response(JSON.stringify({ error: 'Failed to update views' }), { status: 500 });
  }
};
