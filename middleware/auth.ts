export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useFirebase();
  if (user.value === null) {
    return navigateTo("/");
  }
});
