export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
  modules: [
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@nuxt/image",
    "@nuxtjs/color-mode",
    "nuxt-icon",
    "nuxt-typed-router",
    "@nuxt/ui",
    "@vueuse/nuxt",
    "@nuxt/test-utils/module",
    "@nuxtjs/i18n",
  ],
  i18n: {
    defaultLocale: "en",
    locales: [
      {
        code: "en",
        name: "English",
        iso: "en-US",
        file: ".\\locales\\en.json",
      },
      {
        code: "fa",
        name: "Farsi",
        iso: "fa-IR",
        file: ".\\locales\\fa.json",
        dir: "rtl",
      },
    ],
  },
  colorMode: {
    classSuffix: "",
  },
});
