import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicApiRoute = createRouteMatcher([
  '/api/set-theme',
  '/api/webhooks(.*)'
]);

// Define all other public routes
const isOtherPublicRoute = createRouteMatcher([
  '/(.*)',           // Root with any path or parameters
  '/sign-up(.*)'
]);

const isPrivateRoute = createRouteMatcher([
  '/register'
]);

export default clerkMiddleware(async (auth, request) => {
  const url = new URL(request.url);
  
  // If this is an API route
  if (url.pathname.startsWith('/api/')) {
    // Only allow specific public API routes without authentication
    if (isPublicApiRoute(request)) {
      // Allow access without authentication
      return;
    } else {
      // All other API routes require authentication
      await auth.protect();
      return;
    }
  }
  
  // For non-API routes, check if it's public
  if (!isOtherPublicRoute(request) || isPrivateRoute(request)) {
    // Protect non-public routes
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}