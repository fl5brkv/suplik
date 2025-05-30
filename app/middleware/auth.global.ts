export default defineNuxtRouteMiddleware((to) => {
  const {user, loggedIn} = useUserSession();

  // Not logged in: block /admin/* and /technician/*
  if (!loggedIn.value) {
    if (to.path.startsWith('/admin') || to.path.startsWith('/technician')) {
      return navigateTo('/login');
    }
    return;
  }

  // Logged in: user with technician object (admin)
  if (user.value && user.value.technician && user.value.technician.id) {
    // Block /login and /admin/*
    if (to.path === '/login' || to.path.startsWith('/admin')) {
      return navigateTo('/technician/jobs');
    }
    // Redirect admin's default page
    if (to.path === '/') {
      return navigateTo('/technician/jobs');
    }
    return;
  }

  // Logged in: user without technician object (technician)
  if (user.value && !user.value.technician) {
    // Block /login and /technician/*
    if (to.path === '/login' || to.path.startsWith('/technician')) {
      return navigateTo('/admin/demands');
    }
    // Redirect admin's default page
    if (to.path === '/') {
      return navigateTo('/admin/demands');
    }
    return;
  }
});
