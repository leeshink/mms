<template>
  <div class="finance">
    <h1 class="page-title">财务管理</h1>
    
    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-value">¥{{ stats.todayIncome.toLocaleString() }}</div>
          <div class="stat-label">今日收入</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-value">¥{{ stats.monthIncome.toLocaleString() }}</div>
          <div class="stat-label">本月收入</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-value">¥{{ stats.totalIncome.toLocaleString() }}</div>
          <div class="stat-label">总收入</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-value">{{ stats.pendingWithdraw }}</div>
          <div class="stat-label">待提现笔数</div>
        </div>
      </div>
    </div>

    <!-- 财务记录 -->
    <div class="page-card">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 240px"
          />
          <el-select v-model="typeFilter" placeholder="交易类型" style="width: 120px" clearable>
            <el-option label="收入" value="income" />
            <el-option label="提现" value="withdraw" />
            <el-option label="退款" value="refund" />
          </el-select>
          <el-button type="primary">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-button type="success">导出账单</el-button>
        </div>
      </div>

      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="流水号" width="120" />
        <el-table-column prop="merchantName" label="商户" width="120" />
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.type)" size="small">
              {{ getTypeText(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" width="120">
          <template #default="{ row }">
            <span :class="{ 'text-red': row.type === 'withdraw' || row.type === 'refund' }">
              {{ row.type === 'income' ? '+' : '-' }}¥{{ Math.abs(row.amount).toFixed(2) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="balance" label="余额" width="120">
          <template #default="{ row }">
            ¥{{ row.balance.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="150" />
        <el-table-column prop="createdAt" label="时间" width="160" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const dateRange = ref('')
const typeFilter = ref('')

const stats = ref({
  todayIncome: 15680,
  monthIncome: 456789,
  totalIncome: 2856789,
  pendingWithdraw: 12
})

const tableData = ref([
  {
    id: 'TXN202407040001',
    merchantName: '张三餐厅',
    type: 'income',
    amount: 128.50,
    balance: 15680.50,
    description: '订单支付',
    createdAt: '2024-07-04 10:31:00'
  },
  {
    id: 'TXN202407040002',
    merchantName: '李四超市',
    type: 'withdraw',
    amount: -500.00,
    balance: 15180.50,
    description: '商户提现',
    createdAt: '2024-07-04 09:15:00'
  },
  {
    id: 'TXN202407040003',
    merchantName: '王五理发店',
    type: 'refund',
    amount: -89.90,
    balance: 15090.60,
    description: '订单退款',
    createdAt: '2024-07-04 08:45:00'
  }
])

const getTypeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    income: 'success',
    withdraw: 'warning',
    refund: 'danger'
  }
  return colorMap[type] || 'info'
}

const getTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    income: '收入',
    withdraw: '提现',
    refund: '退款'
  }
  return textMap[type] || '未知'
}
</script>

<style scoped>
.finance {
  max-width: 1200px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.stat-content {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
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

.text-red {
  color: #f56565;
}
</style>