// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: {enabled: false},

  future: {
    compatibilityVersion: 4,
  },

  modules: ['@nuxthub/core'],

  hub: {
    database: true,
  },

  nitro: {
    experimental: {
      tasks: true, // for db seed to work
    },
  },
});
