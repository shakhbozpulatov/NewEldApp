<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-[#E5E5E5] p-4">
    <div class="w-full max-w-[434px]">
      <!-- Card -->
      <div class="bg-white rounded-lg shadow-sm p-8">
        <!-- Logo and Title -->
        <div class="flex justify-center gap-2 items-center mb-5">
          <div class="w-[28px] h-[28px] rounded-lg flex items-center justify-center">
            <img src="/images/logo.svg" alt="Logo" />
          </div>
          <h1 class="text-xl text-[#090909]">Unione</h1>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Username Field -->
          <div class="space-y-2">
            <!--            <Label for="username" class="text-sm font-medium text-gray-700"> Username </Label>-->
            <Input
              id="username"
              v-model="username"
              type="text"
              placeholder="Username"
              :class="['h-11', errors.username && 'border-red-500 focus-visible:ring-red-500']"
              :disabled="isLoading"
              @input="clearError('username')"
            />
            <p v-if="errors.username" class="text-sm text-red-600">
              {{ errors.username }}
            </p>
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <!--            <Label for="password" class="text-sm font-medium text-gray-700"> Password </Label>-->
            <Input
              id="password"
              v-model="password"
              type="password"
              placeholder="Password"
              :class="['h-11', errors.password && 'border-red-500 focus-visible:ring-red-500']"
              :disabled="isLoading"
              @input="clearError('password')"
            />
            <p v-if="errors.password" class="text-sm text-red-600">
              {{ errors.password }}
            </p>
          </div>

          <!-- Submit Button -->
          <Button
            type="submit"
            :disabled="isLoading"
            class="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white font-medium"
          >
            <span v-if="!isLoading">Add client</span>
            <span v-else class="flex items-center gap-2">
              <svg
                class="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Loading...
            </span>
          </Button>
        </form>
      </div>

      <!-- Helper Text -->
      <p class="text-center text-sm text-gray-500 mt-4">Demo credentials: admin / password</p>
    </div>
  </div>
</template>
<!-- src/views/LoginView.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'vue-sonner'

const router = useRouter()

const username = ref('')
const password = ref('')
const isLoading = ref(false)
const errors = ref({
  username: '',
  password: '',
})

// Validation
const validateForm = () => {
  errors.value = {
    username: '',
    password: '',
  }

  let isValid = true

  if (!username.value.trim()) {
    errors.value.username = 'Username is required'
    isValid = false
  }

  if (!password.value) {
    errors.value.password = 'Password is required'
    isValid = false
  } else if (password.value.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
    isValid = false
  }

  return isValid
}

// Form submit
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock authentication - replace with real API call
    if (username.value === 'admin' && password.value === 'password') {
      toast.success('Login Successful', {
        description: 'Welcome back!',
        position: 'top-right',
      })

      // Save auth token (example)
      localStorage.setItem('auth-token', 'mock-token-12345')

      // Redirect to dashboard
      await router.push({ name: 'Initial' })
    } else {
      // Show error
      toast.error('Login Failed', {
        description: 'Invalid username or password',
      })

      errors.value.username = 'Invalid credentials'
      errors.value.password = 'Invalid credentials'
    }
  } catch (error) {
    toast.error('Error', {
      description: 'Something went wrong. Please try again.',
    })
  } finally {
    isLoading.value = false
  }
}

// Clear error when user types
const clearError = (field: 'username' | 'password') => {
  errors.value[field] = ''
}
</script>
