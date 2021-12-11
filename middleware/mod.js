export default ({ store, route, redirect }) => {
  if (!['mod', 'admin'].includes(store.getters['pref/user'].role)) {
    redirect('/404')
  }
}
