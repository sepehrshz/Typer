<script setup lang="ts">
import { z } from "zod"
import type { FormSubmitEvent } from '#ui/types'

const user = useCookie<{
  name: string,
  email: string,
  userName: string,
  avatarIndex: number,
  accessToken: string,
}
>('user');

const avatarIndex = ref(user.value.avatarIndex);

let prevUserName: string = ""

const schema = z.object({
  fullName: z.string(),
  userName: z.string(),
  email: z.string().email('Invalid email'),
  confirmPassword: z.string().refine((value) => value === state.password, {
    message: 'Passwords do not match',
  })
})

type Schema = z.output<typeof schema>

const state = reactive({
  fullName: "",
  userName: "",
  email: "",
  password: "",
  confirmPassword: ""
})

if (user.value) {
  prevUserName = user.value.userName;
  state.fullName = user.value.name;
  state.userName = user.value.userName;
  state.email = user.value.email;
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isChange.value = true;
  editProfile();
}

const editProfile = async () => {
  const response: {
    userName: string
  } = await $fetch('http://localhost:3000/edit', {
    method: 'POST',
    body: {
      prevUserName: prevUserName,
      userName: state.userName,
      email: state.email,
      name: state.fullName,
      password: state.password,
      accessToken: user.value.accessToken,
      avatarIndex: avatarIndex.value,
    }
  })
  prevUserName = response.userName;
  user.value = {
    name: state.fullName,
    email: state.email,
    userName: state.userName,
    accessToken: user.value.accessToken,
    avatarIndex: avatarIndex.value,
  }
  state.password = "";
  state.confirmPassword = "";
}

const isShow = ref(false)
const togglePopup = () => {
  if (isShow.value) isShow.value = false
  else isShow.value = true
}

const iconActive = ref(false)
const changeIcon = () => {
  if (iconActive.value) iconActive.value = false
  else iconActive.value = true
}

const iconActive2 = ref(false)
const changeIcon2 = () => {
  if (iconActive2.value) iconActive2.value = false
  else iconActive2.value = true
}

const isChange = ref(false)

const shouldShowAvatar = ref(false);
const toggleAvatarWindow = (index = 15) => {
  if (shouldShowAvatar.value) {
    avatarIndex.value = index;
  }
  shouldShowAvatar.value = !shouldShowAvatar.value;
}
</script>

<template>
  <div v-show="!user">
    <NuxtLink to="/login">haven't log in?</NuxtLink>
  </div>
  <div v-show="user" class="relative w-full h-[100vh]">
    <NuxtLink to="/">
      <button
        class="absolute top-6 flex justify-center items-center font-semibold left-6 z-10 w-40 h-12 rounded-xl bg-white">
        Back to home
      </button>
    </NuxtLink>
    <div :class="isChange ? 'h-full' : 'h-80'"
      class="absolute w-full transition-all duration-1000 bg-gradient-to-r from-electric-violet-500 to-electric-violet-400">
    </div>
    <div class="absolute top-40 left-1/2 -translate-x-1/2 z-10 w-7/12 h-2/3 shadow-xl rounded-2xl bg-white">
      <div
        class="absolute flex justify-center items-center left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full"
        style="background-image: linear-gradient(to right, rgb(210, 87, 251) , rgb(210, 87, 251));">
        <img class="w-10/12 h-10/12 z-20 rounded-full" :src="`https://avatar.iran.liara.run/public/${avatarIndex}`" />
        <button @click="() => toggleAvatarWindow()"
          class="h-12 w-12 cursor-pointer bg-white rounded-full flex justify-center items-center absolute bottom-2/3 left-2/3 z-30">
          <Icon class="absolute h-5 w-5 cursor-pointer" name="simple-line-icons:pencil" color="black" />
        </button>
      </div>
      <UForm :schema="schema" :state="state" class="w-full h-full flex flex-col mt-5 items-center justify-evenly"
        @submit="onSubmit">
        <div class="w-full h-3/6 flex flex-wrap px-16 mt-10 justify-around items-center">
          <UFormGroup label="New Password" name="password" class="w-5/12 relative">
            <UInput v-model="state.password" placeholder="Minimum 8 charachters" size="lg"
              :type="iconActive ? 'text' : 'password'" name="password"
              class="w-full rounded-md border-gray-300 outline-none focus:border-electric-violet-500 focus:ring-electric-violet-500 sm:text-sm" />
            <Icon @click="() => changeIcon()" class="cursor-pointer absolute right-2 top-3" size="20px"
              :name="iconActive ? 'formkit:eye' : 'formkit:hidden'" color="black" />
          </UFormGroup>

          <UFormGroup label="Confirm New Password" name="confirmPassword" class="w-5/12 relative">
            <UInput v-model="state.confirmPassword" placeholder="Minimum 8 charachters" size="lg"
              :type="iconActive2 ? 'text' : 'password'" name="password"
              class="w-full rounded-md border-gray-300 outline-none focus:border-electric-violet-500 focus:ring-electric-violet-500 sm:text-sm" />
            <Icon @click="() => changeIcon2()" class="cursor-pointer absolute right-2 top-3" size="20px"
              :name="iconActive2 ? 'formkit:eye' : 'formkit:hidden'" color="black" />
          </UFormGroup>

          <UFormGroup label="Full name" name="fullName" class="w-5/12">
            <UInput v-model="state.fullName" size="lg"
              class="w-full rounded-md border-gray-300 outline-none focus:border-electric-violet-500 focus:ring-electric-violet-500 sm:text-sm" />
          </UFormGroup>

          <UFormGroup label="Username" name="userName" class="w-5/12">
            <UInput v-model="state.userName" size="lg"
              class="w-full rounded-md border-gray-300 outline-none focus:border-electric-violet-500 focus:ring-electric-violet-500 sm:text-sm" />
          </UFormGroup>

          <UFormGroup label="Email" name="email" class="w-5/12">
            <UInput v-model="state.email" size="lg"
              class="w-full rounded-md border-gray-300 outline-none focus:border-electric-violet-500 focus:ring-electric-violet-500 sm:text-sm" />
          </UFormGroup>
        </div>
        <div class="flex w-10/12 justify-around">
          <UButton type="submit"
            class="flex justify-center items-center bg-gradient-to-r from-electric-violet-500 to-electric-violet-400 text-white w-5/12 h-14 rounded-md text-lg font-semibold active:scale-90 transition-all duration-500">
            Save changes
          </UButton>
          <UButton type="button" @click="() => togglePopup()" @mouseenter="() => changeColor(true)"
            @mouseleave="() => changeColor(false)"
            class="flex border-2 border-red-500 w-5/12 h-14 rounded-md text-red-500 justify-center items-center bg-white text-lg font-normal hover:bg-gradient-to-r hover:from-red-600 hover:to-red-500 hover:text-white hover:border-none">
            Delete account
          </UButton>
        </div>
      </UForm>
    </div>
    <Transition name="bounce">
      <Avatar v-if="shouldShowAvatar" @close-window="toggleAvatarWindow" />
    </Transition>
    <DeleteAccountPopup :isShow="isShow" :userName="userName" @updateIsShow="isShow = $event" />
  </div>
</template>