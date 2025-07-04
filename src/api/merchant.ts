import request from './request'
import type { Merchant, MerchantForm } from '@/types/merchant'

export const merchantApi = {
  // 获取商户列表
  getList: (params: any) => {
    return request.get('/merchants', { params })
  },

  // 获取商户详情
  getDetail: (id: number) => {
    return request.get(`/merchants/${id}`)
  },

  // 创建商户
  create: (data: MerchantForm) => {
    return request.post('/merchants', data)
  },

  // 更新商户
  update: (id: number, data: Partial<MerchantForm>) => {
    return request.put(`/merchants/${id}`, data)
  },

  // 删除商户
  delete: (id: number) => {
    return request.delete(`/merchants/${id}`)
  },

  // 更新商户状态
  updateStatus: (id: number, status: string) => {
    return request.patch(`/merchants/${id}/status`, { status })
  }
}