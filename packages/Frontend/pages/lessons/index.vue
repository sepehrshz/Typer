<script setup>
import lessons from "~/assets/lessons";
definePageMeta({
  layout: "header",
})
</script>

<template>
    <div class="flex justify-center py-8 h-[88vh]">
        <div class="flex flex-wrap justify-center gap-6 p-5 overflow-y-auto rounded-lg w-3/4 h-full border-8 border-gray-300 bg-gray-300">
            <div v-for="(lesson, index) in lessons" :key="index" class="flex flex-col items-center cursor-pointer h-36 w-36 bg-white rounded-md transition-all ease-linear hover:scale-110 hover:border-2 hover:border-electric-violet-500">
                <NuxtLink class="w-full flex flex-col items-center" :to="`/lessons/${index + 1}`">
                    <span class="flex justify-center text-white h-6 w-8 rounded-b-md bg-electric-violet-500">{{ index + 1 }}</span>
                    <span class="flex flex-col justify-center items-center h-28 w-full">
                        {{ lesson.name }}
                        <Icon class="mt-4" size="40px" name="fluent-emoji:blue-book" />
                    </span>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<style>

</style>