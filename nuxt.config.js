export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'FoodMix - Studio',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      {
        rel: 'shortcut icon',
        href: '/favicon/favicon.ico'
      },
      // For new browsers - multisize ico
      {
        rel: 'icon',
        type: 'image/x-icon',
        sizes: '16x16 32x32',
        href: '/favicon/favicon.ico'
      },
      {
        rel: 'apple-touch-icon',
        sizes: '152x152',
        href: '/favicon/favicon-152-precomposed.png'
      },
      {
        rel: 'apple-touch-icon',
        sizes: '144x144',
        href: '/favicon/favicon-144-precomposed.png'
      },
      {
        rel: 'apple-touch-icon',
        sizes: '120x120',
        href: '/favicon/favicon-120-precomposed.png'
      },
      {
        rel: 'apple-touch-icon',
        sizes: '114x114',
        href: '/favicon/favicon-114-precomposed.png'
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/favicon/favicon-180-precomposed.png'
      },
      {
        rel: 'apple-touch-icon',
        sizes: '72x72',
        href: '/favicon/favicon-72-precomposed.png'
      },
      {
        rel: 'apple-touch-icon',
        sizes: '57x57',
        href: '/favicon/favicon-57.png'
      },
      {
        rel: 'icon',
        sizes: '192x192',
        href: '/favicon/favicon-192.png'
      },
      {
        rel: 'manifest',
        href: '/favicon/manifest.json'
      },
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'ant-design-vue/dist/antd.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/antd-ui'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    ['@nuxtjs/dotenv', { filename: '.env' }],
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'vi'
    }
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  server: {
    port: process.env.PORT, // default: 3000
    host: 'localhost', // default: localhost,
    timing: false
  },

  globals: {
    id: '__foodmix', // replacing __nuxt
  }
}
