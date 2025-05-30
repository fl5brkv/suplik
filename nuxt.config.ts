import vue from '@vitejs/plugin-vue';

export default defineNuxtConfig({
  modules: [
    '@nuxthub/core',
    'nuxt-auth-utils',
    '@nuxt/ui-pro',
    'nuxt-nodemailer',
  ],

  css: ['~/assets/css/main.css'],

  hub: {
    database: true,
  },

  components: [
    {
      path: '~/components',
      prefix: 'My',
    },
  ],

  nitro: {
    experimental: {
      tasks: true, // db seed
    },
    rollupConfig: {
      plugins: [vue()], // vue-email
    },
  },

  nodemailer: {
    from: 'stodo@stodo.sk',
    host: 'smtp.mailtrap.io',
    port: 587,
    secure: false,
    auth: {
      user: 'a48d362e4012e1',
      pass: 'e593d1246b3384',
    },
  },

  runtimeConfig: {
    salt: import.meta.env.NUXT_PASSWORD_SALT,
    public: {
      baseURL: process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    },
    mailerHost: import.meta.env.NUXT_MAILER_HOST,
    mailerPort: import.meta.env.NUXT_MAILER_PORT,
    mailerUsername: import.meta.env.NUXT_MAILER_USERNAME,
    mailerPassword: import.meta.env.NUXT_MAILER_PASSWORD,
    mailerAuthType: import.meta.env.NUXT_MAILER_AUTHTYPE,
  },

  compatibilityDate: '2024-11-01',

  devtools: {enabled: true},

  future: {
    compatibilityVersion: 4,
  },
});
