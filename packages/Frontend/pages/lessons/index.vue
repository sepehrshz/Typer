<script setup>
import lessons from "~/assets/lessons";
</script>

<template>
    <div class="flex items-center justify-center h-screen">
        <div class="flex flex-wrap justify-center gap-6 overflow-y-auto p-5 rounded-md w-3/4 h-5/6 border-8 border-gray-300 bg-gray-300">
            <div v-for="(lesson, index) in lessons" :key="index" class="flex flex-col items-center cursor-pointer h-36 w-36 bg-white rounded-md transition-all ease-linear hover:scale-110 hover:border-2 hover:border-electric-violet-600">
                <NuxtLink class="w-full flex flex-col items-center" :to="`/lessons/${index + 1}`">
                    <span class="flex justify-center text-white h-6 w-8 rounded-b-md bg-electric-violet-600">{{ index + 1 }}</span>
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