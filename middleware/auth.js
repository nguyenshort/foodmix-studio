export default ({ store, route, redirect }) => {
  if (store.getters['pref/auth']) {
    if (route.path === '/') {
      redirect('/recipes')
    }
  } else {
    redirect('/')
  }
}
