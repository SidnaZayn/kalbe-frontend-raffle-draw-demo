<template>
    <div class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50" @click.self="$emit('closeModal')">
        <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md" @click.stop>
            <h2 class="text-xl font-semibold mb-4">{{ title }}</h2>
            <slot></slot>
            <div class="mt-4 flex justify-end">
                <button class="px-4 py-2 bg-brand-500 text-white rounded dark:bg-brand-600 mr-2"
                    @click="$emit('confirmAction')" :disabled="confirmStatus">
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
import { defineProps } from 'vue'
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
})
</script>