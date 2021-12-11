export const actions = {
  async nuxtServerInit({ commit, state, dispatch }, { app, req }) {
    const _token = this.$cookies.get('_token')
    if (_token) {
      await app.store.dispatch('pref/getMe')
    }
  }
}
