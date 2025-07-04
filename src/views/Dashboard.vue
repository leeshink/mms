<template>
  <div class="dashboard">
    <h1 class="page-title">仪表板</h1>
    
    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <el-icon size="32" color="#1890ff"><Shop /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.merchantCount }}</div>
          <div class="stat-label">商户总数</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <el-icon size="32" color="#52c41a"><User /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.userCount }}</div>
          <div class="stat-label">用户总数</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <el-icon size="32" color="#faad14"><Document /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.orderCount }}</div>
          <div class="stat-label">订单总数</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <el-icon size="32" color="#f5222d"><Money /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">¥{{ stats.totalAmount.toLocaleString() }}</div>
          <div class="stat-label">交易总额</div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-grid">
      <div class="chart-card">
        <div class="card-header">
          <h3>订单趋势</h3>
        </div>
        <div class="chart-container">
          <v-chart :option="orderTrendOption" style="height: 300px;" />
        </div>
      </div>
      
      <div class="chart-card">
        <div class="card-header">
          <h3>商户类型分布</h3>
        </div>
        <div class="chart-container">
          <v-chart :option="merchantTypeOption" style="height: 300px;" />
        </div>
      </div>
    </div>

    <!-- 最近活动 -->
    <div class="recent-activity">
      <div class="page-card">
        <div class="card-header">
          <h3>最近活动</h3>
        </div>
        <el-timeline>
          <el-timeline-item
            v-for="activity in recentActivities"
            :key="activity.id"
            :timestamp="activity.time"
            :type="activity.type as 'primary' | 'success' | 'warning' | 'danger' | 'info'"
          >
            {{ activity.content }}
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'

use([
  CanvasRenderer,
  LineChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

// 统计数据
const stats = ref({
  merchantCount: 1248,
  userCount: 8956,
  orderCount: 15632,
  totalAmount: 2856789
})

// 订单趋势图配置
const orderTrendOption = ref({
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月']
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    data: [820, 932, 901, 934, 1290, 1330],
    type: 'line',
    smooth: true,
    itemStyle: {
      color: '#1890ff'
    }
  }]
})

// 商户类型分布图配置
const merchantTypeOption = ref({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [{
    type: 'pie',
    radius: '50%',
    data: [
      { value: 335, name: '餐饮' },
      { value: 310, name: '零售' },
      { value: 234, name: '服务' },
      { value: 135, name: '其他' }
    ],
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }]
})

// 最近活动
const recentActivities = ref([
  {
    id: 1,
    content: '新商户"张三餐厅"注册成功',
    time: '2024-07-04 10:30',
    type: 'success'
  },
  {
    id: 2,
    content: '订单 #12345 支付完成',
    time: '2024-07-04 09:15',
    type: 'primary'
  },
  {
    id: 3,
    content: '用户"李四"完成实名认证',
    time: '2024-07-04 08:45',
    type: 'info'
  },
  {
    id: 4,
    content: '系统维护完成',
    time: '2024-07-03 23:00',
    type: 'warning'
  }
])

onMounted(() => {
  // 这里可以加载实际的统计数据
  console.log('Dashboard mounted')
})
</script>

<style scoped>
.dashboard {
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.chart-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  overflow: hidden;
}

.card-header {
  padding: 20px 24px 0;
  border-bottom: 1px solid #f0f0f0;
}

.card-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

.chart-container {
  padding: 20px;
}

.recent-activity {
  margin-bottom: 24px;
}

.page-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style>