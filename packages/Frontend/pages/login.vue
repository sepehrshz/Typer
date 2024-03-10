<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const user = useCookie<{
  name: string,
  email: string,
  userName: string
}
>('user', { maxAge: 1000 })

const schema = z.object({
  email: z.string(),
  password: z.string(),
});

type Schema = z.output<typeof schema>;

const state = reactive({
  email: "",
  password: ""
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  login();
}

const login = async () => {
  const response: {
    userName: string,
    email: string,
    name: string,
    pass: string
  } = await $fetch('http://localhost:3000/login', {
    method: 'POST',
    body: {
      userName: '',
      email: state.email,
      name: '',
      pass: state.password
    }
  })
  user.value = {
    name: response.name,
    email: response.email,
    userName: response.userName
  }
}

const iconActive = ref(false);
const changeIcon = () => {
  if (iconActive.value) iconActive.value = false;
  else iconActive.value = true;
};
</script>

<template>
  <div
    class="flex items-center justify-between w-full h-[100vh] bg-gradient-to-r from-electric-violet-500 from-20% to-electric-violet-200">
    <div class="w-6/12 flex flex-col items-center justify-center">
      <span class="text-white text-4xl w-5/6">Typer</span>
      <img class="w-[580px]" src="../assets/signup-pic.png" />
    </div>
    <UForm :schema="schema" :state="state"
      class="w-6/12 h-full py-10 flex flex-col justify-between items-center float-right bg-white rounded-l-[80px]"
      @submit="onSubmit">
      <div class="mt-10 text-3xl">Login</div>
      <div class="w-full mt-12 h-72 flex flex-col justify-evenly items-center">
        <UFormGroup label="Username or Email" name="email" class="w-1/2">
          <UInput v-model="state.email" size="lg"
            class="w-full block rounded-md border-gray-300 outline-none pt-1 focus:border-electric-violet-500 focus:ring-electric-violet-500 sm:text-sm" />
        </UFormGroup>

        <UFormGroup label="Password" name="password" class="w-1/2 relative">
          <UInput v-model="state.password" size="lg" :type="iconActive ? 'text' : 'password'" name="password"
            class="w-full block rounded-md border-gray-300 outline-none pt-1 focus:border-electric-violet-500 focus:ring-electric-violet-500 sm:text-sm" />
          <Icon @click="() => changeIcon()" class="cursor-pointer absolute right-2 top-[15px]" size="20px"
            :name="iconActive ? 'formkit:eye' : 'formkit:hidden'" color="black" />
        </UFormGroup>
      </div>
      <UButton type="submit"
        class="flex justify-center items-center mt-12 bg-gradient-to-r from-electric-violet-500 to-electric-violet-400 text-white w-1/2 h-14 rounded-md text-lg font-semibold">
        Sign in
      </UButton>
      <div class="mt-5">
        Don't have any account?
        <span class="cursor-pointer text-electric-violet-500">
          <NuxtLink to='./signup'>Sign up</NuxtLink>
        </span>
      </div>
    </UForm>
  </div>
</template>

<style>
::selection {
  color: #fff;
  background: #b800e6;
}
</style>
