<script setup lang="ts">
import { ref, computed } from 'vue';
import colors from '#tailwind-config/theme/colors';
import { useAppConfig } from 'nuxt/app';

const appConfig = useAppConfig();
const user = useCookie('user');

// Define a ref for the primary color
const primaryColor = ref(appConfig.ui.primary);

onMounted(() => {
    if (user.value.selectedColor) {
        appConfig.ui.primary = user.value.selectedColor;
        primaryColor.value = user.value.selectedColor;
    }
});

// Computed properties for primary colors
const primaryColors = computed(() =>
    appConfig.ui.colors
        .filter(color => color !== 'primary')
        .map(color => ({
            value: color,
            text: color,
            hex: colors[color][500], // Use the 500 shade directly
        })),
);

const primary = computed({
    get() {
        return primaryColors.value.find(option => option.value === appConfig.ui.primary);
    },
    set(option) {
        appConfig.ui.primary = option.value;
        primaryColor.value = option.value;
    }
});

const handleColorSelect = (colorValue: string) => {
    primary.value = primaryColors.value.find(option => option.value === colorValue) || primary.value;
    user.value.selectedColor = primary.value?.value;
};
</script>

<template>
    <UPopover class="float-right" mode="hover" :popper="{ strategy: 'absolute' }">
        <template #default="{ open }">
            <UButton color="gray" variant="ghost" class="relative right-10 top-6" square :class="[open && 'bg-gray-50']"
                aria-label="Color picker">
                <UIcon name="i-heroicons-swatch-20-solid" class="w-5 h-5 text-primary-500" />
            </UButton>
        </template>

        <template #panel>
            <div class="p-2 w-32">
                <div class="grid grid-cols-5">
                    <ColorPickerPill v-for="color in primaryColors" @click="() => handleColorSelect(color.value)"
                        :key="color.value" :color="color" :selected="primary" />
                </div>
            </div>
        </template>
    </UPopover>
</template>