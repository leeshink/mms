export interface User {
  id: number
  username: string
  name: string
  email: string
  role: string
  avatar?: string
  createdAt?: string
  updatedAt?: string
}

export interface LoginForm {
  username: string
  password: string
}