<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import { useRouter } from 'vue-router'
import ResetPassword from "~/components/ResetPassword.vue";
import { onClickOutside } from '@vueuse/core';

const toast = useToast();
const clickOutsideTarget = ref(null);
onClickOutside(clickOutsideTarget, () => isForget.value = false)

const isForget = ref(false);
const isValid = () => {
  isForget.value = false;
}
const router = useRouter();

const user = useCookie<{
  name: string,
  email: string,
  userName: string,
  accessToken: string,
  refreshToken: string,
  avatarIndex: number,
}
>('user', { maxAge: 60 * 60 * 24 * 7 })

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
  const response: [
    {
      userName: string,
      email: string,
      name: string,
      password: string,
      avatarIndex: number,
    },
    accessToken: string,
    refreshToken: string
  ] = await $fetch('http://localhost:3000/login', {
    method: 'POST',
    body: {
      userName: '',
      email: state.email,
      name: '',
      password: state.password
    }
  })
  if (typeof (response) == "string") {
    switch (response) {
      case "Email or username not found":
        toast.add({ title: response, color: 'red' });
        break;
      case "Invalid password":
        toast.add({ title: response, color: 'red' });
        break;
    }
  }
  else if (response.length === 3) {
    toast.add({ title: 'Login successfully', color: 'green' })
    user.value = {
      name: response[0].name,
      email: response[0].email,
      userName: response[0].userName,
      accessToken: response[1],
      refreshToken: response[2],
      avatarIndex: response[0].avatarIndex,
    }
    router.push('/');
  }
  else {
    toast.add({ title: 'Something went wrong', color: 'red' })
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
    class="flex px-16 pb-10 pt-20 items-center justify-between w-full h-[100vh] bg-gradient-to-r from-electric-violet-500 from-20% to-electric-violet-300 md:to-electric-violet-200 sm:px-32 md:pb-0 md:px-0 md:pt-0">
    <NuxtLink to="/">
      <button
        class="absolute top-4 flex justify-center items-center font-semibold left-4 z-20 w-32 h-10 rounded-xl bg-white text-sm md:top-6 md:left-6 md:w-40 md:h-12">
        Back to home
      </button>
    </NuxtLink>
    <div class="w-6/12 hidden flex-col items-center justify-center md:flex">
      <img class="w-[580px]" src="../assets/signup-pic.png" />
    </div>
    <UForm :schema="schema" :state="state"
      class="w-6/12 h-full py-10 flex flex-col justify-between items-center flex-auto bg-white rounded-3xl md:rounded-l-[80px] md:rounded-none md:float-right"
      @submit="onSubmit">
      <div class="mt-10 text-4xl md:text-3xl">Login</div>
      <div class="w-full mt-12 h-72 flex flex-col justify-evenly items-center">
        <UFormGroup label="Username or Email" name="email" class="w-3/4 md:w-1/2">
          <UInput v-model="state.email" size="lg"
            class="w-full block rounded-md border-gray-300 outline-none pt-1 focus:border-electric-violet-500 focus:ring-electric-violet-500 sm:text-sm" />
        </UFormGroup>

        <UFormGroup label="Password" name="password" class="w-3/4 md:w-1/2 relative">
          <UInput v-model="state.password" size="lg" :type="iconActive ? 'text' : 'password'" name="password"
            class="w-full block rounded-md border-gray-300 outline-none pt-1 focus:border-electric-violet-500 focus:ring-electric-violet-500 sm:text-sm" />
          <Icon @click="() => changeIcon()" class="cursor-pointer absolute right-2 top-[15px]" size="20px"
            :name="iconActive ? 'formkit:eye' : 'formkit:hidden'" color="black" />
        </UFormGroup>
      </div>
      <UButton type="submit"
        class="flex justify-center items-center mt-12 bg-gradient-to-r from-electric-violet-500 to-electric-violet-400 text-white w-3/4 md:w-1/2 h-14 rounded-md text-lg font-semibold">
        Sign in
      </UButton>
      <div class="mt-5">
        Don't have any account?
        <span class="cursor-pointer text-electric-violet-500">
          <NuxtLink to='/signup'>Sign up</NuxtLink>
        </span>
      </div>
      <div class="mt-2 md:mt-0">
        Forget password?
        <span @click="() => isForget = true" class="cursor-pointer text-electric-violet-500">
          Reset password
        </span>
      </div>
    </UForm>
    <div v-if="isForget" class="backdrop-blur-sm absolute h-full w-full flex justify-center items-center">
    </div>
    <Transition name="bounce">
      <ResetPassword v-if="isForget" class="z-20 absolute left-1/2 -translate-x-1/2" ref="clickOutsideTarget"
        @is-valid="isValid" />
    </Transition>
  </div>
</template>

<style>
::selection {
  color: #fff;
  background: #b800e6;
}
</style>
