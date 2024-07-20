<script setup lang="ts">
definePageMeta({
  layout: "header",
})
// import paragraphs from "../assets/paragraphs";
import { ref } from "vue";
import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue'
import { get, onClickOutside, useScroll } from '@vueuse/core'
import ResultPopup from "@/components/ResultPopup.vue"
import type { TypeInfo } from "@/types/index"
const { locale, setLocale, t } = useI18n();
// Define reactive variables
const timer = ref<NodeJS.Timeout | undefined>(undefined);
const charIndex = ref<number>(0)
const isFirst = ref<boolean>(true)
const enabledDetail = ref<boolean>(true)
const isTyping = ref<boolean>(false)
const inputField = ref<string>("")
const inputFieldRef = ref()
const typedChar = ref<string>("")
const toggleId = ref('MEDIUM')
const typeBox = ref()
const { y } = useScroll(typeBox, { behavior: 'smooth' })
const charNum = ref<number>(250)
const paragraphInfo = ref<{ id: number; text: string }>({ id: 0, text: "" });
const wpm = ref(0);
let testDate: string;
const toast = useToast();

const typeInfo = ref<TypeInfo>({
  resultWindow: false,
  startTime: 0,
  mistakes: 0,
  wpmTag: 0,
  accuracy: 0
});

const user = useCookie<{
  userName: string,
  accessToken: string
}
>('user');

onBeforeMount(() => {
  getParagraph()
})

onMounted(() => {
  if (!user.value) {
    const text = t('Login to save your scores')
    toast.add({ title: text, color: 'electric-violet' })
  }
})

const toggleParagraphSize = (id: string) => {
  toggleId.value = id;
  getParagraph();
}

const loadParagraph = computed<
  {
    letter: string;
    active: boolean;
    status: "correct" | "incorrect" | "neutral";
  }[]
>(() =>
  paragraphInfo.value.text
    .split("")
    .map((v) => ({ letter: v, active: false, status: "neutral" }))
)
const makeTimer = () => {
  timer.value = setInterval(initTimer, 1000);
}
const initTyping = () => {
  typedChar.value = inputField.value.split("")[charIndex.value];
  if (charIndex.value < loadParagraph.value.length) {
    if (!isTyping.value) {
      makeTimer();
      isTyping.value = true;
    }
    if (typedChar.value == null || undefined) {
      if (charIndex.value > 0) {
        charIndex.value--;
        if (loadParagraph.value[charIndex.value].status === "incorrect") {
          typeInfo.value.mistakes--;
        }
        loadParagraph.value[charIndex.value].status = "neutral";
      }
      loadParagraph.value[charIndex.value + 1].active = false;
    }
    else {
      if (loadParagraph.value[charIndex.value].letter == typedChar.value) {
        if (isFirst.value) loadParagraph.value[charIndex.value].status = "correct";
        charIndex.value++;
        loadParagraph.value[charIndex.value - 1].active = false;
        isFirst.value = true
      }
      else {
        if (isFirst.value) {
          typeInfo.value.mistakes++;
          loadParagraph.value[charIndex.value].status = "incorrect";
          isFirst.value = false
        }
        inputField.value = inputField.value.slice(0, -1)
      }
    }
    if (charIndex.value != loadParagraph.value.length) {
      loadParagraph.value[charIndex.value].active = true;
    }
    let wpm = Math.round(
      ((charIndex.value - typeInfo.value.mistakes) / 5 / (typeInfo.value.startTime)) * 60
    );

    wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;

    typeInfo.value.wpmTag = wpm;
  }
  if (charIndex.value == loadParagraph.value.length) {
    loadParagraph.value[charIndex.value - 1].active = false;
    typeInfo.value.resultWindow = true;
    testDate = new Date().toLocaleDateString('en-us', { year: 'numeric', month: '2-digit', day: '2-digit' });
    saveInfo();
    clearInterval(timer.value);
    inputField.value = "";
  }
  if (charIndex.value > charNum.value) {
    y.value += 150
    charNum.value += 250
  }
};

const initTimer = () => {
  typeInfo.value.startTime++;
  wpm.value = Math.round(
    (charIndex.value - typeInfo.value.mistakes) / 5 / (typeInfo.value.startTime)) * 60;
  typeInfo.value.accuracy = Number(((charIndex.value - typeInfo.value.mistakes) / charIndex.value * 100).toFixed(0));
}

const resetGame = () => {
  typeInfo.value.resultWindow = false;
  getParagraph();
  clearInterval(timer.value)
  typeInfo.value.startTime = 0
  charIndex.value = 0
  typeInfo.value.mistakes = 0
  isTyping.value = false
  inputField.value = ""
  typeInfo.value.wpmTag = 0
  typeInfo.value.accuracy = 0;
  y.value = 0
  charNum.value = 0
  focusInput()
};

const focusInput = () => {
  inputFieldRef.value.focus()
}

onClickOutside(inputFieldRef, focusInput)

const getParagraph = async () => {
  const response: { id: number, text: string } =
    await $fetch('http://localhost:3000/getParagraph', {
      method: 'POST',
      body: {
        size: toggleId.value,
      }
    });
  paragraphInfo.value.id = response.id;
  paragraphInfo.value.text = response.text;
}

const saveInfo = async () => {
  const response =
    await $fetch('http://localhost:3000', {
      method: 'POST',
      body: {
        userId: user.value.userName,
        speed: typeInfo.value.wpmTag,
        accessToken: user.value.accessToken,
        paragraphId: paragraphInfo.value.id,
        accuracy: typeInfo.value.accuracy,
        date: testDate,
      }
    })
  console.log(response)
}
</script>

<template>
  <div>
    <LangSelector />
    <div class="w-full h-[88vh] flex justify-center items-center p-[35px] bg-white">
      <!-- Typing box -->
      <input autofocus @input="initTyping" ref="inputFieldRef" v-model="inputField" type="text"
        class="opacity-0 z-0 absolute hidden sm:block" />
      <div class="hidden rounded-xl w-[750px] border-2 border-gray-400 flex-col items-center sm:flex">
        <!-- Typing box header -->
        <div class="bg-gray-400 w-full h-16 rounded-t-lg flex justify-around items-center">
          <SwitchGroup as="div" class="flex items-center">
            <SwitchLabel as="span" class="mr-3">
              <span class="text-sm font-medium text-grey-900">{{ t('time-and-speed') }}</span>
            </SwitchLabel>
            <Switch v-model="enabledDetail"
              :class="[enabledDetail ? 'bg-electric-violet-500' : 'bg-gray-200', 'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none']">
              <span class="sr-only">use-setting</span>
              <span
                :class="[enabledDetail ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']">
                <span
                  :class="[enabledDetail ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']"
                  aria-hidden="true">
                  <svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                    <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2"
                      stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
                <span
                  :class="[enabledDetail ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']"
                  aria-hidden="true">
                  <svg class="h-3 w-3 text-electric-violet-600" fill="currentColor" viewBox="0 0 12 12">
                    <path
                      d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                  </svg>
                </span>
              </span>
            </Switch>
          </SwitchGroup>
          <span class="isolate inline-flex rounded-md">
            <button @click="toggleParagraphSize('SMALL')" type="button"
              :class="toggleId === 'SMALL' ? 'bg-electric-violet-500 text-white border-none' : 'bg-white hover:bg-gray-50'"
              class="relative inline-flex items-center rounded-l-md rtl:rounded-r-md border border-gray-400 px-4 py-2 text-sm font-medium focus:outline-none">{{
                t('small') }}</button>
            <button @click="toggleParagraphSize('MEDIUM')" type="button"
              :class="toggleId === 'MEDIUM' ? 'bg-electric-violet-500 text-white border-none' : 'bg-white hover:bg-gray-50'"
              class="relative -ml-px inline-flex items-center border border-gray-400 px-4 py-2 text-sm font-medium focus:outline-none">{{
                t('medium') }}</button>
            <button @click="toggleParagraphSize('LARGE')" type="button"
              :class="toggleId === 'LARGE' ? 'bg-electric-violet-500 text-white border-none' : 'bg-white hover:bg-gray-50'"
              class="relative -ml-px inline-flex items-center rounded-r-md border border-gray-400 px-4 py-2 text-sm font-medium focus:outline-none">{{
                t('large') }}</button>
          </span>
        </div>
        <!-- Progress bar -->
        <UProgress v-if="enabledDetail" class="w-11/12 h-16 mt-3"
          :value="Math.floor((charIndex / loadParagraph.length) * 100)"
          :color="(typeInfo.wpmTag > 20 && typeInfo.startTime > 15) ? 'red' : 'electric-violet'" size="lg" indicator>
          <template #indicator="{ percent }">
            <div :style="{ width: `${percent}%` }">
              <div
                :class="(typeInfo.wpmTag > 20 && typeInfo.startTime > 15) ? 'text-red-600 text-xl' : 'text-purple-500'"
                class="ml-5 text-lg transition-all ease-linear flex items-center justify-end">
                <div v-if="(typeInfo.wpmTag > 20 && typeInfo.startTime > 15)" class="fire">
                  <div class="flames">
                    <div class="flame"></div>
                    <div class="flame"></div>
                    <div class="flame"></div>
                    <div class="flame"></div>
                  </div>
                </div>
                <div class="ml-1">{{ Math.floor(percent) }}%</div>
              </div>
            </div>
          </template>
        </UProgress>
        <!-- Paragraph text -->
        <div ref="typeBox" class="overflow-y-auto overflow-x-hidden mt-2 text-2xl max-h-96 px-5">
          <span v-for="(word, index) in loadParagraph" :key="index" class="px-[0.5px]" :class="[
            word.active ? 'text-electric-violet-500 border-b-[3px] border-electric-violet-500 bg-electric-violet-100' : '',
            word.status === 'correct' ? 'text-green-600' : '',
            word.status === 'incorrect' ? 'text-red-600 bg-pink-200' : ''
          ]">
            {{ word.letter }}
          </span>
        </div>
        <!-- Typing details -->
        <div class="mt-6 w-11/12 flex py-6 justify-center flex-row border-t-2 border-t-gray-400">
          <ul v-if="enabledDetail" class="flex items-center w-full">
            <li :style="locale == 'en' ? 'direction: ltr' : 'direction: rtl'"
              class="flex h-5 mr-5 list-none relative items-center">
              <p class="text-lg">{{ t('Time:') }}</p>
              <span class="block text-[20px] ml-2">&nbsp;{{ typeInfo.startTime }}s</span>
            </li>
            <li :style="locale == 'en' ? 'direction: ltr' : 'direction: rtl'"
              class="flex h-5 list-none relative items-center px-5 border-l-2 border-electric-violet-500">
              <p class="text-lg">{{ t('WPM:') }}</p>
              <span class="block text-[20px] ml-2">&nbsp;{{ typeInfo.wpmTag }}</span>
            </li>
            <li :style="locale == 'en' ? 'direction: ltr' : 'direction: rtl'"
              class="flex h-5 list-none relative items-center px-5 border-l-2 border-electric-violet-500">
              <p class="text-lg">{{ t('Accuracy:') }}</p>
              <span class="block text-[20px] ml-2">&nbsp;{{ typeInfo.accuracy }}</span>
            </li>
            <li :style="locale == 'en' ? 'direction: ltr' : 'direction: rtl'"
              class="flex h-5 list-none relative items-center px-5 border-l-2 border-electric-violet-500">
              <p class="text-lg">{{ t('Mistakes:') }}</p>
              <span class="block text-[20px] ml-2">&nbsp;{{ typeInfo.mistakes }}</span>
            </li>
          </ul>
          <button @click="resetGame"
            class="outline-none border-none w-28 text-white py-2 text-sm font-semibold cursor-pointer rounded-md bg-electric-violet-500 transition-all hover:bg-electric-violet-600 active:scale-90">
            {{ t('Try again') }}</button>
        </div>
      </div>
      <!-- Result pop-up -->
      <ResultPopup :type-info="typeInfo" @try-again="resetGame" :isLesson="false" />
    </div>
  </div>

</template>

<style>
::selection {
  color: #fff;
  background: #b800e6;
}

.fire {
  display: inline-block;
  transform: translate(0%, 40%);
  height: 18px;
  width: 18px;
}

.fire .flames {
  position: absolute;
  bottom: 40%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translateX(-50%) rotate(45deg);
}

.fire .flames .flame {
  position: absolute;
  right: 0%;
  bottom: 0%;
  background-color: #FFDC01;
  border-radius: 8px;
}

.fire .flames .flame:nth-child(2n + 1) {
  animation: flameodd 1.5s ease-in infinite;
}

.fire .flames .flame:nth-child(2n) {
  animation: flameeven 1.5s ease-in infinite;
}

.fire .flames .flame:nth-child(1) {
  animation-delay: 0s;
}

.fire .flames .flame:nth-child(2) {
  animation-delay: calc(1.5s / 4);
}

.fire .flames .flame:nth-child(3) {
  animation-delay: calc(1.5s / 4 * 2);
}

.fire .flames .flame:nth-child(4) {
  animation-delay: calc(1.5s / 4 * 3);
}

@keyframes flameodd {

  0%,
  100% {
    width: 0%;
    height: 0%;
  }

  25% {
    width: 100%;
    height: 100%;
  }

  0% {
    background-color: #FFDC01;
    z-index: 1000000;
  }

  40% {
    background-color: #FDAC01;
    z-index: 1000000;
  }

  100% {
    background-color: #F73B01;
    z-index: -10;
  }

  0% {
    right: 0%;
    bottom: 0%;
  }

  25% {
    right: 1%;
    bottom: 2%;
  }

  100% {
    right: 150%;
    bottom: 170%;
  }
}

@keyframes flameeven {

  0%,
  100% {
    width: 0%;
    height: 0%;
  }

  25% {
    width: 100%;
    height: 100%;
  }

  0% {
    background-color: #FFDC01;
    z-index: 1000000;
  }

  40% {
    background-color: #FDAC01;
    z-index: 1000000;
  }

  100% {
    background-color: #F73B01;
    z-index: -10;
  }

  0% {
    right: 0%;
    bottom: 0%;
  }

  25% {
    right: 2%;
    bottom: 1%;
  }

  100% {
    right: 170%;
    bottom: 150%;
  }
}
</style>