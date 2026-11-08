import type { APIRoute } from 'astro';
import { db } from '../db';
import { blogPosts, projects } from '../db/schema';
import { eq } from 'drizzle-orm';

export const GET: APIRoute = async () => {
  const siteUrl = process.env.PUBLIC_SITE_URL || 'https://www.mgentaarya.my.id';

  let posts: any[] = [];
  let projectItems: any[] = [];
  try {
    const [p, pr] = await Promise.all([
      db.select().from(blogPosts).where(eq(blogPosts.status, 'published')).catch(() => []),
      db.select().from(projects).catch(() => []),
    ]);
    posts = p || [];
    projectItems = pr || [];
  } catch (e) {
    console.error('Sitemap query error:', e);
  }

  const staticPages = [
    '',
    '/projects',
    '/article',
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (path) => `
    <url>
      <loc>${siteUrl}${path}</loc>
      <changefreq>weekly</changefreq>
      <priority>${path === '' ? '1.0' : '0.8'}</priority>
    </url>
  `
    )
    .join('')}
  ${projectItems
    .map(
      (item) => `
    <url>
      <loc>${siteUrl}/projects/${item.slug}</loc>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>
  `
    )
    .join('')}
  ${posts
    .map(
      (post) => `
    <url>
      <loc>${siteUrl}/article/${post.slug}</loc>
      <lastmod>${(post.updatedAt || post.createdAt).toISOString()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>
  `
    )
    .join('')}
</urlset>`;

  return new Response(sitemap.trim(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};

