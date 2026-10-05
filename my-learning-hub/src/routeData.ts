import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

/**
 * Keep the sidebar data (used for prev/next pagination and the lesson picker)
 * but never render the sidebar column itself.
 */
export const onRequest = defineRouteMiddleware((context) => {
	context.locals.starlightRoute.hasSidebar = false;
	context.locals.starlightRoute.toc = undefined;
});
