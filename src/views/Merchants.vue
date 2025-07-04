<template>
  <div class="merchants">
    <h1 class="page-title">商户管理</h1>
    
    <div class="page-card">
      <!-- 工具栏 -->
      <div class="toolbar">
        <div class="toolbar-left">
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索商户名称或编码"
            style="width: 300px"
            clearable
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-select
            v-model="searchForm.status"
            placeholder="状态"
            style="width: 120px"
            clearable
            @change="handleSearch"
          >
            <el-option label="活跃" value="active" />
            <el-option label="停用" value="inactive" />
            <el-option label="待审核" value="pending" />
          </el-select>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增商户
          </el-button>
        </div>
      </div>

      <!-- 表格 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="商户名称" min-width="150" />
        <el-table-column prop="code" label="商户编码" width="120" />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="contactPerson" label="联系人" width="100" />
        <el-table-column prop="phone" label="联系电话" width="130" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag
              :type="getStatusType(row.status) as 'primary' | 'success' | 'warning' | 'danger' | 'info'"
              size="small"
            >
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="registeredAt" label="注册时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              link
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              type="warning"
              size="small"
              link
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 'active' ? '停用' : '启用' }}
            </el-button>
            <el-button
              type="danger"
              size="small"
              link
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="商户名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商户名称" />
        </el-form-item>
        <el-form-item label="商户编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入商户编码" />
        </el-form-item>
        <el-form-item label="商户类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择商户类型" style="width: 100%">
            <el-option label="餐饮" value="restaurant" />
            <el-option label="零售" value="retail" />
            <el-option label="服务" value="service" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系人" prop="contactPerson">
          <el-input v-model="form.contactPerson" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input
            v-model="form.address"
            type="textarea"
            :rows="3"
            placeholder="请输入地址"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import type { Merchant, MerchantForm } from '@/types/merchant'

// 响应式数据
const loading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('新增商户')
const formRef = ref<FormInstance>()
const tableData = ref<Merchant[]>([])
const selectedRows = ref<Merchant[]>([])

// 搜索表单
const searchForm = reactive({
  keyword: '',
  status: ''
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// 表单数据
const form = reactive<MerchantForm>({
  name: '',
  code: '',
  type: '',
  contactPerson: '',
  phone: '',
  email: '',
  address: ''
})

// 表单验证规则
const formRules: FormRules = {
  name: [
    { required: true, message: '请输入商户名称', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入商户编码', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择商户类型', trigger: 'change' }
  ],
  contactPerson: [
    { required: true, message: '请输入联系人', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

// 当前编辑的商户ID
const editingId = ref<number | null>(null)

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    active: 'success',
    inactive: 'warning',
    pending: 'info'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    active: '活跃',
    inactive: '停用',
    pending: '待审核'
  }
  return textMap[status] || '未知'
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟数据
    const mockData: Merchant[] = [
      {
        id: 1,
        name: '张三餐厅',
        code: 'M001',
        type: '餐饮',
        status: 'active',
        contactPerson: '张三',
        phone: '13800138001',
        email: 'zhangsan@example.com',
        address: '北京市朝阳区xxx街道',
        registeredAt: '2024-01-15 10:30:00'
      },
      {
        id: 2,
        name: '李四超市',
        code: 'M002',
        type: '零售',
        status: 'active',
        contactPerson: '李四',
        phone: '13800138002',
        email: 'lisi@example.com',
        address: '上海市浦东新区xxx路',
        registeredAt: '2024-02-20 14:20:00'
      },
      {
        id: 3,
        name: '王五理发店',
        code: 'M003',
        type: '服务',
        status: 'pending',
        contactPerson: '王五',
        phone: '13800138003',
        email: 'wangwu@example.com',
        address: '广州市天河区xxx大道',
        registeredAt: '2024-03-10 09:15:00'
      }
    ]
    
    tableData.value = mockData
    pagination.total = mockData.length
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadData()
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增商户'
  editingId.value = null
  resetForm()
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: Merchant) => {
  dialogTitle.value = '编辑商户'
  editingId.value = row.id
  Object.assign(form, {
    name: row.name,
    code: row.code,
    type: row.type,
    contactPerson: row.contactPerson,
    phone: row.phone,
    email: row.email,
    address: row.address
  })
  dialogVisible.value = true
}

// 切换状态
const handleToggleStatus = async (row: Merchant) => {
  const action = row.status === 'active' ? '停用' : '启用'
  try {
    await ElMessageBox.confirm(`确定要${action}该商户吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    row.status = row.status === 'active' ? 'inactive' : 'active'
    ElMessage.success(`${action}成功`)
  } catch {
    // 用户取消
  }
}

// 删除
const handleDelete = async (row: Merchant) => {
  try {
    await ElMessageBox.confirm('确定要删除该商户吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = tableData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      tableData.value.splice(index, 1)
      pagination.total--
    }
    ElMessage.success('删除成功')
  } catch {
    // 用户取消
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        if (editingId.value) {
          // 编辑
          const index = tableData.value.findIndex(item => item.id === editingId.value)
          if (index > -1) {
            Object.assign(tableData.value[index], form)
          }
          ElMessage.success('编辑成功')
        } else {
          // 新增
          const newMerchant: Merchant = {
            id: Date.now(),
            ...form,
            status: 'pending',
            registeredAt: new Date().toLocaleString()
          }
          tableData.value.unshift(newMerchant)
          pagination.total++
          ElMessage.success('新增成功')
        }
        
        dialogVisible.value = false
      } catch (error) {
        ElMessage.error('操作失败')
      } finally {
        submitLoading.value = false
      }
    }
  })
}

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    name: '',
    code: '',
    type: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: ''
  })
  formRef.value?.clearValidate()
}

// 对话框关闭
const handleDialogClose = () => {
  resetForm()
}

// 选择变化
const handleSelectionChange = (selection: Merchant[]) => {
  selectedRows.value = selection
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadData()
}

// 当前页变化
const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadData()
}

// 初始化
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.merchants {
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
  flex-wrap: wrap;
  gap: 12px;
}

.toolbar-left {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.toolbar-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .toolbar-left,
  .toolbar-right {
    justify-content: center;
  }
}
</style>