<script setup lang="ts">
    import { z } from "zod"
    import type { FormSubmitEvent } from '#ui/types'

    const schema = z.object({
      fullName: z.string(),
      userName: z.string(),
      email: z.string().email('Invalid email'),
      password: z.string().min(8, 'Must be at least 8 characters'),
    })

    type Schema = z.output<typeof schema>

    const state = reactive({
      fullName: "Sepehr Shirazi",
      userName: "Sepehrshz",
      email: "sepehrshirazi27@gmail.com",
      password: "12345678"
    })

    async function onSubmit (event: FormSubmitEvent<Schema>) {
      console.log(event.data)
      isChange.value = true
    }

    const iconActive = ref(false)
    const changeIcon = () => {
        if (iconActive.value) iconActive.value = false
        else iconActive.value = true
    }

    const isChange = ref(false)

    const isHover = ref(false)
    const changeColor = (x : boolean) => {
      if (x) isHover.value = true
      else isHover.value = false
    }
</script>

<template>
    <div class="relative w-full h-[100vh]">
        <div class="absolute top-6 flex justify-center items-center font-semibold left-6 z-10 w-40 h-12 rounded-xl bg-white">Edit your profile</div>
        <div :class="isChange ? 'h-full' : 'h-80'" class="absolute w-full transition-all duration-1000 bg-gradient-to-r from-electric-violet-500 to-electric-violet-400"></div>
        <div class="absolute top-40 left-1/2 -translate-x-1/2 z-10 w-7/12 h-2/3 shadow-xl rounded-2xl bg-white">
            <div class="absolute flex justify-center items-center left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full" style="background-image: linear-gradient(to right, rgb(210, 87, 251) , rgb(210, 87, 251));">   
                <img class="w-10/12 h-10/12 z-20 rounded-full" src="../assets/SepehrFunko.jpg">
            </div>
            <UForm :schema="schema" :state="state" class="w-full h-full flex flex-col mt-5 items-center justify-evenly" @submit="onSubmit">
                <div class="w-full h-3/6 flex flex-wrap px-16 mt-10 justify-around items-center">
                    <UFormGroup label="Full name" name="fullName" class="w-5/12">
                      <UInput v-model="state.fullName" size="lg" class="w-full rounded-md border-gray-300 outline-none focus:border-electric-violet-500 focus:ring-electric-violet-500 sm:text-sm"/>
                    </UFormGroup>
                
                    <UFormGroup label="Username" name="userName" class="w-5/12">
                      <UInput v-model="state.userName" size="lg" class="w-full rounded-md border-gray-300 outline-none focus:border-electric-violet-500 focus:ring-electric-violet-500 sm:text-sm"/>
                    </UFormGroup>
                
                    <UFormGroup label="Email" name="email" class="w-5/12">
                      <UInput v-model="state.email" size="lg" class="w-full rounded-md border-gray-300 outline-none focus:border-electric-violet-500 focus:ring-electric-violet-500 sm:text-sm"/>
                    </UFormGroup>

                    <UFormGroup label="Password" name="password"  class="w-5/12 relative">
                      <UInput v-model="state.password" size="lg" :type="iconActive ? 'text' : 'password'" name="password" class="w-full rounded-md border-gray-300 outline-none focus:border-electric-violet-500 focus:ring-electric-violet-500 sm:text-sm"/>
                      <Icon @click="() => changeIcon()" class="cursor-pointer absolute right-2 top-3" size="20px" :name="iconActive ? 'formkit:eye' : 'formkit:hidden'" color="black"/>
                    </UFormGroup>
                </div>
                <div class="flex w-10/12 justify-around">
                  <UButton type="submit" class="flex justify-center items-center bg-gradient-to-r from-electric-violet-500 to-electric-violet-400 text-white w-5/12 h-14 rounded-md text-lg font-semibold active:scale-90 transition-all duration-500">
                    Save changes
                  </UButton>
                  <UButton type="submit" @mouseenter="() => changeColor(true)" @mouseleave="() => changeColor(false)" class="flex border-2 border-electric-violet-500 w-5/12 h-14 rounded-md text-black justify-center items-center bg-white text-lg font-normal hover:bg-gradient-to-r hover:from-electric-violet-500 hover:to-electric-violet-400 hover:text-white hover:border-none">
                    Back to home page
                    <Icon size="20px" name="formkit:arrowright" :color="isHover ? 'white' : 'black'"/>
                  </UButton>
                </div>
            </UForm>
        </div>
    </div>
</template>
