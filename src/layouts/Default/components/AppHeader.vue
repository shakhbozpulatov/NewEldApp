<!-- src/components/layout/AppHeader.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import {
  Menu,
  Sun,
  Moon,
  MessageSquare,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const props = defineProps<{
  isSidebarOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-sidebar'): void
}>()

const isDarkMode = ref(false)

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  // Dark mode logic here
  console.log('Dark mode:', isDarkMode.value)
}

const handleProfileClick = () => {
  console.log('Navigate to profile')
}

const handleSettingsClick = () => {
  console.log('Navigate to settings')
}

const handleLogout = () => {
  console.log('Logging out...')
}
</script>

<template>
  <header
    class="fixed top-0 right-0 h-[65px] bg-white border-b border-gray-300 z-30 transition-all duration-300 flex items-center"
    :class="[isSidebarOpen ? 'left-[248px]' : 'left-0']"
  >
    <!-- Header Content -->
    <div class="flex-1 h-full px-6 flex items-center justify-between">
      <!-- Left Section -->
      <div class="flex items-center gap-4">
        <!-- Burger Menu - only visible when sidebar is closed -->
        <Button
          v-if="!isSidebarOpen"
          @click="emit('toggle-sidebar')"
          variant="ghost"
          size="icon"
          class="h-10 w-10"
        >
          <Menu class="w-5 h-5 text-gray-700" />
        </Button>

        <!-- Page Title -->
        <h1 class="text-sm ml-2 text-[#666]">Overview</h1>
      </div>

      <!-- Right Section -->
      <div class="flex items-center gap-2">
        <!-- Dark Mode Toggle -->
        <Button @click="toggleDarkMode" variant="ghost" size="icon" class="hidden sm:flex">
          <Sun v-if="!isDarkMode" class="w-5 h-5" />
          <Moon v-else class="w-5 h-5" />
        </Button>

        <!-- Messages -->
        <Button variant="ghost" size="icon" class="hidden sm:flex relative">
          <MessageSquare class="w-5 h-5" />
          <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>

        <!-- User Dropdown -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" class="flex items-center gap-2 h-10 px-3 hover:bg-gray-100">
              <div
                class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm"
              >
                T
              </div>
              <span class="hidden sm:block text-sm font-medium text-gray-900">
                The Walt Disney
              </span>
              <ChevronDown class="w-4 h-4 text-gray-500 hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-56">
            <DropdownMenuLabel>
              <div class="flex flex-col">
                <span class="font-medium">The Walt Disney</span>
                <span class="text-xs text-gray-500 font-normal"> walt@disney.com </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="handleProfileClick" class="cursor-pointer">
              <User class="w-4 h-4 mr-2" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem @click="handleSettingsClick" class="cursor-pointer">
              <Settings class="w-4 h-4 mr-2" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              @click="handleLogout"
              class="cursor-pointer text-red-600 focus:text-red-600"
            >
              <LogOut class="w-4 h-4 mr-2" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </header>
</template>
