<script setup lang="ts">
import paragraphs from "../assets/paragraphs";
import { ref } from "vue";

// Define reactive variables
let timer: NodeJS.Timeout | undefined = undefined;
const maxTime = 60;
const timeLeft = ref<number>(maxTime);
let charIndex: number = 0;
const mistakes = ref<number>(0);
const isTyping = ref<boolean>(false);
const inputField = ref<string>("");
const inputFieldRef = ref<VNodeRef | undefined>();
const wpmTag = ref<number>(0);
const cpmTag = ref<number>(0);
const typedChar = ref<string>("");
const key = ref(Math.floor(Math.random() * paragraphs.length));

const loadParagraph = computed<
  {
    letter: string;
    active: boolean;
    status: "correct" | "incorrect" | "nutrul";
  }[]
>(() =>
  paragraphs[key.value]
    .split("")
    .map((v) => ({ letter: v, active: false, status: "nutrul" }))
)

const initTyping = () => {
  typedChar.value = inputField.value.split("")[charIndex];
  if (charIndex < loadParagraph.value.length - 1 && timeLeft.value > 0) {
    if (!isTyping.value) {
      timer = setInterval(initTimer, 1000);
      isTyping.value = true;
    }
    if (typedChar.value == null || undefined) {
      if (charIndex > 0) {
        charIndex--;
        if (loadParagraph.value[charIndex].status === "incorrect") {
          mistakes.value--;
        }
        loadParagraph.value[charIndex].status = "nutrul";
      }
      loadParagraph.value[charIndex + 1].active = false;
    } else {
      if (loadParagraph.value[charIndex].letter == typedChar.value) {
        loadParagraph.value[charIndex].status === "correct";
      } else {
        mistakes.value++;
        loadParagraph.value[charIndex].status === "incorrect";
      }
      charIndex++;
      loadParagraph.value[charIndex - 1].active = false;
    }
    loadParagraph.value[charIndex].active = true;
    let wpm = Math.round(
      ((charIndex - mistakes.value) / 5 / (maxTime - timeLeft.value)) * 60
    );
    wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;

    wpmTag.value = wpm;
    cpmTag.value = charIndex - mistakes.value;
  } else {
    clearInterval(timer);
    inputField.value = "";
  }
};

watch(inputField, initTyping);

const initTimer = () => {
  if (timeLeft.value > 0) {
    timeLeft.value--;
    timeLeft.value;
    let wpm =
      Math.round(
        (charIndex - mistakes.value) / 5 / (maxTime - timeLeft.value)
      ) * 60;
    wpmTag.value = wpm;
  } else {
    clearInterval(timer);
  }
}

const resetGame = () => {
  key.value = Math.floor(Math.random() * paragraphs.length);
  clearInterval(timer)
  timeLeft.value = maxTime
  charIndex = 0
  mistakes.value = 0
  isTyping.value = false
  inputField.value = ""
  inputFieldRef.value.focus()
  wpmTag.value = 0
  cpmTag.value = 0
};
</script>

<template>
  <div class="w-[770px] h-[96vh] p-[35px] bg-white rounded-xl shadow-lg">
    <input autofocus ref="inputFieldRef" v-model="inputField" type="text" class="opacity-0 z-0 absolute" />
    <div class="px-3 py-5 rounded-xl border-2 border-[#bfbfbf]">
      <div class="overflow-hidden max-h-64">
        <span v-for="(word, index) in loadParagraph" :key="index" :class='[word.active ? "active" : "", word.status]'>{{ word.letter }}</span>
      </div>
      <div class="mt-4 flex px-3 py-0 flex-wrap items-center justify-between border-t-2 border-[#bfbfbf]">
        <ul class="flex flex-wrap items-center w-[calc(100% - 140px)] justify-between">
          <li class="flex h-5 list-none relative items-center">
            <p class="text-lg">Time Left:</p>
            <span class="block text-[20px] ml-2"><b>{{ timeLeft }}</b>s</span>
          </li>
          <li class="flex h-5 list-none relative items-center pl-5 border-l-2 border-[#bfbfbf]">
            <p class="text-lg">Mistakes:</p>
            <span class="block text-[20px] ml-2">{{ mistakes }}</span>
          </li>
          <li class="flex h-5 list-none relative items-center pl-5 border-l-2 border-[#bfbfbf]">
            <p class="text-lg">WPM:</p>
            <span class="block text-[20px] ml-2">{{ wpmTag }}</span>
          </li>
          <li class="flex h-5 list-none relative items-center pl-5 border-l-2 border-[#bfbfbf]">
            <p class="text-lg">CPM:</p>
            <span class="block text-[20px] ml-2">{{ cpmTag }}</span>
          </li>
        </ul>
        <button @click="resetGame" class="outline-none border-none w-28 text-white py-2 px-0 text-sm cursor-pointer rounded-md bg-[#17a2b8] transition-all ease-linear active:scale-95">Try Again</button>
      </div>
    </div>
  </div>
</template>

<style>
::selection {
  color: #fff;
  background: #17a2b8;
}

span.correct {
  color: #56964f;
}

span.incorrect {
  color: #cb3439;
  outline: 1px solid #fff;
  background: #ffc0cb;
  border-radius: 1px;
}

span.active {
  color: #17a2b8;
}

span.active::before {
  position: absolute;
  content: "";
  height: 2px;
  width: 100%;
  bottom: 0;
  left: 0;
  border-radius: 5px;
  background: #17a2b8;
  animation: blink 1s ease-in-out infinite;
}

@keyframes blink {
  50% {
    opacity: 1;
  }
}

@media (max-width: 745px) {
  .wrapper {
    padding: 20px;
  }

  .content-box .content {
    padding: 20px 0;
  }

  .contnent-box .typing-text {
    max-height: 100%;
  }

  .typing-text p {
    font-size: 19px;
    text-align: left;
  }

  .content button {
    width: 100%;
    font-size: 15px;
    padding: 10px 0;
    margin-top: 20px;
  }

  .content .result .content-details {
    width: 100%;
  }

  .result-detail li:not(:first-child) {
    border-left: 0;
    padding: 0;
  }

  .result-details li p,
  .result-details li span {
    font-size: 17px;
  }
}

@media (max-width: 518px) {
  .wrapper .content-box {
    padding: 10px 15px 0;
  }

  .typing-text p {
    font-size: 18px;
  }

  .result-details li {
    margin-bottom: 10px;
  }

  .content button {
    margin-top: 10px;
  }
}
</style>
