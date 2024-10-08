<script setup lang="ts">
import { defineProps } from "vue";
import { toRefs } from '@vueuse/core'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { CheckIcon } from '@heroicons/vue/24/outline'
import type { TypeInfo } from "@/types/index"
import TestReport from "./TestReport.vue";
import type { _backgroundColor } from "#tailwind-config/theme";
const { t, locale } = useI18n();
const props = defineProps<{
  typeInfo: TypeInfo,
  isLesson: boolean,
  lessonId: number,
}>();

const { resultWindow, startTime, mistakes, wpmTag } = toRefs(props.typeInfo)

</script>

<template>
  <TransitionRoot as="template" :show="resultWindow">
    <Dialog as="div" class="relative z-10" @close="resultWindow = false">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
        leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>
      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild class="w-3/5" as="template" enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel
              class="relative w-5/6 lg:w-2/3 flex flex-col md:flex-row gap-10 transform overflow-hidden rounded-lg bg-white px-4 pt-0 text-left shadow-xl transition-all h-full md:h-96 mt-28 mb-12 md:mb-0 md:mt-12">
              <div class="w-full md:w-1/2 flex flex-col justify-center p-5">
                <div>
                  <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                    <CheckIcon class="h-6 w-6 text-primary-600" aria-hidden="true" />
                  </div>
                  <div class="mt-3 text-center sm:mt-5">
                    <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">{{ t('Test finish') }}
                    </DialogTitle>
                    <div :style="locale == 'en' ? 'direction: ltr' : 'direction: rtl'"
                      class="mt-8 px-10 bg-gray-200 rounded-md py-8 flex flex-col sm:px-4 sm:flex-row sm:justify-around">
                      <span class="flex flex-row justify-between sm:flex sm:flex-row sm:items-center sm:justify-normal">
                        <span class="flex items-center">
                          <Icon size="18px" name="fluent-emoji:eleven-thirty" />&nbsp;{{ t('Time:') }}
                        </span>&nbsp;{{ startTime }}s</span>
                      <span class="flex flex-row justify-between"><span class="flex items-center">
                          <Icon size="18px" name="fluent-emoji:cross-mark" />&nbsp;{{ t('Mistakes:') }}
                        </span>&nbsp;{{ mistakes }}</span>
                      <span class="flex flex-row justify-between"><span class="flex items-center">
                          <Icon size="18px" name="fluent-emoji:antenna-bars" />&nbsp;{{ t('WPM:') }}
                        </span>&nbsp;{{ wpmTag }}
                        <UTooltip
                          :ui="{ arrow: { background: 'before:bg-primary', ring: 'before:ring-1 before:ring-gray-200' }, ring: 'ring-1 ring-primary' }"
                          :text="t('Word per minute')" :popper="{ arrow: true, placement: 'top' }">
                          <img class="h-4 w-4 mt-1" :class="locale === 'en' ? 'ml-1' : 'mr-1'"
                            src="../assets/question.png" />
                        </UTooltip>
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  class="flex flex-col md:flex-row mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <div
                    class="outline-none inline-flex w-full justify-center rounded-md bg-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-600  sm:col-start-2 sm:text-sm">
                    <NuxtLink to="/lessons" class="w-full h-full flex justify-center items-center outline-none sty">
                      <button type="button" class="outline-none focus:outline-none">
                        {{ t('Lessons page') }}
                      </button>
                    </NuxtLink>
                  </div>
                  <button type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50  sm:col-start-1 sm:mt-0 sm:text-sm"
                    @click="$emit('tryAgain')">{{ t('Try again') }}</button>
                </div>
              </div>
              <div class="w-1/2 flex justify-center -mt-20 md:mt-0 mb-4 items-center">
                <LessonReport v-if="isLesson" :lessonId="Number(props.lessonId)" />
                <TestReport v-else />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style></style>