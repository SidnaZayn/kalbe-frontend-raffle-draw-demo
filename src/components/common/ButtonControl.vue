<template>
    <div>
        <button @click="$emit('clickButton')" :disabled="disabled"
            class="flex items-center justify-center font-medium text-white rounded-[1vw] shadow text-theme-sm border-3 border-white px-2"
            :class="[{ 'bg-green-600 hover:bg-green-700 focus:ring-green-500': colorBtn === 'green','bg-red-600 hover:bg-red-700 focus:ring-red-500': colorBtn === 'red', 'opacity-50 cursor-not-allowed': disabled, 'w-28 h-14': size === 'md', 'w-48 h-18': size === 'lg', 'w-16 h-12': size === 'sm' }]">
            {{ text }}
        </button>
    </div>
</template>

<script setup lang="ts">
defineProps({
    text: {
        type: String,
        default: 'button'
    },
    disabled: {
        type: Boolean,
        default: false
    },
    size: {
        type: String,
        default: 'md'
    },
    colorBtn: {
        type: String,
        default: 'red' // You can define more colors if needed
    }
});
</script>

<style scoped>
.bg-green-500 {
    background-color: #22c55e;
    /* Tailwind green-500 */
}

.bg-green-600 {
    background-color: #16a34a;
    /* Tailwind green-600 */
}

.bg-green-700 {
    background-color: #15803d;
    /* Tailwind green-700 */
}
</style>