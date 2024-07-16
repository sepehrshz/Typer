<script setup lang="ts">
import { z } from "zod"
import type { FormSubmitEvent } from '#ui/types'
import { useRouter } from 'vue-router'

const toast = useToast();
const router = useRouter()
const schema = z.object({
  fullName: z.string().min(4),
  userName: z.string().min(4),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Must be at least 8 characters")
    .refine((value) => value === state.password, {
      message: "Passwords do not match",
    })
})

type Schema = z.output<typeof schema>

const state = reactive({
  fullName: '',
  userName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

function onSubmit(event: FormSubmitEvent<Schema>) {
  signup()
}

const signup = async () => {
  const response = await $fetch('http://localhost:3000/signup', {
    method: 'POST',
    body: {
      userName: state.userName,
      email: state.email,
      name: state.fullName,
      password: state.password
    }
  })
  switch (response) {
    case "Email has already taken":
      toast.add({ title: response, color: 'red' })
      break;
    case "Username has already taken":
      toast.add({ title: response, color: 'red' })
      break;
    case "Successfull":
      toast.add({ title: 'Signup successfully', color: 'green' })
      router.push('/login');
      break;
    default:
      toast.add({ title: 'Something went wrong', color: 'red' })
      break;
  }
}

const iconActive = ref(false)
const iconActive2 = ref(false)

const changeIcon = () => {
  if (iconActive.value) iconActive.value = false
  else iconActive.value = true
}
const changeIcon2 = () => {
  if (iconActive2.value) iconActive2.value = false
  else iconActive2.value = true
}


</script>

<template>
  <div
    class="flex px-16 pb-10 pt-20 items-center justify-between w-full h-[100vh] bg-gradient-to-r from-electric-violet-500 from-20% to-electric-violet-300 md:to-electric-violet-200 md:pb-0 md:px-0 md:pt-0">
    <NuxtLink to="/">
      <button
        class="absolute top-4 left-4 flex justify-center items-center font-semibold z-10 w-32 h-10 md:top-6 md:left-6 md:w-40 md:h-12 rounded-xl bg-white">
        Back to home
      </button>
    </NuxtLink>
    <div class="w-6/12 hidden md:flex flex-col items-center justify-center">
      <img class="w-[580px]" src="../assets/signup-pic.png">
    </div>
    <UForm :schema="schema" :state="state"
      class="w-6/12 h-full py-10 md:py-10 flex flex-auto flex-col items-center bg-white rounded-3xl md:rounded-none md:rounded-l-[80px] md:float-right"
      @submit="onSubmit">
      <div class="text-3xl">Sign up</div>
      <div class="w-full pb-5 h-[550px] flex flex-col justify-evenly items-center">
        <UFormGroup label="Full name" name="fullName" class="w-3/4 md:w-1/2">
          <UInput v-model="state.fullName" size="lg"
            class="w-full block rounded-md border-gray-300 outline-none focus:border-electric-violet-500 focus:ring-electric-violet-500 sm:text-sm" />
        </UFormGroup>

        <UFormGroup label="Username" name="userName" class="w-3/4 md:w-1/2">
          <UInput v-model="state.userName" size="lg"
            class="w-full block rounded-md border-gray-300 outline-none focus:border-electric-violet-500 focus:ring-electric-violet-500 sm:text-sm" />
        </UFormGroup>

        <UFormGroup label="Email" name="email" class="w-3/4 md:w-1/2">
          <UInput v-model="state.email" size="lg"
            class="w-full block rounded-md border-gray-300 outline-none focus:border-electric-violet-500 focus:ring-electric-violet-500 sm:text-sm" />
        </UFormGroup>

        <UFormGroup label="Password" name="password" class="w-3/4 md:w-1/2 relative">
          <UInput v-model="state.password" size="lg" :type="iconActive ? 'text' : 'password'" name="password"
            class="w-full block rounded-md border-gray-300 outline-none focus:border-electric-violet-500 focus:ring-electric-violet-500 sm:text-sm" />
          <Icon @click="() => changeIcon()" class="cursor-pointer absolute right-2 top-3" size="20px"
            :name="iconActive ? 'formkit:eye' : 'formkit:hidden'" color="black" />
        </UFormGroup>

        <UFormGroup label="Confirm Password" name="confirmPassword" class="w-3/4 md:w-1/2 relative">
          <UInput v-model="state.confirmPassword" size="lg" :type="iconActive2 ? 'text' : 'password'" name="password2"
            class="w-full block rounded-md border-gray-300 outline-none focus:border-electric-violet-500 focus:ring-electric-violet-500 sm:text-sm" />
          <Icon @click="() => changeIcon2()" class="cursor-pointer absolute right-2 top-3" size="20px"
            :name="iconActive2 ? 'formkit:eye' : 'formkit:hidden'" color="black" />
        </UFormGroup>
      </div>
      <UButton type="submit"
        class="flex justify-center items-center bg-gradient-to-r from-electric-violet-500 to-electric-violet-400 text-white w-3/4 md:w-1/2 h-14 rounded-md text-lg font-semibold">
        Sign up
      </UButton>
      <div class="mt-5">Already have an account?
        <span class="cursor-pointer text-electric-violet-500">
          <NuxtLink to="/login">Log in</NuxtLink>
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