export default defineNuxtRouteMiddleware((to) => {
  return
  // const {loggedIn} = useUserSession();

  // const publicPaths = ['/login', '/inquiries/new', '/quotes/client'];

  // const isPublicPath = publicPaths.some(
  //   (path) => to.path === path || to.path.startsWith(`${path}/`)
  // );

  // if (loggedIn.value && to.path === '/login') return navigateTo('/clients');

  // if (!isPublicPath && !loggedIn.value) return navigateTo('/login');
});
