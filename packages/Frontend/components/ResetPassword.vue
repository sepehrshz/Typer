<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";
import { z } from "zod";
import VOtpInput from "vue3-otp-input";

const toast = useToast();
const emit = defineEmits(['isValid']);
const email = ref<string>();
const isSent = ref(false);
const isValid = ref(false);
const isReset = ref(false);
const iconActive = ref(false)
const iconActive2 = ref(false)

const changeIcon = () => {
    if (iconActive.value) iconActive.value = false
    else iconActive.value = true
}
const changeIcon2 = () => {
    if (iconActive2.value) iconActive2.value = false
    else iconActive2.value = true
}

const schema = z.object({
    email: z.string().email("Invalid email"),
});

const schema2 = z.object({
    password: z.string().min(8, "Must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Must be at least 8 characters")
        .refine((value) => value === state.password, {
            message: "Passwords do not match",
        })
})

type Schema = z.output<typeof schema>;
async function onSubmit(event: FormSubmitEvent<Schema>) {
    sendEmail();
}

type Schema2 = z.output<typeof schema2>
async function onSubmit2(event: FormSubmitEvent<Schema2>) {
    console.log(state.password);
    resetPassword();
}
const state = reactive({
    password: '',
    confirmPassword: ''
})

const otpInput = ref<InstanceType<typeof VOtpInput> | null>(null);
const bindModal = ref("");

const timeRemaining = ref(120);
let intervalId: ReturnType<typeof setInterval>;

onBeforeUnmount(() => {
    clearInterval(intervalId)
})

const formattedTimeRemaining = computed(() => {
    const minutes = Math.floor(timeRemaining.value / 60)
    const seconds = timeRemaining.value % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

function startCountdown() {
    intervalId = setInterval(() => {
        timeRemaining.value--
        if (timeRemaining.value === 0) {
            clearInterval(intervalId);
            isSent.value = false;
            otpInput.value?.clearInput();
        }
    }, 1000)
}

const sendEmail = async () => {
    const response: string = await $fetch('http://localhost:3000/sendEmail', {
        method: 'POST',
        body: {
            email: email.value
        }
    });
    isSent.value = true;
    timeRemaining.value = 120;
    startCountdown();
    console.log(response);
}

const sendResetToken = async () => {
    const response: boolean = await $fetch('http://localhost:3000/sendToken', {
        method: 'POST',
        body: {
            token: bindModal.value,
            email: email.value
        }
    });
    isValid.value = true;
    console.log(response);
}

const resetPassword = async () => {
    const response: string = await $fetch('http://localhost:3000/resetPassword', {
        method: 'POST',
        body: {
            email: email.value,
            password: state.password,
            token: bindModal.value,
        }
    });
    if (response === "Password reset successfully") {
        console.log(response);
        emit("isValid");
        isReset.value = true;
        toast.add({ title: response, color: 'green' });
    }
    else toast.add({ title: 'Something went wrong', color: 'red' })
}


</script>
<template>
    <div v-if="!isReset" class="bg-white border-4 rounded-lg w-5/6 px-6 py-9 border-gray-400 sm:w-auto">
        <h3 class="text-lg font-medium leading-6 text-gray-900">Forget Password?</h3>
        <!-- email form -->
        <div v-if=!isValid>
            <p class="mt-2">Enter your email address below and we will send you 6-digit code.</p>
            <UForm :schema="schema" :state="{ email }" @submit="onSubmit"
                class="mt-6 flex flex-col justify-start items-start sm:flex-row">
                <UFormGroup class="w-full sm:w-2/3" name="email">
                    <UInput :disabled="isSent ? true : false" autofocus v-model="email" size="md" name="email"
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-electric-violet-500 focus:ring-electring-violet-500 sm:text-sm"
                        placeholder="you@example.com" />
                </UFormGroup>
                <UButton type="submit" :disabled="isSent ? true : false"
                    class="inline-flex mt-4 h-9 w-full items-center justify-center rounded-md border border-transparent bg-electric-violet-500 px-4 py-2 text-white shadow-sm active:scale-90 transition-all sm:mt-0 sm:ml-3 sm:w-auto">
                    Send
                    code</UButton>
            </UForm>
            <p class="mt-2" v-if="isSent">You can try again after <span class="text-electric-violet-500">{{
                formattedTimeRemaining }}</span>
            </p>
            <v-otp-input ref="otpInput"
                input-classes="w-[50px] h-[66px] sm:w-16 sm:h-20 m-1 sm:m-2 sm:mt-8 text-center text-2xl text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 focus:bg-white focus:ring-0 focus:border-2 focus:border-electric-violet-500"
                separator="" inputType="letter-numeric" :num-inputs="6" v-model:value="bindModal"
                :should-auto-focus="true" :should-focus-order="true" :is-disabled="!isSent ? true : false"
                @on-complete="sendResetToken" />
        </div>
        <div v-else-if="isValid">
            <div class="mt-2 max-w-xl text-gray-500">
                <p>Enter your new password</p>
            </div>
            <UForm class="flex flex-col justify-evenly items-center w-80 h-64" :state="state" :schema="schema2"
                @submit="onSubmit2">
                <UFormGroup label="Password" name="password" class="w-3/4 mt-5 relative">
                    <UInput autofocus v-model="state.password" size="lg" :type="iconActive ? 'text' : 'password'"
                        name="password"
                        class="w-full block rounded-md border-gray-300 outline-none focus:border-electric-violet-500 focus:ring-electric-violet-500 sm:text-sm" />
                    <Icon @click="changeIcon" class="cursor-pointer absolute right-2 top-3" size="20px"
                        :name="iconActive ? 'formkit:eye' : 'formkit:hidden'" color="black" />
                </UFormGroup>

                <UFormGroup label="Confirm Password" name="confirmPassword" class="w-3/4 mt-5 relative">
                    <UInput v-model="state.confirmPassword" size="lg" :type="iconActive2 ? 'text' : 'password'"
                        name="password2"
                        class="w-full block rounded-md border-gray-300 outline-none focus:border-electric-violet-500 focus:ring-electric-violet-500 sm:text-sm" />
                    <Icon @click="changeIcon2" class="cursor-pointer absolute right-2 top-3" size="20px"
                        :name="iconActive2 ? 'formkit:eye' : 'formkit:hidden'" color="black" />
                </UFormGroup>
                <UButton type="submit"
                    class="flex justify-center items-center bg-gradient-to-r from-electric-violet-500 to-electric-violet-400 text-white w-3/6 h-12 mt-5 sm:text-lg rounded-md">
                    Reset password
                </UButton>
            </UForm>
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