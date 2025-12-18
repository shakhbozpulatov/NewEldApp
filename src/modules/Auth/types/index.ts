// Permission type
export interface Permission {
  id: string
  name: string
  code: string
}

// Role type
export interface Role {
  id: string
  name: string
  type: number
  permissions: Permission[]
}

// User type
export interface User {
  id: string
  userName: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string | null
  carrierId: string | null
  carrier: unknown | null
  providerId: string | null
  carriersCount?: number
  driversCount?: number
  state?: number
  roles: Role[]
  toolCodes: number[]
}

// Login Credentials
export interface LoginCredentials {
  username: string
  password: string
}

// Login Success Result
export interface LoginSuccessResult {
  token: string
  refreshToken: string
  user: User
}

// Login API Response
export interface LoginResponse {
  successResult: LoginSuccessResult
}

// Current User API Response (array format)
export interface CurrentUserResponse {
  data: User[]
}

// Auth Store State
export interface AuthState {
  user: User | null
  loggedIn: boolean
  token: string | null
  refreshToken: string | null
}

