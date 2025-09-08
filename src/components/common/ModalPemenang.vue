<template>
    <div class="fixed inset-0 z-20 flex items-center justify-center bg-black/25" @click.self="$emit('closeModal')">
        <div class="bg-white bg-cover bg-center bg-no-repeat shadow-lg py-[2vh] rounded-[1vw] min-h-[40vh] w-[50vw]"
            @click.stop>
            <h2 class="text-xl font-semibold mb-4">{{ title }}</h2>
            <slot></slot>
            <div class="mt-4 flex justify-center">
                <button class="text-2xl px-4 py-2 bg-red-500 text-white rounded dark:bg-red-600 mr-2 my-[2.5vh] font-bold hover:bg-red-700"
                    @click="$emit('confirmAction')" :disabled="confirmStatus">
                    {{ confirm }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    title: {
        type: String,
        default: ''
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