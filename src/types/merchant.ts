export interface Merchant {
  id: number
  name: string
  code: string
  type: string
  status: 'active' | 'inactive' | 'pending'
  contactPerson: string
  phone: string
  email: string
  address: string
  registeredAt: string
  lastLoginAt?: string
}

export interface MerchantForm {
  name: string
  code: string
  type: string
  contactPerson: string
  phone: string
  email: string
  address: string
}