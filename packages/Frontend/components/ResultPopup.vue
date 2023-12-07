<script setup lang="ts">
import { defineProps } from "vue";
import { toRefs } from '@vueuse/core'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { CheckIcon } from '@heroicons/vue/24/outline'
import type { TypeInfo } from "@/types/index"

const props = defineProps<{
 typeInfo:TypeInfo,
 isWpm:boolean
}>();

const {resultWindow, startTime, mistakes, cpmTag, wpmTag} = toRefs(props.typeInfo)

</script>

<template>
  <TransitionRoot as="template" :show="resultWindow">
    <Dialog as="div" class="relative z-10" @close="resultWindow = false">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>
      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div>
                <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-electric-violet-100">
                  <CheckIcon class="h-6 w-6 text-electric-violet-600" aria-hidden="true" />
                </div>
                <div class="mt-3 text-center sm:mt-5">
                  <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">Test finish</DialogTitle>
                  <div class="mt-8 px-10 bg-gray-200 rounded-md py-8 flex flex-col sm:px-4 sm:flex-row sm:justify-around">
                    <span class="flex flex-row justify-between sm:flex sm:flex-row sm:items-center sm:justify-normal"><span class="flex items-center"><Icon size="18px" name="fluent-emoji:eleven-thirty" />&nbsp;Time: </span>&nbsp;{{ startTime }}s</span>
                    <span class="flex flex-row justify-between"><span class="flex items-center"><Icon size="18px" name="fluent-emoji:cross-mark" />&nbsp;Mistakes: </span>&nbsp;{{ mistakes }}</span>
                    <span v-if="isWpm" class="flex flex-row justify-between"><span class="flex items-center"><Icon size="18px" name="fluent-emoji:antenna-bars" />&nbsp;WPM: </span>&nbsp;{{ wpmTag }}</span>
                    <span class="flex flex-row justify-between"><span class="flex items-center"><Icon size="18px" name="fluent-emoji:bar-chart" />&nbsp;CPM: </span>&nbsp;{{ cpmTag }}</span>
                  </div>
                </div>
              </div>
              <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button type="button" class="outline-none inline-flex w-full justify-center rounded-md bg-electric-violet-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-electric-violet-700  sm:col-start-2 sm:text-sm">Go to dashboard</button>
                <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50  sm:col-start-1 sm:mt-0 sm:text-sm" @click="$emit('tryAgain')">Try again</button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style>

</style>