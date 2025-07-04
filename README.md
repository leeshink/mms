# 商户管理系统 (MMS)
Merchant Management System Frontend

一个现代化的内部运营系统前端项目，基于 Vue 3 + TypeScript + Vite + Element Plus 构建。

## 🚀 功能特性

- **现代化技术栈**: Vue 3 + TypeScript + Vite + Element Plus
- **响应式设计**: 支持桌面端和移动端
- **完整的权限管理**: 基于角色的访问控制
- **丰富的组件库**: 基于 Element Plus 的 UI 组件
- **数据可视化**: 集成 ECharts 图表库
- **模块化架构**: 清晰的代码组织结构

## 📋 主要模块

- **仪表板**: 数据统计和图表展示
- **商户管理**: 商户信息的增删改查
- **用户管理**: 系统用户管理
- **订单管理**: 订单查询和处理
- **财务管理**: 财务数据和流水记录
- **系统设置**: 系统配置和参数设置

## 🛠️ 技术栈

- **框架**: Vue 3.4+
- **语言**: TypeScript
- **构建工具**: Vite 5+
- **UI 库**: Element Plus 2.4+
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **图表**: ECharts + Vue-ECharts
- **HTTP 客户端**: Axios
- **代码规范**: ESLint + Prettier

## 📦 安装和运行

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 开发环境运行
```bash
npm run dev
```

### 生产环境构建
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

## 🌐 访问地址

- 开发环境: http://localhost:12001
- 生产环境: https://work-2-kmjxrrfghdojfzvc.prod-runtime.all-hands.dev

## 👤 默认账号

- 用户名: `admin`
- 密码: `admin123`

## 📁 项目结构

```
src/
├── api/              # API 接口
├── assets/           # 静态资源
│   ├── images/       # 图片资源
│   └── styles/       # 样式文件
├── components/       # 公共组件
├── router/           # 路由配置
├── stores/           # 状态管理
├── types/            # TypeScript 类型定义
├── utils/            # 工具函数
├── views/            # 页面组件
├── App.vue           # 根组件
└── main.ts           # 入口文件
```

## 🔧 配置说明

### 环境变量
- `.env` - 通用环境变量
- `.env.development` - 开发环境变量
- `.env.production` - 生产环境变量

### 主要配置项
- `VITE_API_BASE_URL` - 后端 API 地址
- `VITE_APP_TITLE` - 应用标题

## 🎯 开发指南

### 添加新页面
1. 在 `src/views/` 下创建页面组件
2. 在 `src/router/index.ts` 中添加路由配置
3. 如需要，在侧边栏菜单中添加导航

### 添加新的 API
1. 在 `src/types/` 下定义数据类型
2. 在 `src/api/` 下创建 API 接口文件
3. 在组件中调用 API

### 状态管理
使用 Pinia 进行状态管理，store 文件位于 `src/stores/` 目录下。

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。
