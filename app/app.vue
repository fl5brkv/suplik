<template>
  <NuxtRouteAnnouncer />
  <UApp>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
useHead({
  meta: [
    {charset: 'utf-8'},
    {name: 'viewport', content: 'width=device-width, initial-scale=1'},
  ],
  link: [{rel: 'icon', href: '/favicon.ico'}],
  htmlAttrs: {
    lang: 'en',
  },
});

const title = 'Šuplík';
const description = 'Šuplík je CRM-ko.';

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://dashboard-template.nuxt.dev/social-card.png',
  twitterImage: 'https://dashboard-template.nuxt.dev/social-card.png',
  twitterCard: 'summary_large_image',
});
</script>
