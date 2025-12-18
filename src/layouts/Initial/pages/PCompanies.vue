<template>
  <div>
    <div class="bg-white rounded-lg shadow-sm">
      <!-- Title and Actions -->
      <div class="px-6 py-5 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-semibold text-gray-900">Companies</h2>

          <div class="flex items-center gap-3">
            <!-- Search Company -->
            <div class="relative">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input v-model="searchCompany" placeholder="Search company" class="pl-9 w-64" />
            </div>

            <!-- Search USDOT -->
            <div class="relative">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input v-model="searchUsdot" placeholder="Search USDOT" class="pl-9 w-64" />
            </div>

            <!-- Create Company Button -->
            <Button @click="isCreateModalOpen = true" class="bg-gray-900 hover:bg-gray-800">
              Create Company
            </Button>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto max-h-[calc(100vh-280px)] overflow-y-auto">
        <Table class="relative">
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
                  Company name
                  <component :is="getSortIcon('name')" class="w-4 h-4" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  @click="handleSort('usdot')"
                  class="flex items-center gap-2 font-medium hover:text-gray-900"
                >
                  USDOT
                  <component :is="getSortIcon('usdot')" class="w-4 h-4" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  @click="handleSort('address')"
                  class="flex items-center gap-2 font-medium hover:text-gray-900"
                >
                  Address
                  <component :is="getSortIcon('address')" class="w-4 h-4" />
                </button>
              </TableHead>
              <TableHead class="text-right">
                <button
                  @click="handleSort('timezone')"
                  class="flex items-center gap-2 font-medium hover:text-gray-900 ml-auto"
                >
                  Time zone
                  <component :is="getSortIcon('timezone')" class="w-4 h-4" />
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="company in paginatedCompanies"
              :key="company.id"
              @click="handleRowClick(company)"
              class="cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <TableCell class="font-medium">{{ company.id }}</TableCell>
              <TableCell>{{ company.name }}</TableCell>
              <TableCell>{{ company.usdot }}</TableCell>
              <TableCell>{{ company.address }}</TableCell>
              <TableCell class="text-right">{{ company.timezone }}</TableCell>
            </TableRow>

            <!-- No results -->
            <TableRow v-if="paginatedCompanies.length === 0">
              <TableCell colspan="5" class="text-center py-8 text-gray-500">
                No companies found
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

    <!-- Create Company Modal -->
    <CreateCompanyModal
      :open="isCreateModalOpen"
      @close="isCreateModalOpen = false"
      @submit="handleCreateCompany"
    />
  </div>
</template>
<!-- src/views/CompaniesView.vue -->
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
import CreateCompanyModal from '../components/CreateCompanyModal.vue'

const router = useRouter()

interface Company {
  id: number
  name: string
  usdot: string
  address: string
  timezone: string
  createdAt: Date
}

// Mock data
const allCompanies = ref<Company[]>([
  {
    id: 1,
    name: 'IBM',
    usdot: '16415',
    address: '8558 Green Rd.',
    timezone: 'Jan 07, 10:09 PM',
    createdAt: new Date('2025-01-07T22:09:00'),
  },
  {
    id: 2,
    name: 'Louis Vuitton',
    usdot: '70443',
    address: '775 Rolling Green Rd.',
    timezone: 'Jan 07, 10:09 PM',
    createdAt: new Date('2025-01-07T22:09:00'),
  },
  {
    id: 3,
    name: "McDonald's",
    usdot: '39235',
    address: '8080 Railroad St.',
    timezone: 'Jan 07, 10:09 PM',
    createdAt: new Date('2025-01-07T22:09:00'),
  },
  {
    id: 4,
    name: 'The Walt Disney Company',
    usdot: '95554',
    address: '7529 E. Pecan St.',
    timezone: 'Jan 07, 10:09 PM',
    createdAt: new Date('2025-01-07T22:09:00'),
  },
  {
    id: 5,
    name: 'eBay',
    usdot: '28200',
    address: '7529 E. Pecan St.',
    timezone: 'Jan 07, 10:09 PM',
    createdAt: new Date('2025-01-07T22:09:00'),
  },
  {
    id: 6,
    name: 'eBay',
    usdot: '74875',
    address: '775 Rolling Green Rd.',
    timezone: 'Jan 07, 10:09 PM',
    createdAt: new Date('2025-01-07T22:09:00'),
  },
  {
    id: 7,
    name: 'Gillette',
    usdot: '9631',
    address: '8558 Green Rd.',
    timezone: 'Jan 07, 10:09 PM',
    createdAt: new Date('2025-01-07T22:09:00'),
  },
  {
    id: 8,
    name: 'Starbucks',
    usdot: '45904',
    address: '3890 Poplar Dr.',
    timezone: 'Jan 07, 10:09 PM',
    createdAt: new Date('2025-01-07T22:09:00'),
  },
  {
    id: 9,
    name: 'MasterCard',
    usdot: '20079',
    address: '8080 Railroad St.',
    timezone: 'Jan 07, 10:09 PM',
    createdAt: new Date('2025-01-07T22:09:00'),
  },
  {
    id: 10,
    name: 'Starbucks',
    usdot: '3398',
    address: '3890 Poplar Dr.',
    timezone: 'Jan 07, 10:09 PM',
    createdAt: new Date('2025-01-07T22:09:00'),
  },
  {
    id: 11,
    name: 'Pizza Hut',
    usdot: '20796',
    address: '3605 Parker Rd.',
    timezone: 'Jan 07, 10:09 PM',
    createdAt: new Date('2025-01-07T22:09:00'),
  },
  {
    id: 12,
    name: 'IBM',
    usdot: '13671',
    address: '8080 Railroad St.',
    timezone: 'Jan 07, 10:09 PM',
    createdAt: new Date('2025-01-07T22:09:00'),
  },
  {
    id: 13,
    name: 'Johnson & Johnson',
    usdot: '4339',
    address: '7529 E. Pecan St.',
    timezone: 'Jan 07, 10:09 PM',
    createdAt: new Date('2025-01-07T22:09:00'),
  },
  {
    id: 14,
    name: 'The Walt Disney Company',
    usdot: '50963',
    address: '7529 E. Pecan St.',
    timezone: 'Jan 07, 10:09 PM',
    createdAt: new Date('2025-01-07T22:09:00'),
  },
  {
    id: 15,
    name: 'Facebook',
    usdot: '10708',
    address: '7529 E. Pecan St.',
    timezone: 'Jan 07, 10:09 PM',
    createdAt: new Date('2025-01-07T22:09:00'),
  },
  {
    id: 16,
    name: 'Sony',
    usdot: '83676',
    address: '3605 Parker Rd.',
    timezone: 'Jan 07, 10:09 PM',
    createdAt: new Date('2025-01-07T22:09:00'),
  },
  {
    id: 17,
    name: "McDonald's",
    usdot: '93457',
    address: '7529 E. Pecan St.',
    timezone: 'Jan 07, 10:09 PM',
    createdAt: new Date('2025-01-07T22:09:00'),
  },
  {
    id: 18,
    name: "McDonald's",
    usdot: '93457',
    address: '7529 E. Pecan St.',
    timezone: 'Jan 07, 10:09 PM',
    createdAt: new Date('2025-01-07T22:09:00'),
  },
  {
    id: 19,
    name: "McDonald's",
    usdot: '93457',
    address: '7529 E. Pecan St.',
    timezone: 'Jan 07, 10:09 PM',
    createdAt: new Date('2025-01-07T22:09:00'),
  },
  // Add more mock data as needed
])

// Search filters
const searchCompany = ref('')
const searchUsdot = ref('')
const itemsPerPage = ref(10)
const currentPage = ref(1)

// Sorting
type SortKey = 'id' | 'name' | 'usdot' | 'address' | 'timezone'
const sortKey = ref<SortKey>('id')
const sortOrder = ref<'asc' | 'desc'>('asc')

// Modal
const isCreateModalOpen = ref(false)

// Debounced search
const debouncedSearchCompany = ref('')
const debouncedSearchUsdot = ref('')
let searchTimeout: number

watch([searchCompany, searchUsdot], () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    debouncedSearchCompany.value = searchCompany.value
    debouncedSearchUsdot.value = searchUsdot.value
    currentPage.value = 1
  }, 300)
})

// Filtered companies
const filteredCompanies = computed(() => {
  let filtered = allCompanies.value

  // Filter by company name
  if (debouncedSearchCompany.value) {
    filtered = filtered.filter((company) =>
      company.name.toLowerCase().includes(debouncedSearchCompany.value.toLowerCase())
    )
  }

  // Filter by USDOT
  if (debouncedSearchUsdot.value) {
    filtered = filtered.filter((company) => company.usdot.includes(debouncedSearchUsdot.value))
  }

  // Sort
  filtered.sort((a, b) => {
    let aVal: any = a[sortKey.value]
    let bVal: any = b[sortKey.value]

    // Convert to numbers for numeric fields
    if (sortKey.value === 'id' || sortKey.value === 'usdot') {
      aVal = Number(aVal)
      bVal = Number(bVal)
    }

    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })

  return filtered
})

// Paginated companies
const paginatedCompanies = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredCompanies.value.slice(start, end)
})

// Pagination info
const totalPages = computed(() => Math.ceil(filteredCompanies.value.length / itemsPerPage.value))
const totalEntries = computed(() => filteredCompanies.value.length)

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

const handleRowClick = (company: Company) => {
  router.push(`/overview?company=${company.id}`)
}

const handleCreateCompany = (newCompany: Omit<Company, 'id' | 'createdAt'>) => {
  const company: Company = {
    id: allCompanies.value.length + 1,
    ...newCompany,
    createdAt: new Date(),
  }
  allCompanies.value.unshift(company)
  isCreateModalOpen.value = false
}

const getSortIcon = (key: SortKey) => {
  if (sortKey.value !== key) return ArrowUpDown
  return sortOrder.value === 'asc' ? ArrowUp : ArrowDown
}
</script>
