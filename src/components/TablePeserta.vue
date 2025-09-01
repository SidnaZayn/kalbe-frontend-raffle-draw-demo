<template>
    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="max-w-full overflow-x-auto custom-scrollbar">
            <table class="min-w-full">
                <thead>
                    <tr class="border-b border-gray-200 dark:border-gray-700">
                        <th class="px-5 py-3 text-left w-2/11 sm:px-6">
                            <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">NIK</p>
                        </th>
                        <th class="px-5 py-3 text-left w-2/11 sm:px-6">
                            <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Nama</p>
                        </th>
                        <th class="px-5 py-3 text-left w-2/11 sm:px-6">
                            <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Status Hadiah</p>
                        </th>
                        <th class="w-1/11"></th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-for="(p, index) in props.peserta" :key="index"
                        class="border-t border-gray-100 dark:border-gray-800">
                        <td class="px-5 py-4 sm:px-6">
                            <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ p.nik }}</p>
                        </td>
                        <td class="px-5 py-4 sm:px-6">
                            <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ p.nama }}</p>
                        </td>
                        <td class="px-5 py-4 sm:px-6">
                            <span :class="[
                                'rounded-full px-2 py-0.5 text-theme-xs font-medium',
                                {
                                    'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500':
                                        p.status === true,
                                    'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400':
                                        p.status === false,
                                },
                            ]">
                                {{ p.status ? 'Dapat' : 'Belum Dapat' }}
                            </span>
                        </td>
                        <td class="flex gap-2 py-4">
                            <ButtonControl text="Delete" @click="deletePesertaHandler(p.id)" color="red" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { deletePeserta } from '@/api/raffle-service';
import ButtonControl from "@/components/common/ButtonControl.vue"; // Import any common components if needed


interface Peserta {
    id?: string; // Optional if ID is not used
    nik: string;
    nama: string;
    departemen: string;
    status: boolean;
}

const props = defineProps<{
    peserta: Peserta[]
}>();

const emits = defineEmits(['deletePeserta']);
const deletePesertaHandler = async (id: string | undefined) => {
    const deleteConfirmation = confirm("Are you sure you want to delete this peserta?");
    if (!deleteConfirmation) return;
    // Emit an event to handle deletion in the parent component
    await deletePeserta(id)
    emits('deletePeserta');
};
</script>

<style scoped>
/* Add any additional styles here if needed */
</style>
