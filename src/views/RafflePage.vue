<template>
    <modal-pemenang v-if="raffleStatus === 'done rolling'"  @confirmAction="nextRoll" :title="''" @closeModal="raffleStatus = 'idle'"
        confirm="Lanjutkan">
        <div class="text-center flex flex-col items-center gap-3">
            <p class="text-[7.5vh] text-yellow-400 font-bold">CONGRATULATIONS</p>
            <p class="text-[6vh] text-yellow-400 font-bold drop-shadow-custom">{{ pemenangNew.nik }}</p>
            <p class="text-[6vh] text-yellow-400 font-bold drop-shadow-custom">{{ pemenangNew.nama.toUpperCase() }}</p>
            <p class="text-[5vh] text-yellow-400 font-bold drop-shadow-custom">
                {{ pemenangNew.Departement.name }}
            </p>
            <img :src="currentHadiahInList.img_url" alt="image hadiah" class="w-[34%] h-[10vh] object-cover mt-4" />
        </div>
    </modal-pemenang>
    <div class="bg-[url('@/assets/BG-1.png')] bg-cover bg-center bg-no-repeat h-screen">
        <div class="my-auto py-10">
            <div id="main-dashboard" class="flex flex-col items-center pt-4 z-10 relative">
                <div><img class="bg-white rounded-xl p-[5%] w-[10vw] mx-auto" :src="'/logo-hut-kalbe.png'"
                        alt="Logo" /></div>
                <h2 class="text-[5vh] font-bold text-stroke-black-2 text-white my-[2vh]">Doorprize</h2>
                <div class="flex justify-center items-center gap-1 mb-8">
                    <div class="flex justify-center items-center text-center text-white">
                        <p class="text-[8vh] font-bold mb-2 text-stroke-black-2 leading-[1.2]">
                            {{ currentHadiahInList.nama || 'Tidak ada hadiah' }}
                        </p>
                    </div>
                </div>
                <div class="flex gap-[1.5vw] mb-[2.5vh]">
                    <div class="flex justify-center items-center px-[1vw] py-[0.3vw] bg-black rounded-[1vw] gradient-shadow"
                        v-for="i in pemenang" :class="raffleStatus === 'done rolling' ? 'breathing-animation' : ''"
                        :key="i">
                        <p class="text-[6vh] font-bold mb-0 mt-1 text-white drop-shadow-custom">
                            <span>{{ i }}</span>
                        </p>
                    </div>
                </div>
                <button-custom text="tidak ada hadiah" size="lg" :disabled="true" v-if="hadiahList.length === 0" />
                <button-custom v-else @clickButton="getWinner" :text="rollButtonText"
                    :disabled="raffleStatus == 'on rolling'" size="lg" />
            </div>
        </div>
        <div class="flex justify-between items-center w-full absolute bottom-0 left-0 ">
            <img src="/doorprize.png" alt="doorprize" class="w-[30vw]" />
            <img src="/doorprize.png" alt="doorprize" class="w-[30vw] scale-x-[-1]" />
        </div>
        <div class="flex justify-between items-center w-full absolute bottom-0 left-0 z-10" v-if="trumpetStatus">
            <img src="/trumpet.gif" alt="trumpet" class="w-[10vw]" />
            <img src="/trumpet.gif" alt="trumpet" class="w-[10vw] scale-x-[-1]" />
        </div>
    </div>
</template>


<style>
.gradient-shadow {
    box-shadow: 0 4px 15px 0 rgba(20, 14, 14, 0.5), 0 1.5px 10px 0 rgba(133, 38, 38, 0.5);
    /* teal-400: #2dd4bf, teal-600: #134e4a */
}

.drop-shadow-custom {
    text-shadow: 1vh 1vh 1vh rgba(0, 0, 0, 0.6);
}

.text-stroke-black-2 {
    -webkit-text-stroke: 3px #000;
    paint-order: stroke fill;
}
</style>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import ButtonCustom from "@/components/common/ButtonCustom.vue";
import ModalPemenang from "@/components/common/ModalPemenang.vue";
import { getHadiah, raffle, updateHadiah, updateStatusPeserta, type HadiahType } from "@/api/raffle-service";
import confetti from "canvas-confetti";

const pemenang = ref(['*', '*', '*', '*', '*', '*', '*', '*', '*'])
/* eslint-disable  @typescript-eslint/no-explicit-any */
const pemenangNew = ref<any>({ id: 0, nik: ['1', '1', '1', '1', '1', '1', '1', '1', '1'], nama: 'john smith', departement_id: 0, location:'', entity: 'entity', Departement: { name: '', id: 0 } })
const currentHadiah = ref(0);
const hadiahList = ref<HadiahType[]>([{ id: 0, nama: 'Loading...' }]); // Initialize with a loading state
const raffleStatus = ref<'idle' | 'on rolling' | 'done rolling'>('idle');

const rollButtonText = computed(() => {
    if (raffleStatus.value === 'idle') {
        return 'Mulai Undi !';
    } else if (raffleStatus.value === 'on rolling') {
        return 'Rolling...';
    } else {
        return 'Next Roll';
    }
});

const getHadiahList = async () => {
    try {
        const response = await getHadiah();
        hadiahList.value = response; // Assuming the API returns an array of hadiah
    } catch (error) {
        console.error("Error fetching hadiah list:", error);
    }
};

const currentHadiahInList = computed(() => {
    return hadiahList.value[currentHadiah.value] || { nama: 'Tidak ada hadiah' };
});

watch(currentHadiah, (newValue) => {
    if (newValue < 0) {
        currentHadiah.value = hadiahList.value.length - 1; // Wrap around to last item
    } else if (newValue >= hadiahList.value.length) {
        currentHadiah.value = 0; // Wrap around to first item
    }
});

const updateWinnerDB = async () => {
    await updateStatusPeserta(pemenangNew.value.nik)

    const hadiahId = hadiahList.value[currentHadiah.value].id; // Replace with actual hadiah ID
    await updateHadiah(pemenangNew.value.id, hadiahId);
}

const getWinner = async () => {
    if (raffleStatus.value === 'done rolling') {
        nextRoll();
        return;
    }
    try {
        drumRoll();
        pemenangNew.value = await raffle();

        for (let i = 0; i < pemenang.value.length; i++) {
            raffleStatus.value = 'on rolling';
            const shuffling_interval = setInterval(() => {
                pemenang.value[i] = (Math.floor(Math.random() * 9) + 1).toString()
            }, 75)

            setTimeout(async () => {
                clearInterval(shuffling_interval)
                pemenang.value[i] = pemenangNew.value.nik[i]

                if (i === pemenang.value.length - 1) {
                    await updateWinnerDB();
                    raffleStatus.value = 'done rolling';
                    cymbal();
                    confetti_shoot();
                }
            }, 1000 * (i + 1))
        }

    } catch (error) {
        console.error("Error fetching winner:", error);
    }
};

const nextRoll = async () => {
    raffleStatus.value = 'idle';
    await getHadiahList(); // Refresh hadiah list after updating
    pemenang.value = ['*', '*', '*', '*', '*', '*', '*', '*', '*']; // Reset pemenang for next roll
    pemenangNew.value = { id: 0, nik: ['1', '1', '1', '1', '1', '1', '1', '1', '1'], nama: 'john smith', Departement: { id: null, name: '' }, entity: '', location: '', departement_id: 0 };
    cymbalOff();
    stopConfetti()
};

function drumRoll() {
    const audio = new Audio('/drum-roll-NEW.mp3')
    audio.play()
}

const audio = new Audio('/audio pemenang.mp3')

function cymbal() {
    audio.play()
}

function cymbalOff() {
    audio.pause();
    audio.currentTime = 0; // Reset to the beginning
}

const trumpetStatus = ref(false);

const confettiDuration = ref(0); // 15 seconds
let confettiStopTimeout: ReturnType<typeof setTimeout> | null = null;
let confettiStopped = false;

const stopConfetti = () => {
    confettiStopped = true;
    trumpetStatus.value = false;
    cymbalOff();
    if (confettiStopTimeout) {
        clearTimeout(confettiStopTimeout);
        confettiStopTimeout = null;
    }
};

const confetti_shoot = () => {
    confettiStopped = false;
    confettiDuration.value = 30 * 1000; // 30 seconds
    const animationEnd = Date.now() + confettiDuration.value;
    let skew = 1;
    const confettiColors = ['#FF0000', '#FFD600', '#1976D2']; // red, yellow, blue

    function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    (function frame() {
        if (confettiStopped) return;
        const timeLeft = animationEnd - Date.now();
        skew = Math.max(0.2, skew - 0.1);

        confetti({
            particleCount: 3,
            spread: randomInRange(50, 70),
            startVelocity: 50,
            origin: {
                x: Math.random(),
                y: (Math.random() * skew) - 0.2
            },
            gravity: 1,
            scalar: 1,
            drift: randomInRange(-0.4, 0.4),
            colors: confettiColors
        });

        if (timeLeft > 0) {
            requestAnimationFrame(frame);
        }
    })();

    trumpetStatus.value = true;
    confettiStopTimeout = setTimeout(() => {
        trumpetStatus.value = false;
        cymbalOff();
    }, confettiDuration.value);
};
onMounted(async () => {
    await getHadiahList();
    confetti_shoot()
});
</script>