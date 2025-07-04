<template>
  <div class="users">
    <h1 class="page-title">用户管理</h1>
    
    <div class="page-card">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索用户名或邮箱"
            style="width: 300px"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button type="primary">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-button type="primary">
            <el-icon><Plus /></el-icon>
            新增用户
          </el-button>
        </div>
      </div>

      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column prop="role" label="角色" width="100" />
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" link>编辑</el-button>
            <el-button type="danger" size="small" link>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const searchKeyword = ref('')
const tableData = ref([
  {
    id: 1,
    username: 'admin',
    name: '管理员',
    email: 'admin@example.com',
    role: '超级管理员',
    createdAt: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    username: 'operator',
    name: '操作员',
    email: 'operator@example.com',
    role: '操作员',
    createdAt: '2024-01-15 14:30:00'
  }
])
</script>

<style scoped>
.users {
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