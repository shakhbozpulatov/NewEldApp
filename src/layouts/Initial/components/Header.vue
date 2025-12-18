<!-- src/layouts/shared/CarrierHeader.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const route = useRoute()
const router = useRouter()

const currentTab = computed(() => route.path)

const handleTabChange = (value: string | number) => {
  if (typeof value === 'string' && value !== route.path) {
    router.push(value)
  }
}
</script>

<template>
  <header class="bg-white border-b border-gray-200">
    <div class="px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <h1 class="text-xl font-semibold text-gray-900">Union</h1>
      </div>

      <div class="flex items-center gap-4">
        <!-- Tabs Navigation -->
        <Tabs :model-value="currentTab" @update:model-value="handleTabChange">
          <TabsList class="bg-transparent border-0 h-auto p-0 gap-4">
            <TabsTrigger
              value="/initial/companies"
              class="data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-gray-900 rounded-none px-0 pb-1"
            >
              Companies
            </TabsTrigger>
            <TabsTrigger
              value="/initial/clients"
              class="data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-gray-900 rounded-none px-0 pb-1"
            >
              Manage client
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <!-- Union Team Button -->
        <button class="text-sm font-medium text-gray-500 hover:text-gray-700">Union team</button>
      </div>
    </div>
  </header>
</template>
