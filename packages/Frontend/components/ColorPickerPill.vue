<template>
    <UTooltip v-if="color.value !== 'green' && color.value !== 'lime' && color.value !== 'yellow'" :text="color.value"
        class="capitalize" :open-delay="500">
        <UButton v-if="color.value !== 'green' && color.value !== 'lime' && color.value !== 'yellow'" color="white"
            square :ui="{
                color: {
                    white: {
                        solid: 'ring-0 bg-gray-100 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800',
                        ghost: 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }
                }
            }" :variant="color.value === selected.value ? 'solid' : 'ghost'">
            <span class="inline-block w-3 h-3 rounded-full" :style="{ backgroundColor: color.hex }" />
        </UButton>
    </UTooltip>
</template>

<script setup lang="ts">
const props = defineProps<{
    color: { value: string; hex: string };
    selected: { value: string };
}>();
</script>