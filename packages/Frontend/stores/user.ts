export const useUserStore = defineStore("user", () => {
  const user = reactive({
    name: "",
    email: "",
    userName: "",
    password: "",
  });
  return { user };
});
