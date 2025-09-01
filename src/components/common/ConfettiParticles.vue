<template>
    <button @click="confetti_shoot()">text try</button>
</template>

<script setup lang="ts">
import confetti from "canvas-confetti";
const confetti_shoot = () => {
    const duration = 5 * 1000; // 15 seconds
    const end = Date.now() + duration;
    const defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        colors: ['#ff0', '#f00', '#0f0', '#00f', '#f0f'],
        zIndex: 0,
    };
    const interval = setInterval(() => {
        const timeLeft = end - Date.now();
        if (timeLeft <= 0) {
            return clearInterval(interval);
        }
        const particleCount = 50 * (timeLeft / duration);
        confetti({
            ...defaults,
            particleCount,
            origin: { x: Math.random(), y: Math.random() * 0.5 + 0.5 },
        });
    }, 250);
}

// function confetti_shoot() {
//     // for (let i = 0; i < 2; i++) {
//     //     confetti({
//     //         particleCount: 100,
//     //         startVelocity: 30,
//     //         spread: 360,
//     //         origin: { x: Math.random(), y: Math.random() * 0.5 + 0.5 },
//     //         colors: ['#ff0', '#f00', '#0f0', '#00f', '#f0f'],
//     //     });
//     // }
//     int
// }
</script>
