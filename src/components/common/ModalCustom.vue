<template>
    <div class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50" @click.self="$emit('closeModal')">
        <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md" @click.stop>
            <h2 class="text-xl font-semibold mb-4">{{ title }}</h2>
            <slot></slot>
            <div class="my-2 flex gap-2" :hidden="!showCaptcha">
                <canvas id="captchaCanvas" class="border border-gray-300 rounded w-full h-12"></canvas>

                <input type="text" v-model="captchaInput" placeholder="Enter Captcha"
                    class="w-full p-2 border border-gray-300 rounded" />
                    <refresh-icon @click="drawCaptcha" class="w-8 h-8 cursor-pointer text-gray-600 hover:text-gray-800 mt-2" />
            </div>
            <div class="mt-4 flex justify-end">
                <button class="px-4 py-2 bg-brand-500 text-white rounded dark:bg-brand-600 mr-2"
                    @click="confirmHandler()" :disabled="confirmStatus">
                    {{ confirm }}
                    </button>
                <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    @click="$emit('closeModal')">
                    Close
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps,onMounted, ref,watch } from 'vue'
import { generateCaptcha } from '@/helper/captcha';
import { RefreshIcon } from "@/icons";

defineProps({
    title: {
        type: String,
        default: 'Modal Title'
    },
    confirm: {
        type: String,
        default: 'Confirm'
    },
    confirmStatus: {
        type: Boolean,
        default: false
    }
});

const emits = defineEmits(['confirmAction', 'closeModal']);

const captchaInput = ref('');
const captchaCode = ref('');
const showCaptcha = ref(true);

watch(captchaInput, (newVal) => {
    if (newVal.length === captchaCode.value.length) {
        setTimeout(() => {
            if (newVal !== captchaCode.value) {
                alert('Captcha does not match. Please try again.');
                captchaInput.value = '';
                drawCaptcha();
            }else{
                alert('Captcha matched!');
                showCaptcha.value = false;
            }
        }, 500);
    }
});

const drawCaptcha = () => {
    const canvas = document.getElementById('captchaCanvas') as HTMLCanvasElement;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Set background color
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Set text properties
            ctx.font = '48px Arial';
            ctx.fillStyle = '#000';
            ctx.textBaseline = 'middle';

            // Generate and draw captcha code
            captchaCode.value = generateCaptcha(6);
            const textWidth = ctx.measureText(captchaCode.value).width;
            const x = (canvas.width - textWidth) / 2;
            const y = canvas.height / 2;
            ctx.fillText(captchaCode.value, x, y);

            // Add some noise or lines for better security (optional)
            for (let i = 0; i < 5; i++) {
                ctx.strokeStyle = `rgba(0,0,0,${Math.random()})`;
                ctx.beginPath();
                ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
                ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
                ctx.stroke();
            }
        }
    }
};

const confirmHandler = ()=>{
    if(showCaptcha.value){
        alert('Please complete the captcha first.');
        return;
    }
    emits('confirmAction');
}

onMounted(() => {
    drawCaptcha();
});
</script>