<template>
    <admin-layout>
        <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Departement</h1>
        <!-- Add any additional controls or buttons here -->
        </div>
    
        <!-- table here -->
        <div class="py-4">
            <table-departement :departements="departements" @getDepartements="fetchDepartements"/>
        </div>
    </admin-layout>
</template>

<script setup lang="ts">
import AdminLayout from '../components/layout/AdminLayout.vue'
import TableDepartement from '@/components/TableDepartement.vue';
import { getDepartementList } from '@/api/raffle-service';
import { onMounted, ref } from 'vue';

/* eslint-disable  @typescript-eslint/no-explicit-any */
const departements = ref<any[]>([]);
const fetchDepartements = async () => {
    try {
        const response = await getDepartementList();
        departements.value = response; // Assuming the API returns an array of departements
    } catch (error) {
        console.error("Error fetching departements:", error);
    }
};

onMounted(() => {
    fetchDepartements();
});
</script>