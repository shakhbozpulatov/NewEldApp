<!-- src/layouts/Initial/PIndex.vue -->
<script setup lang="ts">
import Header from './components/Header.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <Header />

    <!-- Main Content -->
    <main class="p-6">
      <router-view />
    </main>
  </div>
</template>