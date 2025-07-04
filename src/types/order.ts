export interface Order {
  id: number
  orderNo: string
  merchantId: number
  merchantName: string
  amount: number
  status: 'pending' | 'paid' | 'cancelled' | 'refunded'
  paymentMethod: string
  createdAt: string
  paidAt?: string
  description?: string
}

export interface OrderQuery {
  orderNo?: string
  merchantId?: number
  status?: string
  startDate?: string
  endDate?: string
  page: number
  pageSize: number
}