<!-- Example usage in App.vue or router view -->
<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'
import '@/assets/toast-styles.css'
</script>

<template>
  <RouterView />
  <Toaster />
</template>
