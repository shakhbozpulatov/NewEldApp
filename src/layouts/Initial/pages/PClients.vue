<template>
  <div>
    <div class="bg-white rounded-lg shadow-sm">
      <!-- Title and Actions -->
      <div class="px-6 py-5 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-semibold text-gray-900">Clients</h2>

          <div class="flex items-center gap-3">
            <!-- Search Name -->
            <div class="relative">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input v-model="searchName" placeholder="Search name" class="pl-9 w-64" />
            </div>

            <!-- Search Email -->
            <div class="relative">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input v-model="searchEmail" placeholder="Search email" class="pl-9 w-64" />
            </div>

            <!-- Create Client Button -->
            <Button class="bg-gray-900 hover:bg-gray-800"> Create Client </Button>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto max-h-[calc(100vh-280px)] overflow-y-auto">
        <Table>
          <TableHeader class="sticky top-0 z-10 bg-gray-50">
            <TableRow class="bg-gray-50">
              <TableHead class="w-20">
                <button
                  @click="handleSort('id')"
                  class="flex items-center gap-2 font-medium hover:text-gray-900"
                >
                  No
                  <component :is="getSortIcon('id')" class="w-4 h-4" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  @click="handleSort('name')"
                  class="flex items-center gap-2 font-medium hover:text-gray-900"
                >
                  Client name
                  <component :is="getSortIcon('name')" class="w-4 h-4" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  @click="handleSort('email')"
                  class="flex items-center gap-2 font-medium hover:text-gray-900"
                >
                  Email
                  <component :is="getSortIcon('email')" class="w-4 h-4" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  @click="handleSort('phone')"
                  class="flex items-center gap-2 font-medium hover:text-gray-900"
                >
                  Phone
                  <component :is="getSortIcon('phone')" class="w-4 h-4" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  @click="handleSort('company')"
                  class="flex items-center gap-2 font-medium hover:text-gray-900"
                >
                  Company
                  <component :is="getSortIcon('company')" class="w-4 h-4" />
                </button>
              </TableHead>
              <TableHead class="text-right">
                <button
                  @click="handleSort('status')"
                  class="flex items-center gap-2 font-medium hover:text-gray-900 ml-auto"
                >
                  Status
                  <component :is="getSortIcon('status')" class="w-4 h-4" />
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="client in paginatedClients"
              :key="client.id"
              @click="handleRowClick(client)"
              class="cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <TableCell class="font-medium">{{ client.id }}</TableCell>
              <TableCell>{{ client.name }}</TableCell>
              <TableCell>{{ client.email }}</TableCell>
              <TableCell>{{ client.phone }}</TableCell>
              <TableCell>{{ client.company }}</TableCell>
              <TableCell class="text-right">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    client.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800',
                  ]"
                >
                  {{ client.status }}
                </span>
              </TableCell>
            </TableRow>

            <!-- No results -->
            <TableRow v-if="paginatedClients.length === 0">
              <TableCell colspan="6" class="text-center py-8 text-gray-500">
                No clients found
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <!-- Footer / Pagination -->
      <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <!-- Items per page -->
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-600">Display on page</span>
          <Select v-model="itemsPerPage">
            <SelectTrigger class="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem :value="10">10</SelectItem>
              <SelectItem :value="25">25</SelectItem>
              <SelectItem :value="50">50</SelectItem>
              <SelectItem :value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span class="text-sm text-gray-600"> {{ totalEntries }} entries </span>
        </div>

        <!-- Pagination -->
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-1">
            <button
              v-for="page in pageNumbers"
              :key="page"
              @click="typeof page === 'number' && goToPage(page)"
              :disabled="page === '...'"
              :class="[
                'min-w-[32px] h-8 px-2 text-sm font-medium rounded transition-colors',
                page === currentPage
                  ? 'bg-gray-900 text-white'
                  : page === '...'
                    ? 'text-gray-400 cursor-default'
                    : 'text-gray-700 hover:bg-gray-100',
              ]"
            >
              {{ page }}
            </button>
          </div>

          <div class="flex items-center gap-2 ml-4">
            <span class="text-sm text-gray-600"> {{ currentPage }} of {{ totalPages }} pages </span>
            <div class="flex gap-1">
              <Button
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage === 1"
                variant="outline"
                size="icon"
                class="h-8 w-8"
              >
                <ChevronLeft class="w-4 h-4" />
              </Button>
              <Button
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                variant="outline"
                size="icon"
                class="h-8 w-8"
              >
                <ChevronRight class="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const router = useRouter()

interface Client {
  id: number
  name: string
  email: string
  phone: string
  company: string
  status: 'Active' | 'Inactive'
  createdAt: Date
}

// Mock data
const allClients = ref<Client[]>([
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@ibm.com',
    phone: '+1 (555) 123-4567',
    company: 'IBM',
    status: 'Active',
    createdAt: new Date('2025-01-07T22:09:00'),
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@disney.com',
    phone: '+1 (555) 234-5678',
    company: 'The Walt Disney Company',
    status: 'Active',
    createdAt: new Date('2025-01-07T22:09:00'),
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob.j@mcdonalds.com',
    phone: '+1 (555) 345-6789',
    company: "McDonald's",
    status: 'Inactive',
    createdAt: new Date('2025-01-06T15:30:00'),
  },
  {
    id: 4,
    name: 'Alice Williams',
    email: 'alice.w@lvmh.com',
    phone: '+1 (555) 456-7890',
    company: 'Louis Vuitton',
    status: 'Active',
    createdAt: new Date('2025-01-05T10:15:00'),
  },
  {
    id: 5,
    name: 'Charlie Brown',
    email: 'charlie.b@ebay.com',
    phone: '+1 (555) 567-8901',
    company: 'eBay',
    status: 'Active',
    createdAt: new Date('2025-01-04T14:20:00'),
  },
])

// Search filters
const searchName = ref('')
const searchEmail = ref('')
const itemsPerPage = ref(10)
const currentPage = ref(1)

// Sorting
type SortKey = 'id' | 'name' | 'email' | 'phone' | 'company' | 'status'
const sortKey = ref<SortKey>('id')
const sortOrder = ref<'asc' | 'desc'>('asc')

// Debounced search
const debouncedSearchName = ref('')
const debouncedSearchEmail = ref('')
let searchTimeout: number

watch([searchName, searchEmail], () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    debouncedSearchName.value = searchName.value
    debouncedSearchEmail.value = searchEmail.value
    currentPage.value = 1
  }, 300)
})

// Filtered clients
const filteredClients = computed(() => {
  let filtered = allClients.value

  // Filter by name
  if (debouncedSearchName.value) {
    filtered = filtered.filter((client) =>
      client.name.toLowerCase().includes(debouncedSearchName.value.toLowerCase())
    )
  }

  // Filter by email
  if (debouncedSearchEmail.value) {
    filtered = filtered.filter((client) =>
      client.email.toLowerCase().includes(debouncedSearchEmail.value.toLowerCase())
    )
  }

  // Sort
  filtered.sort((a, b) => {
    let aVal: any = a[sortKey.value]
    let bVal: any = b[sortKey.value]

    // Convert to numbers for numeric fields
    if (sortKey.value === 'id') {
      aVal = Number(aVal)
      bVal = Number(bVal)
    }

    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })

  return filtered
})

// Paginated clients
const paginatedClients = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredClients.value.slice(start, end)
})

// Pagination info
const totalPages = computed(() => Math.ceil(filteredClients.value.length / itemsPerPage.value))
const totalEntries = computed(() => filteredClients.value.length)

const pageNumbers = computed(() => {
  const pages: (number | string)[] = []
  const maxVisible = 5

  if (totalPages.value <= maxVisible + 2) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)

    if (currentPage.value > 3) {
      pages.push('...')
    }

    for (
      let i = Math.max(2, currentPage.value - 1);
      i <= Math.min(totalPages.value - 1, currentPage.value + 1);
      i++
    ) {
      pages.push(i)
    }

    if (currentPage.value < totalPages.value - 2) {
      pages.push('...')
    }

    pages.push(totalPages.value)
  }

  return pages
})

// Functions
const handleSort = (key: SortKey) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const handleRowClick = (client: Client) => {
  console.log('Client clicked:', client)
  // router.push(`/clients/${client.id}`)
}

const getSortIcon = (key: SortKey) => {
  if (sortKey.value !== key) return ArrowUpDown
  return sortOrder.value === 'asc' ? ArrowUp : ArrowDown
}
</script>
