<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'

const { locale, setLocale } = useI18n();

const lang = ref(locale.value.toUpperCase());
watch(locale, () => {
    switch (locale.value) {
        case 'en':
            lang.value = "EN"
            break;
        case 'fa':
            lang.value = "FA"
    }
})

</script>
<template>
    <Menu as="div" class="relative top-5 right-5 float-right">
        <div>
            <MenuButton
                class="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                {{ lang }}
                <ChevronDownIcon class="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
            </MenuButton>
        </div>

        <transition enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95">
            <MenuItems class="absolute right-0 z-10 mt-2 w-36 origin-top-right divide-y divide-gray-200 rounded-md bg-white
                shadow-lg">
                <div class="py-1 cursor-pointer" @click="$i18n.setLocale('en')">
                    <MenuItem v-slot="{ active }">
                    <p
                        :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'group flex items-center px-4 py-2 text-sm']">
                        <img src="../assets/flags/us.png" class="mr-3 h-8 w-8" />
                        English
                    </p>
                    </MenuItem>
                </div>
                <div class="py-1 cursor-pointer" @click="$i18n.setLocale('fa')">
                    <MenuItem v-slot="{ active }">
                    <p
                        :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'group flex items-center px-4 py-2 text-sm']">
                        <img src="../assets/flags/iran.png" class="mr-3 h-8 w-8" />
                        Farsi
                    </p>
                    </MenuItem>
                </div>
            </MenuItems>
        </transition>
    </Menu>
</template>
