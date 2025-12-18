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
            <Button @click="openCreateModal" class="bg-gray-900 hover:bg-gray-800">
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
                  @click="handleSort('company')"
                  class="flex items-center gap-2 font-medium hover:text-gray-900"
                >
                  Provider
                  <component :is="getSortIcon('company')" class="w-4 h-4" />
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
              <TableCell class="font-medium">{{ getDisplayId() }}</TableCell>
              <TableCell>{{ company.name }}</TableCell>
              <TableCell>{{ company.usdotNumber || '-' }}</TableCell>
              <TableCell>{{ company.company }}</TableCell>
              <TableCell class="text-right">{{ company.timeZone || '-' }}</TableCell>
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
      @close="closeCreateModal"
      @submit="handleCreateCompany"
    />
  </div>
</template>
<!-- src/views/CompaniesView.vue -->
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Search, ChevronLeft, ChevronRight } from 'lucide-vue-next'
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
import { useCompanies } from '../composables/useCompanies'
import type { CompanyTableItem } from '@/types/company.ts'

const router = useRouter()

// Use companies composable - contains all business logic
const {
  searchCompany,
  searchUsdot,
  itemsPerPage,
  currentPage,
  totalPages,
  totalEntries,
  pageNumbers,
  paginatedCompanies,
  isCreateModalOpen,
  handleSort,
  goToPage,
  getSortIcon,
  getDisplayId,
  handleCreateCompany,
  openCreateModal,
  closeCreateModal,
} = useCompanies()

// Navigation
const handleRowClick = (company: CompanyTableItem) => {
  router.push(`/overview?company=${company.id}`)
}
</script>
