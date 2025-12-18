<template>
  <Modal :open="open" @update:open="handleClose">
    <ModalContent max-width="3xl">
      <ModalHeader>
        <ModalTitle class="text-2xl font-semibold">Create company</ModalTitle>
      </ModalHeader>

      <form @submit.prevent="handleSubmit" class="space-y-6 mt-4">
        <!-- Row 1 -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="name">Company name</Label>
            <Input
              id="name"
              v-model="formData.name"
              placeholder="Company name"
              :class="errors.name && 'border-red-500'"
              :disabled="isSubmitting"
              @input="clearError('name')"
            />
            <p v-if="errors.name" class="text-sm text-red-600">{{ errors.name }}</p>
          </div>

          <div class="space-y-2">
            <Label for="phone">Phone</Label>
            <Input
              id="phone"
              v-model="formData.phone"
              placeholder="Phone"
              :class="errors.phone && 'border-red-500'"
              :disabled="isSubmitting"
              @input="clearError('phone')"
            />
            <p v-if="errors.phone" class="text-sm text-red-600">{{ errors.phone }}</p>
          </div>
        </div>

        <!-- Row 2 -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="usdot">USDOT</Label>
            <Input
              id="usdot"
              v-model="formData.usdot"
              placeholder="USDOT"
              :class="errors.usdot && 'border-red-500'"
              :disabled="isSubmitting"
              @input="clearError('usdot')"
            />
            <p v-if="errors.usdot" class="text-sm text-red-600">{{ errors.usdot }}</p>
          </div>

          <div class="space-y-2">
            <Label for="address">Company address</Label>
            <Input
              id="address"
              v-model="formData.address"
              placeholder="Company address"
              :class="errors.address && 'border-red-500'"
              :disabled="isSubmitting"
              @input="clearError('address')"
            />
            <p v-if="errors.address" class="text-sm text-red-600">{{ errors.address }}</p>
          </div>
        </div>

        <!-- Row 3 -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="homeTerminalAddress">Home terminal address</Label>
            <Input
              id="homeTerminalAddress"
              v-model="formData.homeTerminalAddress"
              placeholder="Home terminal address"
              :disabled="isSubmitting"
            />
          </div>

          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="Email"
              :class="errors.email && 'border-red-500'"
              :disabled="isSubmitting"
              @input="clearError('email')"
            />
            <p v-if="errors.email" class="text-sm text-red-600">{{ errors.email }}</p>
          </div>
        </div>

        <!-- Row 4 -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="issuerStateParent">Issuer state parent</Label>
            <Select v-model="formData.issuerStateParent" :disabled="isSubmitting">
              <SelectTrigger id="issuerStateParent">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CA">California</SelectItem>
                <SelectItem value="NY">New York</SelectItem>
                <SelectItem value="TX">Texas</SelectItem>
                <SelectItem value="FL">Florida</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label for="issuerState">Issuer State</Label>
            <Select v-model="formData.issuerState" :disabled="isSubmitting">
              <SelectTrigger id="issuerState">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CA">California</SelectItem>
                <SelectItem value="NY">New York</SelectItem>
                <SelectItem value="TX">Texas</SelectItem>
                <SelectItem value="FL">Florida</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <!-- Row 5 -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="zipcode">Zipcode</Label>
            <Input
              id="zipcode"
              v-model="formData.zipcode"
              placeholder="Zipcode"
              :class="errors.zipcode && 'border-red-500'"
              :disabled="isSubmitting"
              @input="clearError('zipcode')"
            />
            <p v-if="errors.zipcode" class="text-sm text-red-600">{{ errors.zipcode }}</p>
          </div>
        </div>

        <!-- Home terminal timezone -->
        <div class="space-y-3">
          <Label>Home terminal</Label>
          <RadioGroup v-model="formData.timezone" :disabled="isSubmitting">
            <div class="grid grid-cols-5 gap-3">
              <div class="flex items-center space-x-2">
                <RadioGroupItem value="EDT" id="edt" />
                <Label for="edt" class="cursor-pointer">EDT</Label>
              </div>
              <div class="flex items-center space-x-2">
                <RadioGroupItem value="MDT" id="mdt" />
                <Label for="mdt" class="cursor-pointer">MDT</Label>
              </div>
              <div class="flex items-center space-x-2">
                <RadioGroupItem value="PDT" id="pdt" />
                <Label for="pdt" class="cursor-pointer">PDT</Label>
              </div>
              <div class="flex items-center space-x-2">
                <RadioGroupItem value="EDT2" id="edt2" />
                <Label for="edt2" class="cursor-pointer">EDT</Label>
              </div>
              <div class="flex items-center space-x-2">
                <RadioGroupItem value="UST" id="ust" />
                <Label for="ust" class="cursor-pointer">UST</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <!-- Actions -->
        <ModalFooter class="pt-4">
          <Button type="button" variant="outline" @click="handleClose" :disabled="isSubmitting">
            Cancel
          </Button>
          <Button type="submit" class="bg-gray-900 hover:bg-gray-800" :disabled="isSubmitting">
            <span v-if="!isSubmitting">Save</span>
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
              Saving...
            </span>
          </Button>
        </ModalFooter>
      </form>
    </ModalContent>
  </Modal>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter } from '@/components/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface Props {
  open: boolean
}

interface FormData {
  name: string
  phone: string
  usdot: string
  address: string
  homeTerminalAddress: string
  email: string
  issuerStateParent: string
  issuerState: string
  zipcode: string
  timezone: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
  (
    e: 'submit',
    data: Omit<
      FormData,
      'phone' | 'homeTerminalAddress' | 'email' | 'issuerStateParent' | 'issuerState' | 'zipcode'
    >
  ): void
}>()

const formData = ref<FormData>({
  name: '',
  phone: '',
  usdot: '',
  address: '',
  homeTerminalAddress: '',
  email: '',
  issuerStateParent: '',
  issuerState: '',
  zipcode: '',
  timezone: 'EDT',
})

const errors = ref<Partial<Record<keyof FormData, string>>>({})
const isSubmitting = ref(false)

// Reset form when modal opens/closes
watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      resetForm()
    }
  }
)

const resetForm = () => {
  formData.value = {
    name: '',
    phone: '',
    usdot: '',
    address: '',
    homeTerminalAddress: '',
    email: '',
    issuerStateParent: '',
    issuerState: '',
    zipcode: '',
    timezone: 'EDT',
  }
  errors.value = {}
}

const validateForm = (): boolean => {
  errors.value = {}
  let isValid = true

  // Required fields
  if (!formData.value.name.trim()) {
    errors.value.name = 'Company name is required'
    isValid = false
  }

  if (!formData.value.usdot.trim()) {
    errors.value.usdot = 'USDOT is required'
    isValid = false
  } else if (!/^\d+$/.test(formData.value.usdot)) {
    errors.value.usdot = 'USDOT must be numeric'
    isValid = false
  }

  if (!formData.value.address.trim()) {
    errors.value.address = 'Company address is required'
    isValid = false
  }

  // Email validation if provided
  if (formData.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = 'Invalid email format'
    isValid = false
  }

  // Phone validation if provided
  if (formData.value.phone && !/^\+?[\d\s-()]+$/.test(formData.value.phone)) {
    errors.value.phone = 'Invalid phone format'
    isValid = false
  }

  // Zipcode validation if provided
  if (formData.value.zipcode && !/^\d{5}(-\d{4})?$/.test(formData.value.zipcode)) {
    errors.value.zipcode = 'Invalid zipcode format'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    emit('submit', {
      name: formData.value.name,
      usdot: formData.value.usdot,
      address: formData.value.address,
      timezone: `Jan 07, 10:09 PM`, // Mock timezone display
    })
  } catch (error) {
    console.error('Error creating company:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleClose = () => {
  if (!isSubmitting.value) {
    emit('close')
  }
}

const clearError = (field: keyof FormData) => {
  delete errors.value[field]
}
</script>
