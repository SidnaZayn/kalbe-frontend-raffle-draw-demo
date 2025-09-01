<template>
    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="max-w-full overflow-x-auto custom-scrollbar">
            <table class="min-w-full">
                <thead>
                    <tr class="border-b border-gray-200 dark:border-gray-700">
                        <th class="px-5 py-3 text-left w-1/11 sm:px-6">
                            <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">No Urut</p>
                        </th>
                        <th class="px-5 py-3 text-left w-2/11 sm:px-6">
                            <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Nama</p>
                        </th>
                        <th class="px-5 py-3 text-left w-2/11 sm:px-6">
                            <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Pemenang</p>
                        </th>
                        <th class="w-1/11"></th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-for="(p, index) in props.hadiah" :key="index"
                        class="border-t border-gray-100 dark:border-gray-800">
                        <td class="px-5 py-4 sm:px-6">
                            <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ p.no_urut }}</p>
                        </td>
                        <td class="px-5 py-4 sm:px-6">
                            <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ p.nama }}</p>
                        </td>
                        <td class="px-5 py-4 sm:px-6" v-if="p.pemenang">
                            <button class="underline text-blue-500" @click="viewWinner(p.pemenang)">Lihat
                                Pemenang</button>
                        </td>
                        <td class="px-5 py-4 sm:px-6" v-else>
                            -
                        </td>
                        <td class="px-5 py-4 sm:px-6">
                            <ButtonControl text="Delete" color="error" @click="deleteHadiahHandler(p.id)" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <ModalCustom title="Detail Pemenang" confirm="Hapus Pemenang"
            @confirmAction="deletePemenang(winnerDetails.id, winnerDetails.nik)" @closeModal="winnerDetails = undefined"
            v-if="winnerDetails">
            <div class="p-4">
                <p class="text-gray-700 dark:text-gray-300">Pemenang ID: {{ winnerDetails.id }}</p>
                <p class="text-gray-700 dark:text-gray-300">Nama: {{ winnerDetails.nama }}</p>
                <p class="text-gray-700 dark:text-gray-300">NIK: {{ winnerDetails.nik }}</p>
            </div>
        </ModalCustom>
    </div>
</template>

<script setup lang="ts">
import { getPesertaById, deleteHadiah, deletePemenangHadiah } from "@/api/raffle-service";
import ModalCustom from "./common/ModalCustom.vue";
import ButtonControl from "./common/ButtonControl.vue";
import { ref, defineEmits } from "vue";
interface Hadiah {
    id: number;
    no_urut: string;
    nama: string;
    pemenang: number | string | null;
}
interface Peserta {
    id: number;
    nama: string;
    nik: string;
}

const props = defineProps<{
    hadiah: Hadiah[]
}>();
const winnerDetails = ref<Peserta>();
const emits = defineEmits(['deleteHadiah', 'deletePemenang']);

const viewWinner = async (winnerId: string | number) => {
    try {
        const response = await getPesertaById(winnerId);
        winnerDetails.value = response; // Assuming the API returns an object with winner details
        // Handle the winner details, e.g., show in a modal or alert
    } catch (error) {
        console.error("Error fetching winner details:", error);
    }
}

const deleteHadiahHandler = async (id: string | number) => {
    const deleteConfirmation = confirm("anda yakin menghapus hadiah ini?");
    if (!deleteConfirmation) return;
    try {
        await deleteHadiah(id);

        // Optionally, you can emit an event to refresh the hadiah list or handle UI updates
        emits('deleteHadiah');
    } catch (error) {
        console.error("Error deleting peserta:", error);
    }
}

const deletePemenang = async (pemenangId: number, pemenangNik: string) => {
    const deleteConfirmation = confirm("anda yakin menghapus pemenang ini?");
    if (!deleteConfirmation) return;
    try {
        // Call the API to delete the winner
        await deletePemenangHadiah(pemenangId, pemenangNik);
        // Optionally, you can emit an event to refresh the hadiah list or handle UI updates
        emits('deletePemenang');
    } catch (error) {
        console.error("Error deleting pemenang:", error);
    }

    winnerDetails.value = undefined; // Close the modal after deletion
};
</script>

<style scoped>
/* Add any additional styles here if needed */
</style>
