<template>
  <admin-layout>
    <div class="flex gap-2">
      <ButtonControl text="Upload Peserta" @clickButton="openModal" />
    </div>

    <ModalCustom title="Tambah Peserta" confirm="Upload" :confirm-status="uploadButtonStatus" @closeModal="openModal"
      @confirmAction="uploadFile" v-if="modalVisible">
      <div class="mb-4 flex gap-3 items-center">
        <p>{{ file ? file.name : "choose a file" }}</p>
        <label
          class="items-center cursor-pointer justify-center p-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600"
          for="file_input">Upload file</label>
        <input class="hidden" id="file_input" type="file" @change="inputFile"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
      </div>
      <div class="mb-4">
        <a href="/template-peserta.xlsx" download
          class="underline underline-offset-4 text-blue-500 hover:text-blue-600">Template File</a>
      </div>
    </ModalCustom>

    <!-- table here -->
    <div class="py-4">
      <TablePeserta :peserta="peserta" @delete-peserta="getPesertaAll(true)" />
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AdminLayout from '../components/layout/AdminLayout.vue'
import ButtonControl from "../components/common/ButtonControl.vue"
import ModalCustom from "../components/common/ModalCustom.vue";
import TablePeserta from "@/components/TablePeserta.vue";
import { uploadPeserta, getPeserta, parsePesertaExcel } from "../api/raffle-service"; // Import your API service here

interface Peserta {
  nik: string;
  nama: string;
  departemen: string;
  status: boolean;
}

const modalVisible = ref(false);
const file = ref<File | null>(null);
const uploadButtonStatus = computed(() => {
  return file.value ? false : true;
});
const peserta = ref<Peserta[]>([]);

const loginStatus = ref(false);

/* eslint-disable  @typescript-eslint/no-explicit-any */
const uploadedPeserta = ref<any[]>([]);

const inputFile = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    file.value = target.files[0];
  } else {
    if (file.value) {
      file.value = file.value;
    } else {
      file.value = null;
    }
  }

  parsePesertaExcel(file.value as File)
    .then((data) => {
      // console.log("Parsed data:", data);
      uploadedPeserta.value = data; // Assuming the parsed data is an array of users
      // You can handle the parsed data here if needed
    })
    .catch((error) => {
      console.error("Error parsing file:", error);
    });
}

const getPesertaAll = async (allStatus: boolean) => {
  try {
    const response = await getPeserta(allStatus);
    peserta.value = response; // Assuming the API returns an array of users
  } catch (error) {
    console.error("Error fetching peserta data:", error);
  }
};


const uploadFile = async () => {
  try {
    // Handle file upload logic here
    await uploadPeserta(uploadedPeserta.value);
    await getPesertaAll(true);

    file.value = null;

    uploadedPeserta.value = []; // Clear the uploaded peserta after upload   
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === '23505') {
      alert("Peserta sudah ada");
    } else {
      console.error("Error uploading peserta:", error);
    }
  }
  openModal()
}

const openModal = () => {
  modalVisible.value = !modalVisible.value;
  file.value = null; // Reset file input when modal is opened
}

onMounted(async () => {
  await getPesertaAll(true);
  const user = localStorage.getItem('user');
  loginStatus.value = user ? true : false; // Check if user is logged in
});

</script>
