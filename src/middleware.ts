import { defineMiddleware } from 'astro:middleware';
import { verifySessionToken, COOKIE_NAME } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Only protect admin routes and admin APIs
  const isAdminRoute = pathname.startsWith('/admin');
  const isAdminApi = pathname.startsWith('/api/admin');

  // Allow login page and login API without auth
  const isLoginPage = pathname === '/admin/login';
  const isLoginApi = pathname === '/api/admin/auth/login';

  if ((isAdminRoute && !isLoginPage) || (isAdminApi && !isLoginApi)) {
    const sessionCookie = context.cookies.get(COOKIE_NAME);
    const token = sessionCookie?.value;

    if (!token) {
      if (isAdminApi) {
        return new Response(JSON.stringify({ error: 'Unauthorized: Session missing' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return context.redirect('/admin/login');
    }

    const payload = await verifySessionToken(token);
    if (!payload) {
      context.cookies.delete(COOKIE_NAME, { path: '/' });
      if (isAdminApi) {
        return new Response(JSON.stringify({ error: 'Unauthorized: Session invalid or expired' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return context.redirect('/admin/login');
    }

    // Attach admin info to Astro locals
    context.locals.admin = payload;
  }

  // If already logged in and visiting /admin/login, redirect to /admin
  if (isLoginPage) {
    const sessionCookie = context.cookies.get(COOKIE_NAME);
    if (sessionCookie?.value) {
      const payload = await verifySessionToken(sessionCookie.value);
      if (payload) {
        return context.redirect('/admin');
      }
    }
  }

  return next();
});

