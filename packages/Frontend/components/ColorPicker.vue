<script setup lang="ts">
import { ref, computed } from 'vue';
import colors from '#tailwind-config/theme/colors';
import { useAppConfig } from 'nuxt/app';

const appConfig = useAppConfig();
const primaryColorCookie = useCookie('nuxt-ui-primary');


// Define a ref for the primary color
const primaryColor = ref(appConfig.ui.primary);

onMounted(() => {
    if (primaryColorCookie.value) {
        appConfig.ui.primary = primaryColorCookie.value;
        primaryColor.value = primaryColorCookie.value;
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
        }))
);

const primary = computed({
    get() {
        return primaryColors.value.find(option => option.value === appConfig.ui.primary);
    },
    set(option) {
        appConfig.ui.primary = option.value; // Update the primary color in app config
        primaryColor.value = option.value; // Update the local ref for reactivity
    }
});

const handleColorSelect = (colorValue: string) => {
    primary.value = primaryColors.value.find(option => option.value === colorValue) || primary.value;
    primaryColorCookie.value = primary.value?.value;
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
            <div class="p-2 w-32 mr-20">
                <div class="grid grid-cols-5 gap-px">
                    <ColorPickerPill v-for="color in primaryColors" @click="() => handleColorSelect(color.value)"
                        :key="color.value" :color="color" :selected="primary" />
                </div>
            </div>
        </template>
    </UPopover>
</template>
