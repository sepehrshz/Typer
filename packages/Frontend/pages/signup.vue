<script setup lang="ts">
import { z } from "zod"
import type { FormSubmitEvent } from '#ui/types'
import { useRouter } from 'vue-router'
const localePath = useLocalePath();
const { t, locale } = useI18n();
const toast = useToast();
const router = useRouter()
const schema = z.object({
  fullName: z.string().min(4, t('String must contain at least 4 character')),
  userName: z.string().min(4, t('String must contain at least 4 character')),
  email: z.string().email(t('invalid-email')),
  password: z.string().min(8, t('must-be-at-least-8-characters')),
  confirmPassword: z.string().min(8, t('must-be-at-least-8-characters'))
    .refine((value) => value === state.password, {
      message: t('passwords-do-not-match'),
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
    case t('email-has-already-taken'):
      toast.add({ title: response, color: 'red' })
      break;
    case t('username-has-already-taken'):
      toast.add({ title: response, color: 'red' })
      break;
    case t('successfull'):
      toast.add({ title: t('signup-successfully'), color: 'green' })
      router.push('/login');
      break;
    default:
      toast.add({ title: t('something-went-wrong'), color: 'red' })
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
    class="flex px-16 pb-10 pt-20 items-center justify-between w-full h-[100vh] bg-gradient-to-r from-primary from-20% to-primary-300 md:to-primary-200 md:pb-0 md:px-0 md:pt-0">
    <NuxtLink :to="localePath('/')">
      <button :class="locale === 'en' ? '' : 'text-sm'"
        class="absolute top-4 left-4 flex justify-center items-center z-10 w-32 h-10 md:top-6 md:left-6 md:w-40 md:h-12 rounded-xl bg-white">
        {{ t('Back to home') }}
      </button>
    </NuxtLink>
    <div class="w-6/12 hidden md:flex flex-col items-center justify-center">
      <img class="w-[580px]" src="../assets/signup-pic.png">
    </div>
    <UForm :schema="schema" :state="state"
      class="w-6/12 h-full py-10 md:py-10 flex flex-auto flex-col items-center bg-white rounded-3xl md:rounded-none md:rounded-l-[80px] md:float-right"
      @submit="onSubmit">
      <div class="text-3xl">{{ t('sign-up') }}</div>
      <div class="w-full pb-5 h-[550px] flex flex-col justify-evenly items-center">
        <UFormGroup name="fullName" class="w-3/4 md:w-1/2">
          <label :class="locale === 'en' ? 'float-left mb-2 ml-2' : 'float-right mr-2 mb-2'">{{ t('Full name')
            }}</label>
          <UInput v-model="state.fullName" size="lg"
            class="w-full block rounded-md border-gray-300 outline-none focus:border-primary focus:ring-primary sm:text-sm" />
        </UFormGroup>

        <UFormGroup name="userName" class="w-3/4 md:w-1/2">
          <label :class="locale === 'en' ? 'float-left mb-2 ml-2' : 'float-right mr-2 mb-2'">{{ t('Username')
            }}</label>
          <UInput v-model="state.userName" size="lg"
            class="w-full block rounded-md border-gray-300 outline-none focus:border-primary focus:ring-primary sm:text-sm" />
        </UFormGroup>

        <UFormGroup name="email" class="w-3/4 md:w-1/2">
          <label :class="locale === 'en' ? 'float-left mb-2 ml-2' : 'float-right mr-2 mb-2'">{{ t('Email') }}</label>
          <UInput v-model="state.email" size="lg"
            class="w-full block rounded-md border-gray-300 outline-none focus:border-primary focus:ring-primary sm:text-sm" />
        </UFormGroup>

        <UFormGroup name="password" class="w-3/4 md:w-1/2 relative">
          <label :class="locale === 'en' ? 'float-left mb-2 ml-2' : 'float-right mr-2 mb-2'">{{ t('Password') }}</label>
          <UInput v-model="state.password" size="lg" :type="iconActive ? 'text' : 'password'" name="password"
            class="w-full block rounded-md border-gray-300 outline-none focus:border-primary focus:ring-primary sm:text-sm" />
          <Icon @click="() => changeIcon()" class="cursor-pointer absolute top-1"
            :class="locale === 'en' ? 'right-2' : 'left-2'" size="20px"
            :name="iconActive ? 'formkit:eye' : 'formkit:hidden'" color="black" />
        </UFormGroup>

        <UFormGroup name="confirmPassword" class="w-3/4 md:w-1/2 relative">
          <label :class="locale === 'en' ? 'float-left mb-2 ml-2' : 'float-right mr-2 mb-2'">{{ t('Confirm Password')
            }}</label>
          <UInput v-model="state.confirmPassword" size="lg" :type="iconActive2 ? 'text' : 'password'" name="password2"
            class="w-full block rounded-md border-gray-300 outline-none focus:border-primary focus:ring-primary sm:text-sm" />
          <Icon @click="() => changeIcon2()" class="cursor-pointer absolute top-1"
            :class="locale === 'en' ? 'right-2' : 'left-2'" size="20px"
            :name="iconActive2 ? 'formkit:eye' : 'formkit:hidden'" color="black" />
        </UFormGroup>
      </div>
      <UButton type="submit"
        class="flex justify-center items-center bg-gradient-to-r from-primary to-primary-400 text-white w-3/4 md:w-1/2 h-14 rounded-md text-lg">
        {{ t('sign-up') }} </UButton>
      <div class="mt-5">{{ t('already-have-an-account') }}
        <span class="cursor-pointer text-primary">
          <NuxtLink :to="localePath('/login')">{{ t('log-in') }}</NuxtLink>
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