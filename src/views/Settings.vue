<template>
  <div class="settings">
    <h1 class="page-title">系统设置</h1>
    
    <div class="settings-container">
      <el-tabs v-model="activeTab" type="border-card">
        <el-tab-pane label="基本设置" name="basic">
          <div class="setting-section">
            <h3>系统信息</h3>
            <el-form :model="basicForm" label-width="120px">
              <el-form-item label="系统名称">
                <el-input v-model="basicForm.systemName" style="width: 300px" />
              </el-form-item>
              <el-form-item label="系统版本">
                <el-input v-model="basicForm.version" style="width: 300px" readonly />
              </el-form-item>
              <el-form-item label="联系邮箱">
                <el-input v-model="basicForm.contactEmail" style="width: 300px" />
              </el-form-item>
              <el-form-item label="客服电话">
                <el-input v-model="basicForm.servicePhone" style="width: 300px" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary">保存设置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <el-tab-pane label="支付设置" name="payment">
          <div class="setting-section">
            <h3>支付配置</h3>
            <el-form :model="paymentForm" label-width="120px">
              <el-form-item label="微信支付">
                <el-switch v-model="paymentForm.wechatEnabled" />
              </el-form-item>
              <el-form-item label="支付宝">
                <el-switch v-model="paymentForm.alipayEnabled" />
              </el-form-item>
              <el-form-item label="银行卡支付">
                <el-switch v-model="paymentForm.bankCardEnabled" />
              </el-form-item>
              <el-form-item label="手续费率">
                <el-input-number
                  v-model="paymentForm.feeRate"
                  :min="0"
                  :max="10"
                  :precision="2"
                  :step="0.1"
                />
                <span style="margin-left: 8px;">%</span>
              </el-form-item>
              <el-form-item>
                <el-button type="primary">保存设置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <el-tab-pane label="安全设置" name="security">
          <div class="setting-section">
            <h3>安全配置</h3>
            <el-form :model="securityForm" label-width="120px">
              <el-form-item label="登录超时">
                <el-input-number
                  v-model="securityForm.sessionTimeout"
                  :min="30"
                  :max="1440"
                  :step="30"
                />
                <span style="margin-left: 8px;">分钟</span>
              </el-form-item>
              <el-form-item label="密码强度">
                <el-radio-group v-model="securityForm.passwordStrength">
                  <el-radio label="low">低</el-radio>
                  <el-radio label="medium">中</el-radio>
                  <el-radio label="high">高</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="双因子认证">
                <el-switch v-model="securityForm.twoFactorEnabled" />
              </el-form-item>
              <el-form-item label="IP白名单">
                <el-switch v-model="securityForm.ipWhitelistEnabled" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary">保存设置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <el-tab-pane label="通知设置" name="notification">
          <div class="setting-section">
            <h3>通知配置</h3>
            <el-form :model="notificationForm" label-width="120px">
              <el-form-item label="邮件通知">
                <el-switch v-model="notificationForm.emailEnabled" />
              </el-form-item>
              <el-form-item label="短信通知">
                <el-switch v-model="notificationForm.smsEnabled" />
              </el-form-item>
              <el-form-item label="系统消息">
                <el-switch v-model="notificationForm.systemMessageEnabled" />
              </el-form-item>
              <el-form-item label="通知频率">
                <el-select v-model="notificationForm.frequency" style="width: 200px">
                  <el-option label="实时" value="realtime" />
                  <el-option label="每小时" value="hourly" />
                  <el-option label="每日" value="daily" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary">保存设置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const activeTab = ref('basic')

const basicForm = reactive({
  systemName: '商户管理系统',
  version: 'v1.0.0',
  contactEmail: 'admin@example.com',
  servicePhone: '400-123-4567'
})

const paymentForm = reactive({
  wechatEnabled: true,
  alipayEnabled: true,
  bankCardEnabled: false,
  feeRate: 0.6
})

const securityForm = reactive({
  sessionTimeout: 120,
  passwordStrength: 'medium',
  twoFactorEnabled: false,
  ipWhitelistEnabled: false
})

const notificationForm = reactive({
  emailEnabled: true,
  smsEnabled: false,
  systemMessageEnabled: true,
  frequency: 'realtime'
})
</script>

<style scoped>
.settings {
  max-width: 1000px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
}

.settings-container {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.setting-section {
  padding: 20px;
}

.setting-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e4e7ed;
}

:deep(.el-tabs__content) {
  padding: 0;
}
</style>