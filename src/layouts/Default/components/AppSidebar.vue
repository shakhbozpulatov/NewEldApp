<template>
  <aside
    :class="[
      'fixed left-0 top-0 h-full bg-[#DBDBDB] transition-all duration-300 z-40 overflow-hidden',
      isOpen ? 'w-[248px] translate-x-0' : 'w-0 -translate-x-full lg:w-0 lg:translate-x-0',
    ]"
  >
    <div class="flex flex-col h-full w-[248px]">
      <!-- Logo -->
      <div class="flex items-center gap-3 px-4 h-[65px] flex-shrink-0">
        <div class="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <span v-show="isOpen" class="text-xl font-semibold text-gray-900 whitespace-nowrap">
          Unione ELD
        </span>
      </div>

      <!-- Separator aligned with header border -->
      <Separator class="bg-gray-300" />

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto py-4 px-2">
        <div v-for="section in menuItems" :key="section.id" class="mb-6">
          <!-- Section Header -->
          <div
            v-if="isOpen"
            class="px-3 mb-2 text-xs font-semibold text-gray-600 uppercase tracking-wider"
          >
            {{ section.label }}
          </div>

          <!-- Menu Items -->
          <div class="space-y-1">
            <template v-for="item in section.children" :key="item.id">
              <!-- Parent Menu Item with Children -->
              <div v-if="item.children">
                <button
                  @click="toggleMenu(item.id)"
                  class="cursor-pointer"
                  :class="[
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    'hover:bg-gray-300/50 text-gray-800',
                  ]"
                >
                  <component v-if="item.icon" :is="item.icon" class="w-5 h-5 flex-shrink-0" />
                  <span v-show="isOpen" class="flex-1 text-left">
                    {{ item.label }}
                  </span>
                  <ChevronDown
                    v-show="isOpen"
                    :class="[
                      'w-4 h-4 transition-transform flex-shrink-0',
                      isMenuExpanded(item.id) && 'rotate-180',
                    ]"
                  />
                </button>

                <!-- Sub Menu Items -->
                <div v-show="isMenuExpanded(item.id) && isOpen" class="ml-8 mt-1 space-y-1">
                  <button
                    v-for="subItem in item.children"
                    :key="subItem.id"
                    @click="navigateTo(subItem.path)"
                    class="cursor-pointer"
                    :class="[
                      'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive(subItem.path)
                        ? 'bg-white text-gray-900'
                        : 'text-gray-700 hover:bg-[#E6E6E6]',
                    ]"
                  >
                    {{ subItem.label }}
                  </button>
                </div>
              </div>

              <!-- Simple Menu Item without Children -->
              <button
                v-else
                @click="navigateTo(item.path)"
                class="cursor-pointer"
                :class="[
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive(item.path)
                    ? 'bg-white text-gray-900'
                    : 'text-gray-800 hover:bg-[#E6E6E6]',
                ]"
              >
                <component v-if="item.icon" :is="item.icon" class="w-5 h-5 flex-shrink-0" />
                <span v-show="isOpen">{{ item.label }}</span>
              </button>
            </template>
          </div>
        </div>
      </nav>

      <Separator class="bg-gray-300" />

      <!-- Logout Button -->
      <div class="p-4">
        <Button
          @click="handleLogout"
          variant="ghost"
          :class="[
            'w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-gray-300/50',
            !isOpen && 'justify-center',
          ]"
        >
          <LogOut class="w-5 h-5" />
          <span v-show="isOpen">Log out</span>
        </Button>
      </div>
    </div>
  </aside>
</template>
<!-- src/components/layout/AppSidebar.vue -->
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  LayoutGrid,
  Truck,
  Users,
  Bell,
  FileText,
  Building2,
  UserCog,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface MenuItem {
  id: string
  label: string
  icon: any
  path?: string
  children?: MenuItem[]
}

defineProps<{
  isOpen: boolean
}>()

const router = useRouter()
const route = useRoute()

const expandedMenus = ref<string[]>([])

const menuItems: MenuItem[] = [
  {
    id: 'operations',
    label: 'Operations',
    icon: null,
    children: [
      {
        id: 'overview',
        label: 'Overview',
        icon: LayoutGrid,
        path: '/overview',
      },
      {
        id: 'eld',
        label: 'ELD',
        icon: FileText,
        children: [
          { id: 'eld-logs', label: 'Driver Logs', icon: null, path: '/eld/logs' },
          { id: 'eld-reports', label: 'Reports', icon: null, path: '/eld/reports' },
        ],
      },
      {
        id: 'vehicles',
        label: 'Vehicles',
        icon: Truck,
        path: '/vehicles',
      },
      {
        id: 'drivers',
        label: 'Drivers',
        icon: Users,
        path: '/drivers',
      },
      {
        id: 'alerts',
        label: 'Alerts',
        icon: Bell,
        path: '/alerts',
      },
    ],
  },
  {
    id: 'compliance',
    label: 'Compliance & Reports',
    icon: null,
    children: [
      {
        id: 'ifta',
        label: 'IFTA',
        icon: FileText,
        path: '/ifta',
      },
      {
        id: 'dvir',
        label: 'DVIR',
        icon: FileText,
        path: '/dvir',
      },
      {
        id: 'company',
        label: 'Company',
        icon: Building2,
        path: '/company',
      },
      {
        id: 'portal-users',
        label: 'Portal users',
        icon: Users,
        path: '/portal-users',
      },
    ],
  },
  {
    id: 'admin',
    label: 'Administration & Support',
    icon: null,
    children: [
      {
        id: 'tools',
        label: 'Tools',
        icon: Settings,
        children: [
          { id: 'tools-settings', label: 'Settings', icon: null, path: '/tools/settings' },
          {
            id: 'tools-integrations',
            label: 'Integrations',
            icon: null,
            path: '/tools/integrations',
          },
        ],
      },
      {
        id: 'configuration',
        label: 'Configuration',
        icon: Settings,
        children: [
          { id: 'config-general', label: 'General', icon: null, path: '/config/general' },
          { id: 'config-advanced', label: 'Advanced', icon: null, path: '/config/advanced' },
        ],
      },
      {
        id: 'user-manager',
        label: 'User manager',
        icon: UserCog,
        children: [
          { id: 'users-list', label: 'Users List', icon: null, path: '/users/list' },
          { id: 'users-roles', label: 'Roles', icon: null, path: '/users/roles' },
        ],
      },
    ],
  },
]

// Load expanded menus from localStorage
onMounted(() => {
  const saved = localStorage.getItem('expanded-menus')
  if (saved) {
    expandedMenus.value = JSON.parse(saved)
  }
})

// Save expanded menus to localStorage
watch(
  expandedMenus,
  (newValue) => {
    localStorage.setItem('expanded-menus', JSON.stringify(newValue))
  },
  { deep: true }
)

const toggleMenu = (menuId: string) => {
  const index = expandedMenus.value.indexOf(menuId)
  if (index > -1) {
    expandedMenus.value.splice(index, 1)
  } else {
    expandedMenus.value.push(menuId)
  }
}

const isMenuExpanded = (menuId: string) => {
  return expandedMenus.value.includes(menuId)
}

const isActive = (path?: string) => {
  if (!path) return false
  return route.path === path
}

const navigateTo = (path?: string) => {
  if (path) {
    router.push(path)
  }
}

const handleLogout = () => {
  // Logout logic
  console.log('Logging out...')
}
</script>

<style scoped>
/* Custom scrollbar */
nav::-webkit-scrollbar {
  width: 6px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
}

nav::-webkit-scrollbar-thumb {
  background: #b0b0b0;
  border-radius: 3px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: #999999;
}
</style>
