<template>
  <admin-layout>
    <button-control text="Tambah Hadiah" class="mb-4" @clickButton="modalVisible = true" />
    <ModalCustom title="Tambah Hadiah" confirm="Upload" :confirm-status="uploadButtonStatus" @closeModal="openModal"
      @confirmAction="addHadiah" v-if="modalVisible">
      <div class="mb-4">
        <label for="nama_hadiah">Nama Hadiah</label>
        <input id="nama_hadiah" type="text" class="w-full p-2 border border-gray-300 rounded"
          placeholder="Masukkan nama hadiah" v-model="namaHadiah" />
        <label for="link_img">Link Gambar Hadiah</label>
        <input id="link_img" type="text" class="w-full p-2 border border-gray-300 rounded"
          placeholder="Link Gambar Hadiah" v-model="imgUrl" />
      </div>
    </ModalCustom>
    <table-hadiah :hadiah="hadiah" @deletePemenang="deletePemenangHandler()" @deleteHadiah="getHadiahHandler(true)" />
  </admin-layout>
</template>

<script setup lang="ts">
import AdminLayout from '../components/layout/AdminLayout.vue'
import ButtonControl from "../components/common/ButtonControl.vue"
import ModalCustom from "../components/common/ModalCustom.vue";
import TableHadiah from "@/components/TableHadiah.vue";
import { addHadiah as ah, getHadiah } from "../api/raffle-service"; // Import your API service here
import { computed, onMounted, ref } from 'vue';

const modalVisible = ref(false);
const uploadButtonStatus = computed(() => {
  return namaHadiah.value ? false : true;
});
const namaHadiah = ref('');
const imgUrl = ref('');
/* eslint-disable  @typescript-eslint/no-explicit-any */
const hadiah = ref<any[]>([]);

const getHadiahHandler = async (allStatus: boolean) => {
  try {
    const response = await getHadiah(allStatus);
    hadiah.value = response; // Assuming the API returns an array of hadiah
  } catch (error) {
    console.error("Error fetching hadiah:", error);
  }

  return hadiah.value;
};

const deletePemenangHandler = async () => {
  modalVisible.value = false;
  await getHadiahHandler(true);

};

const addHadiah = async () => {
  // Handle file upload logic here
  await ah(namaHadiah.value, imgUrl.value);
  modalVisible.value = false; // Close the modal after successful addition
  namaHadiah.value = ''; // Reset the input field
  await getHadiahHandler(true);
};

const openModal = () => {
  modalVisible.value = !modalVisible.value;
};

onMounted(async () => {
  await getHadiahHandler(true)
});

</script>
