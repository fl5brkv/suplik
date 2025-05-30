export default defineNuxtRouteMiddleware((to, from) => {
  const {loggedIn, user} = useUserSession();

  if (!loggedIn.value) {
    if (to.path.startsWith('/technician') || to.path.startsWith('/admin')) {
      return navigateTo('/');
    }
    return;
  }

  if (user.value?.technician) {
    if (to.path.startsWith('/admin')) {
      return abortNavigation();
    }
    return;
  }

  if (to.path.startsWith('/technician')) {
    return abortNavigation();
  }
});
