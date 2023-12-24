
export default defineNuxtConfig({
  devtools: { enabled: true },
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
  ui: {},
});
