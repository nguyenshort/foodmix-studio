export default function ({ $axios, redirect, $cookies, store }) {

  $axios.setToken($cookies.get('_token') || '', 'Bearer')

  $axios.onRequest(config => {
    console.log('Making request to ' + config.url)
  })

  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    if (code === 404) {
      redirect('/404')
    }

    // Unauthorized yêu cầu đăng nhập
    if (code === 401) {
      redirect('/')
    }

    const { code: errorCode, msg } = error.response.data

    if(process.browser && errorCode === 2 && store.getters['pref/showNotify']) {

      if(typeof msg === 'string') {
        window.$nuxt.$message.error(msg)
      } else if (Array.isArray(msg)) {
        // lỗi form
        window.$nuxt.$message.error(msg[0].msg)
      }

    }

  })

  $axios.onResponse(response => {
    console.log('Response from ' + response.config.url)
    const data = response.data
    if(typeof data === 'object' && data !== null && data.code === 2 && data.msg) {

      if(process.browser) {
        window.$nuxt.$message.success(data.msg)
      }

    }
  })
}
