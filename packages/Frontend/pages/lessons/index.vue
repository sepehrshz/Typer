<script setup>
definePageMeta({
    layout: "header",
})

const lessons = ref();

const user = useCookie('user');

const getLessons = async () => {
    lessons.value = await $fetch('http://localhost:3000/lessons', {
        method: 'POST',
        body: {
            userName: user.value.userName,
            accessToken: user.value.accessToken
        }
    })
    console.log(lessons.value);
}
getLessons();

</script>

<template>
    <div v-show="lessons" class="flex justify-center py-8 h-[88vh]">
        <div
            class="flex flex-wrap justify-center gap-6 p-5 overflow-y-auto rounded-lg w-3/4 h-full border-8 border-gray-300 bg-gray-300">
            <div v-for="(lesson, index) in lessons" :key="index"
                :class="[lesson.practice[0]?.isComplete ? 'hover: border-green-500' : 'hover: border-electric-violet-500']"
                class="flex flex-col items-center cursor-pointer h-36 w-36 bg-white rounded-md transition-all
                ease-linear duration-200 hover:scale-110 hover:border-2">
                <NuxtLink class="w-full flex flex-col items-center" :to="`/lessons/${index + 1}`">
                    <span :class="[lesson.practice[0]?.isComplete ? 'bg-green-500'
                        : 'bg-electric-violet-500']" class="flex justify-center text-white h-6 w-8 rounded-b-md">{{
                            index + 1 }}</span> <span class="flex flex-col justify-center items-center h-28 w-full"> {{
                            lesson.name }}
                        <Icon class="mt-4" size="40px" name="fluent-emoji:blue-book" />
                    </span>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<style></style>