import { ref, computed, watch, onMounted } from 'vue'
import { useApi } from '@/composables/useAxiosService.ts'
import type { ProvidersResponse, Provider, CompanyTableItem } from '@/types/company.ts'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-vue-next'

export type SortKey = 'id' | 'name' | 'usdot' | 'company' | 'timezone'

export interface UseCompaniesOptions {
  autoFetch?: boolean
}

export function useCompanies(options: UseCompaniesOptions = {}) {
  const { autoFetch = true } = options
  const api = useApi()

  // API State
  const providers = ref<Provider[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Modal state
  const isCreateModalOpen = ref(false)

  // Search filters
  const searchCompany = ref('')
  const searchUsdot = ref('')

  // Debounced search
  const debouncedSearchCompany = ref('')
  const debouncedSearchUsdot = ref('')
  let searchTimeout: ReturnType<typeof setTimeout>

  watch([searchCompany, searchUsdot], () => {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      debouncedSearchCompany.value = searchCompany.value
      debouncedSearchUsdot.value = searchUsdot.value
      currentPage.value = 1
    }, 300)
  })

  // Sorting
  const sortKey = ref<SortKey>('id')
  const sortOrder = ref<'asc' | 'desc'>('asc')

  // Pagination
  const itemsPerPage = ref(10)
  const currentPage = ref(1)

  // Transform providers/carriers to flat company list for table display
  const companies = computed<CompanyTableItem[]>(() => {
    const items: CompanyTableItem[] = []

    providers.value.forEach((provider) => {
      if (provider.carriers.length === 0) {
        // Provider without carriers
        items.push({
          id: provider.providerId,
          name: provider.providerName,
          email: '-',
          phone: '-',
          company: provider.providerName,
          status: 'Inactive',
          createdAt: new Date(),
          providerId: provider.providerId,
        })
      } else {
        // Each carrier as separate row
        provider.carriers.forEach((carrier) => {
          items.push({
            id: carrier.carrierId,
            name: carrier.name,
            email: carrier.email,
            phone: carrier.phoneNumber,
            company: provider.providerName,
            status: 'Active',
            createdAt: new Date(),
            providerId: provider.providerId,
            carrierId: carrier.carrierId,
            usdotNumber: carrier.usdotNumber,
            timeZone: carrier.timeZoneInfo.shortName,
          })
        })
      }
    })

    return items
  })

  // Filtered companies
  const filteredCompanies = computed(() => {
    let filtered = companies.value

    // Filter by company name or provider name
    if (debouncedSearchCompany.value) {
      filtered = filtered.filter(
        (company) =>
          company.name.toLowerCase().includes(debouncedSearchCompany.value.toLowerCase()) ||
          company.company.toLowerCase().includes(debouncedSearchCompany.value.toLowerCase())
      )
    }

    // Filter by USDOT
    if (debouncedSearchUsdot.value) {
      filtered = filtered.filter((company) =>
        company.usdotNumber?.includes(debouncedSearchUsdot.value)
      )
    }

    // Sort
    const sortedFiltered = [...filtered]
    sortedFiltered.sort((a, b) => {
      let aVal: string | number | Date | undefined
      let bVal: string | number | Date | undefined

      if (sortKey.value === 'usdot') {
        aVal = a.usdotNumber || ''
        bVal = b.usdotNumber || ''
      } else if (sortKey.value === 'timezone') {
        aVal = a.timeZone || ''
        bVal = b.timeZone || ''
      } else {
        aVal = a[sortKey.value]
        bVal = b[sortKey.value]
      }

      if (aVal === undefined || aVal === '') return 1
      if (bVal === undefined || bVal === '') return -1

      if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })

    return sortedFiltered
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

  // Row counter
  let rowCounter = 0
  const getDisplayId = () => {
    rowCounter++
    return (currentPage.value - 1) * itemsPerPage.value + rowCounter
  }

  // Reset counter when rendering
  watch([currentPage, itemsPerPage, paginatedCompanies], () => {
    rowCounter = 0
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

  const getSortIcon = (key: SortKey) => {
    if (sortKey.value !== key) return ArrowUpDown
    return sortOrder.value === 'asc' ? ArrowUp : ArrowDown
  }

  // Fetch companies from API
  const fetchCompanies = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.get<ProvidersResponse>('/api/providers/providers/filter')

      if (response.data?.successResult) {
        providers.value = response.data.successResult
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch companies'
      console.error('Error fetching companies:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Refresh companies list
  const refreshCompanies = async () => {
    await fetchCompanies()
  }

  // Get company by ID
  const getCompanyById = (id: string): CompanyTableItem | undefined => {
    return companies.value.find((company) => company.id === id)
  }

  // Get provider by ID
  const getProviderById = (providerId: string): Provider | undefined => {
    return providers.value.find((provider) => provider.providerId === providerId)
  }

  // Create company
  const handleCreateCompany = async () => {
    // TODO: Implement create company API call
    console.log('Create company')
    isCreateModalOpen.value = false
    await refreshCompanies()
  }

  // Modal actions
  const openCreateModal = () => {
    isCreateModalOpen.value = true
  }

  const closeCreateModal = () => {
    isCreateModalOpen.value = false
  }

  // Auto-fetch on mount if enabled
  if (autoFetch) {
    onMounted(async () => {
      await fetchCompanies()
    })
  }

  return {
    // API State
    providers,
    companies,
    isLoading,
    error,

    // Modal state
    isCreateModalOpen,

    // Search
    searchCompany,
    searchUsdot,
    debouncedSearchCompany,
    debouncedSearchUsdot,

    // Sorting
    sortKey,
    sortOrder,

    // Pagination
    itemsPerPage,
    currentPage,
    totalPages,
    totalEntries,
    pageNumbers,

    // Computed
    filteredCompanies,
    paginatedCompanies,

    // Functions
    fetchCompanies,
    refreshCompanies,
    getCompanyById,
    getProviderById,
    handleSort,
    goToPage,
    getSortIcon,
    getDisplayId,
    handleCreateCompany,
    openCreateModal,
    closeCreateModal,
  }
}
