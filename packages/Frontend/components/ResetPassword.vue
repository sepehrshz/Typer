<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";
import { z } from "zod";
import VOtpInput from "vue3-otp-input";
// const props = defineProps < { isForget: boolean } > ();
const email = ref("");
const isSent = ref(false);
const schema = z.object({
    email: z.string().email("Invalid email"),
});

type Schema = z.output<typeof schema>;
async function onSubmit(event: FormSubmitEvent<Schema>) {
    sendEmail();
}

const otpInput = ref<InstanceType<typeof VOtpInput> | null>(null);
const bindModal = ref("");

const sendEmail = async () => {
    const response: string = await $fetch('http://localhost:3000/sendEmail', {
        method: 'POST',
        body: {
            email: email.value
        }
    });
    isSent.value = true;
    console.log(response);
}

const sendResetToken = async () => {
    const response: boolean = await $fetch('http://localhost:3000/sendToken', {
        method: 'POST',
        body: {
            token: bindModal.value,
            email: email.value
        }
    })
    console.log(response);
}
</script>
<template>
    <div class="bg-white shadow-md shadow-electric-violet-500 sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Forget Password?</h3>
            <div class="mt-2 max-w-xl text-sm text-gray-500">
                <p>Enter your email address below and we will send you a link to reset your password.</p>
            </div>
            <form v-if="!isSent" :schema="schema" @submit.prevent="onSubmit" class="mt-5 sm:flex sm:items-center">
                <div class="w-full sm:max-w-xs">
                    <label for="email" class="sr-only">Email</label>
                    <input v-model="email" name="email"
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-electric-violet-500 focus:ring-electring-violet-500 sm:text-sm"
                        placeholder="you@example.com" />
                </div>
                <button type="submit"
                    class="mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-electric-violet-500 px-4 py-2 font-medium text-white shadow-sm active:scale-90 transition-all sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Send
                    code</button>
            </form>
            <div v-else class="flex w-20">
                <v-otp-input ref="otpInput"
                    input-classes="w-16 h-20 m-2 text-center text-2xl text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 focus:bg-white focus:ring-0 focus:border-2 focus:border-electric-violet-500"
                    separator="" inputType="letter-numeric" :num-inputs="6" v-model:value="bindModal"
                    :should-auto-focus="true" :should-focus-order="true" @on-complete="sendResetToken" />
            </div>
        </div>
    </div>
</template>
<style>
/* input::placeholder {
    font-size: 15px;
    text-align: center;
    font-weight: 600;
    display: flex;
    justify-content: center;
} */
</style>