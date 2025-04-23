import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  modules: [
    '@nuxthub/core',
    'nuxt-auth-utils',
    '@nuxt/ui-pro',
  ],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  hub: {
    database: true,
  },

  components: [
    {
      path: '~/components',
      prefix: 'My'
    }
  ],

  nitro: {
    experimental: {
      tasks: true, // for db seed to work
    },
  },

  compatibilityDate: '2024-11-01',

  devtools: {enabled: false},

  future: {
    compatibilityVersion: 4,
  },
});