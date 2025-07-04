<template>
  <div class="orders">
    <h1 class="page-title">订单管理</h1>
    
    <div class="page-card">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索订单号"
            style="width: 200px"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-select v-model="statusFilter" placeholder="订单状态" style="width: 120px" clearable>
            <el-option label="待支付" value="pending" />
            <el-option label="已支付" value="paid" />
            <el-option label="已取消" value="cancelled" />
            <el-option label="已退款" value="refunded" />
          </el-select>
          <el-button type="primary">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-button type="primary">导出</el-button>
        </div>
      </div>

      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="orderNo" label="订单号" width="150" />
        <el-table-column prop="merchantName" label="商户" width="120" />
        <el-table-column prop="amount" label="金额" width="100">
          <template #default="{ row }">
            ¥{{ row.amount.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="paymentMethod" label="支付方式" width="100" />
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" link>查看</el-button>
            <el-button v-if="row.status === 'paid'" type="warning" size="small" link>
              退款
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const searchKeyword = ref('')
const statusFilter = ref('')

const tableData = ref([
  {
    id: 1,
    orderNo: 'ORD202407040001',
    merchantName: '张三餐厅',
    amount: 128.50,
    status: 'paid',
    paymentMethod: '微信支付',
    createdAt: '2024-07-04 10:30:00',
    paidAt: '2024-07-04 10:31:00'
  },
  {
    id: 2,
    orderNo: 'ORD202407040002',
    merchantName: '李四超市',
    amount: 89.90,
    status: 'pending',
    paymentMethod: '支付宝',
    createdAt: '2024-07-04 11:15:00'
  }
])

const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    pending: 'warning',
    paid: 'success',
    cancelled: 'info',
    refunded: 'danger'
  }
  return typeMap[status] || 'info'
}

const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending: '待支付',
    paid: '已支付',
    cancelled: '已取消',
    refunded: '已退款'
  }
  return textMap[status] || '未知'
}
</script>

<style scoped>
.orders {
  max-width: 1200px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.toolbar-left {
  display: flex;
  gap: 12px;
  align-items: center;
}

.toolbar-right {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>