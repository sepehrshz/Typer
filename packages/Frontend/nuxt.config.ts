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
  ],
  colorMode: {
    classSuffix: "",
  },
  image: {
    // Options
  },
});
