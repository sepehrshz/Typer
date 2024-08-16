<script setup lang="ts">
const emit = defineEmits(['closeWindow']);

let avatarsIndex = [15, 46, 41, 4, 43, 38, 8, 37, 13, 19, 45, 51, 88, 55, 57, 62, 95, 85, 64, 90];

const activeIndex = ref<number>();
const toggleActive = (index: number) => {
    activeIndex.value = index;
}
</script>
<template>
    <div class="absolute sm:border-[16px] border-gray-400 p-8 pt-2 flex flex-wrap justify-around overflow-y-auto 
        top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 h-5/6 w-5/6 sm:w-2/3 rounded-lg bg-gray-400">
        <button @click="() => $emit('closeWindow', activeIndex)"
            class="absolute flex justify-center items-center left-3 top-3 sm:left-1 sm:top-1 h-8 sm:h-10 w-8 sm:w-10 bg-white rounded-md transition-all duration-200 active:scale-110">
            <Icon name="ci:close-lg" />
        </button>
        <div v-for="n in avatarsIndex" @click="() => toggleActive(n)"
            class="h-20 w-20 sm:h-36 sm:w-36 box-border mx-2 my-3 cursor-pointer bg-white rounded-full"
            :class="[activeIndex != n ? 'transition-all duration-200 hover:scale-110 active:scale-125' : 'border-[6px] sm:border-8 border-primary transition-all duration-200 scale-[1.2]']">
            <img class="box-border" :src="`https://avatar.iran.liara.run/public/${n}`" />
        </div>
    </div>
</template>
<style>
.bounce-enter-from .bounce-leave-to {
    top: 50%;
    left: 50%;
    translate: -50% -50%;
}

.bounce-enter-active {
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    animation: bounce-in 1s;
}

.bounce-leave-active {
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    animation: bounce-in 1s reverse;
}

@keyframes bounce-in {
    0% {
        transform: scale(0);
    }

    60% {
        transform: scale(1.1);
    }

    100% {
        transform: scale(1);
    }
}
</style>