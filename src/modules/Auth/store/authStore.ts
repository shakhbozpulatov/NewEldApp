import { defineStore } from 'pinia'
import router from '@/router'
import { useApi } from '@/composables/useAxiosService'
import type { User, CurrentUserResponse } from '@/modules/Auth/types'

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    user: null as User | null,
    loggedIn: false,
    token: null as string | null,
    refreshToken: null as string | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token && state.loggedIn,
    getUser: (state) => state.user,
  },
  actions: {
    // Initialize auth state from localStorage
    initAuth() {
      const token = localStorage.getItem('token')
      const refreshToken = localStorage.getItem('refreshToken')

      if (token) {
        this.token = token
        this.refreshToken = refreshToken
        // Don't set loggedIn here, wait for user data fetch
      }
    },
    getTokens() {
      return this.token || localStorage.getItem('token')
    },
    getRefreshToken() {
      return this.refreshToken || localStorage.getItem('refreshToken')
    },
    setTokens(token: string, refreshToken?: string) {
      this.token = token
      if (refreshToken) {
        this.refreshToken = refreshToken
        localStorage.setItem('refreshToken', refreshToken)
      }
      localStorage.setItem('token', token)
    },
    clearTokens() {
      this.token = null
      this.refreshToken = null
      this.user = null
      this.loggedIn = false
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    },
    setUser(user: User) {
      this.user = user
      this.loggedIn = true
    },
    async fetchCurrentUser() {
      try {
        const res = await useApi().get<CurrentUserResponse>('/api/users/current-user')

        // Current-user API returns array, get first user
        if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          this.setUser(res.data.data[0])
          return res.data.data[0]
        }

        // If no user data found but user is already set from login, don't throw error
        if (this.user) {
          console.warn('No user data from API, using existing user data')
          return this.user
        }

        throw new Error('No user data found')
      } catch (err: unknown) {
        console.error('fetchCurrentUser error:', err)

        if (err && typeof err === 'object' && 'response' in err) {
          const apiError = err as { response?: { data?: { code?: number } } }
          if (apiError.response?.data?.code === 550) {
            this.clearTokens()
            throw err
          }
        }

        // If user is already set from login, don't throw error
        if (this.user) {
          console.warn('fetchCurrentUser failed, using existing user data')
          return this.user
        }

        throw err
      }
    },
    async logout() {
      this.clearTokens()
      await router.push({ name: 'Login' })
    },
  },
})
