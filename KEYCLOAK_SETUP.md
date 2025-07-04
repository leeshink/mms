# Keycloak 集成配置指南

## 🎯 概述

本项目已集成 Keycloak 作为身份认证和授权服务，支持单点登录 (SSO) 功能。

## 🔧 Keycloak 服务器配置

### 1. 创建 Realm

1. 登录 Keycloak 管理控制台
2. 创建新的 Realm，名称为 `mms`
3. 配置 Realm 设置：
   - Display name: `商户管理系统`
   - Enabled: `ON`

### 2. 创建客户端

1. 在 `mms` Realm 中创建新客户端
2. 客户端配置：
   ```
   Client ID: mms-frontend
   Client Protocol: openid-connect
   Access Type: public
   Standard Flow Enabled: ON
   Direct Access Grants Enabled: ON
   Valid Redirect URIs: 
     - http://localhost:12001/*
     - https://work-2-kmjxrrfghdojfzvc.prod-runtime.all-hands.dev/*
   Web Origins: 
     - http://localhost:12001
     - https://work-2-kmjxrrfghdojfzvc.prod-runtime.all-hands.dev
   ```

### 3. 创建角色

在 Realm 角色中创建以下角色：
- `admin` - 系统管理员
- `manager` - 管理人员
- `user` - 普通用户

### 4. 创建用户

1. 创建测试用户
2. 设置用户密码
3. 分配角色给用户

## 🌐 环境变量配置

### 开发环境 (.env.development)
```env
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=mms
VITE_KEYCLOAK_CLIENT_ID=mms-frontend
```

### 生产环境 (.env.production)
```env
VITE_KEYCLOAK_URL=https://keycloak.example.com
VITE_KEYCLOAK_REALM=mms
VITE_KEYCLOAK_CLIENT_ID=mms-frontend
```

## 🚀 功能特性

### 1. 自动 SSO 检查
- 页面加载时自动检查用户是否已登录
- 支持静默 SSO 检查
- 无需重复登录

### 2. Token 管理
- 自动 Token 刷新
- Token 过期处理
- 安全的 Token 存储

### 3. 角色权限
- 基于 Keycloak 角色的权限控制
- 支持 Realm 角色和客户端角色
- 细粒度权限管理

### 4. 登录模式
- **SSO 登录**: 跳转到 Keycloak 登录页面
- **传统登录**: 用户名密码登录（备用方案）
- 可通过环境变量控制登录模式

## 🔒 安全配置

### 1. PKCE 支持
- 启用 PKCE (Proof Key for Code Exchange)
- 增强授权码流安全性

### 2. Token 验证
- JWT Token 自动验证
- Token 签名验证
- Token 过期检查

### 3. CORS 配置
- 配置正确的跨域设置
- 限制允许的来源域名

## 📱 使用方式

### 1. 启用 Keycloak
确保环境变量正确配置，系统会自动启用 Keycloak 认证。

### 2. 禁用 Keycloak
如果需要使用传统登录，可以：
- 删除或注释 Keycloak 相关环境变量
- 系统会自动回退到传统认证模式

### 3. 混合模式
- 默认显示 SSO 登录按钮
- 提供"使用用户名密码登录"选项
- 用户可以选择登录方式

## 🛠️ 开发调试

### 1. 本地开发
```bash
# 启动 Keycloak (Docker)
docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:latest start-dev

# 启动前端项目
npm run dev
```

### 2. 调试信息
- 浏览器控制台查看 Keycloak 初始化日志
- 检查 Token 内容和过期时间
- 监控网络请求中的 Authorization 头

### 3. 常见问题

#### Keycloak 连接失败
- 检查 Keycloak 服务器是否运行
- 验证环境变量配置
- 检查网络连接和防火墙设置

#### Token 刷新失败
- 检查 Refresh Token 是否有效
- 验证客户端配置
- 检查 Token 过期时间设置

#### 角色权限问题
- 确认用户已分配正确角色
- 检查角色映射配置
- 验证 Token 中的角色信息

## 📋 配置检查清单

- [ ] Keycloak 服务器运行正常
- [ ] Realm `mms` 已创建
- [ ] 客户端 `mms-frontend` 已配置
- [ ] 角色 `admin`, `manager`, `user` 已创建
- [ ] 测试用户已创建并分配角色
- [ ] 环境变量正确配置
- [ ] 重定向 URI 正确设置
- [ ] CORS 配置正确

## 🔄 升级和维护

### 1. Keycloak 版本升级
- 备份 Realm 配置
- 测试新版本兼容性
- 更新客户端库版本

### 2. 配置备份
- 定期导出 Realm 配置
- 备份用户数据
- 记录自定义配置

### 3. 监控和日志
- 监控认证成功率
- 记录登录失败日志
- 分析用户行为数据

## 📞 技术支持

如果在配置过程中遇到问题，请检查：
1. Keycloak 官方文档
2. 浏览器开发者工具控制台
3. Keycloak 服务器日志
4. 网络连接状态

---

**注意**: 在生产环境中，请确保 Keycloak 服务器使用 HTTPS，并配置适当的安全策略。