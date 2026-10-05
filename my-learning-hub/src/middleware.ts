import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
	const pathname = context.url.pathname;
	if (pathname.endsWith('.md')) {
		const clean = pathname.replace(/\.md$/, '/');
		return context.redirect(clean, 301);
	}
	return next();
});
