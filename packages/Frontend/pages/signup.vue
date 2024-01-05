<script setup lang="ts">
    import { z } from "zod"
    import type { FormSubmitEvent } from '#ui/types'

    const schema = z.object({
      fullName: z.string(),
      userName: z.string(),
      email: z.string().email('Invalid email'),
      password: z.string().min(8, 'Must be at least 8 characters'),
      confirmPassword: z.string().min(8, 'Must be at least 8 characters')
        .refine((value) => value === state.password,{
        message: 'Passwords do not match',
        })
    })

    type Schema = z.output<typeof schema>

    const state = reactive({
      fullName: undefined,
      userName: undefined,
      email: undefined,
      password: undefined,
      confirmPassword: undefined
    })

    async function onSubmit (event: FormSubmitEvent<Schema>) {
      console.log(event.data)
      
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
    <div class="flex items-center justify-between w-full h-[100vh] bg-gradient-to-r from-electric-violet-500 from-20% to-electric-violet-200">
        <div class="w-6/12 flex flex-col items-center justify-center">
            <span class="text-white text-4xl w-5/6">Typer</span>
            <img class="w-[580px]" src="../assets/signup-pic.png">
        </div>
        <UForm :schema="schema" :state="state" class="w-6/12 h-full py-10 flex flex-col  items-center float-right bg-white rounded-l-[80px]" @submit="onSubmit">
            <div class="text-3xl">Sign up</div>
            <div class="w-full pb-5 h-[550px] flex flex-col justify-evenly items-center">
                <UFormGroup label="Full name" name="fullName" class="w-1/2">
                  <UInput v-model="state.fullName" size="lg" class="w-full block rounded-md border-gray-300 outline-none focus:border-electric-violet-500 focus:ring-electric-violet-500 sm:text-sm"/>
                </UFormGroup>

                <UFormGroup label="Username" name="userName" class="w-1/2">
                  <UInput v-model="state.userName" size="lg" class="w-full block rounded-md border-gray-300 outline-none focus:border-electric-violet-500 focus:ring-electric-violet-500 sm:text-sm"/>
                </UFormGroup>

                <UFormGroup label="Email" name="email" class="w-1/2">
                  <UInput v-model="state.email" size="lg" class="w-full block rounded-md border-gray-300 outline-none focus:border-electric-violet-500 focus:ring-electric-violet-500 sm:text-sm"/>
                </UFormGroup>
                
                <UFormGroup label="Password" name="password"  class="w-1/2 relative">
                  <UInput v-model="state.password" size="lg" :type="iconActive ? 'text' : 'password'" name="password" class="w-full block rounded-md border-gray-300 outline-none focus:border-electric-violet-500 focus:ring-electric-violet-500 sm:text-sm"/>
                  <Icon @click="() => changeIcon()" class="cursor-pointer absolute right-2 top-3" size="20px" :name="iconActive ? 'formkit:eye' : 'formkit:hidden'" color="black"/>
                </UFormGroup>
                
                <UFormGroup label="Confirm Password" name="confirmPassword"  class="w-1/2 relative">
                  <UInput v-model="state.confirmPassword" size="lg" :type="iconActive2 ? 'text' : 'password'" name="password2" class="w-full block rounded-md border-gray-300 outline-none focus:border-electric-violet-500 focus:ring-electric-violet-500 sm:text-sm"/>
                  <Icon @click="() => changeIcon2()" class="cursor-pointer absolute right-2 top-3" size="20px" :name="iconActive2 ? 'formkit:eye' : 'formkit:hidden'" color="black"/>
                </UFormGroup>
            </div>
            <UButton type="submit" class="flex justify-center items-center bg-gradient-to-r from-electric-violet-500 to-electric-violet-400 text-white w-1/2 h-14 rounded-md text-lg font-semibold">
              Sign in
            </UButton>
            <div class="mt-5">Already have an account? 
                <span class="cursor-pointer text-electric-violet-500">
                    <NuxtLink to="./login">Log in</NuxtLink>
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