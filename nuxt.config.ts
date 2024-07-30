// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', "@nuxtjs/i18n"],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'ca', 'en'],
    vueI18n: './i18n.config.ts'
  },

  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: "" },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Playwrite+AR:wght@100..400&display=swap' }
      ]
    }
  },

  nitro: {
    preset: 'vercel-edge', // you can use 'vercel' or other providers here
  },

  runtimeConfig: {
    openaiApiKey: '',
    assistantId: '',
    isDebug: ''
  },

  compatibilityDate: '2024-07-05',
  css: [
    '@/assets/css/estil.css'
  ]
});