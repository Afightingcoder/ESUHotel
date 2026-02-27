<div align="center">

# 🏨 EasyStay

**易宿 - 智慧出行酒店预订平台**

一款基于 React Native 开发的现代化酒店预订移动端应用

[![React Native](https://img.shields.io/badge/React_Native-0.73.4-61DAFB?style=flat-square&logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-green?style=flat-square)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-orange?style=flat-square)](LICENSE)

[功能特性](#-功能特性) • [快速开始](#-快速开始) • [项目结构](#-项目结构) • [技术栈](#-技术栈) • [截图预览](#-截图预览)

</div>

---

## 📖 项目简介

**EasyStay（易宿）** 是一款面向现代旅游出行场景的酒店预订移动端应用，致力于为用户提供便捷、高效的酒店搜索与预订体验。

通过简洁直观的交互设计，用户可以快速完成酒店查询、筛选、详情查看及预订等核心流程。项目采用组件化架构设计，具有高复用性、可维护性和扩展性。

### ✨ 核心亮点

- 🎯 **智能定位** - 集成高德地图SDK，一键获取当前位置
- 📅 **灵活日期** - 自定义日历组件，支持日期范围选择
- 🔍 **多维筛选** - 价格、星级、特色等多维度筛选条件
- 🏨 **详情丰富** - 图片轮播、设施展示、房型价格一目了然
- ✨ **流畅体验** - 页面转场动画、骨架屏加载、原生动画驱动

---

## 🚀 功能特性

### 📱 用户端功能

| 页面 | 功能模块 |
|------|---------|
| **酒店查询页** | Banner展示、位置选择、关键词搜索、日期选择、人数设置、价格星级筛选、快捷标签 |
| **酒店列表页** | 列表展示、多种排序、价格星级筛选、综合筛选、搜索条件修改、回到顶部 |
| **酒店详情页** | 图片轮播、信息展示、日期人数修改、房型列表、预订功能 |

### 🧩 组件化设计

项目封装了 **11个可复用组件**，组件复用率达 **72.7%**

```
UI组件 (7个)              业务组件 (4个)
├── Calendar          ├── LocationSelector
├── DateSelector      ├── PriceStarFilter
├── GuestModal        ├── SortFilter
├── GuestSelector     └── AdvancedFilter
├── LoadingModal
├── BookingSuccessModal
└── PageTransition
```

---

## 🛠 快速开始

### 环境要求

确保你的开发环境已安装以下工具：

| 工具 | 版本要求 |
|------|---------|
| Node.js | >= 18.x |
| JDK | 17.x |
| Android Studio | 最新版 |
| Xcode | >= 14.x (iOS开发) |

### 安装步骤

1️⃣ **克隆项目**

```bash
git clone https://github.com/your-username/EasyStay.git
cd EasyStay
```

2️⃣ **安装依赖**

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install
```

3️⃣ **iOS 安装 (仅 macOS)**

```bash
cd ios
pod install
cd ..
```

4️⃣ **配置定位SDK (可选)**

如需使用定位功能，请在以下文件中配置你的高德地图API Key：

- Android: `android/app/src/main/AndroidManifest.xml`
- iOS: `ios/EasyStay/AppDelegate.mm`

### 运行项目

**Android**

```bash
# 方式一：通过 npm
npm run android

# 方式二：直接运行
npx react-native run-android
```

**iOS**

```bash
# 方式一：通过 npm
npm run ios

# 方式二：直接运行
npx react-native run-ios
```

### 构建发布

**Android APK**

```bash
cd android
./gradlew assembleRelease
```

APK 输出位置：`android/app/build/outputs/apk/release/app-release.apk`

**iOS IPA**

通过 Xcode 打开 `ios/EasyStay.xcworkspace`，选择 Product → Archive 进行打包。

---

## 📂 项目结构

```
EasyStay/
├── android/                 # Android 原生工程
├── ios/                     # iOS 原生工程
├── src/
│   ├── components/          # 公共组件库
│   │   ├── Calendar.tsx         # 日历组件
│   │   ├── DateSelector.tsx     # 日期选择器
│   │   ├── GuestModal.tsx       # 人数选择弹窗
│   │   ├── GuestSelector.tsx    # 人数选择器
│   │   ├── LocationSelector.tsx # 位置选择器
│   │   ├── PriceStarFilter.tsx  # 价格星级筛选
│   │   ├── SortFilter.tsx       # 排序筛选
│   │   ├── AdvancedFilter.tsx   # 综合筛选
│   │   ├── LoadingModal.tsx     # 加载弹窗
│   │   ├── BookingSuccessModal.tsx
│   │   └── PageTransition.tsx   # 页面转场动画
│   │
│   ├── pages/               # 页面组件
│   │   ├── HotelSearch/         # 酒店查询页
│   │   ├── HotelList/           # 酒店列表页
│   │   └── HotelDetail/         # 酒店详情页
│   │
│   ├── utils/               # 工具函数
│   │   ├── api.ts               # API 封装
│   │   ├── dateUtils.ts         # 日期工具
│   │   └── mappings.ts          # 数据映射
│   │
│   ├── types/               # 类型定义
│   │   └── index.ts
│   │
│   └── data/                # 模拟数据
│       └── mockData.ts
│
├── App.tsx                  # 应用入口
├── package.json
└── README.md
```

---

## 💻 技术栈

| 类别 | 技术 |
|------|------|
| **框架** | React Native 0.73.4 |
| **语言** | TypeScript 5.0.4 |
| **定位** | react-native-amap-geolocation (高德地图) |
| **网络** | Fetch API |
| **构建** | Metro Bundler |
| **代码规范** | ESLint + Prettier |

---

## 📸 截图预览

<div align="center">

| 酒店查询页 | 酒店列表页 | 酒店详情页 |
|:---------:|:---------:|:---------:|
| ![查询页](https://img.cdn1.vip/i/69a14f2b5a3c5_1772179243.webp) | ![列表页](https://img.cdn1.vip/i/69a14f05e042a_1772179205.webp) | ![详情页](https://img.cdn1.vip/i/69a14efb10a79_1772179195.webp) |

</div>

---

## 🔧 核心设计

### 路由系统

采用轻量级自定义路由，基于 `useState` 实现，支持：
- 页面间参数传递（支持复杂对象）
- 前进/返回方向判断
- 页面转场动画触发

### 组件封装原则

| 原则 | 说明 |
|------|------|
| 单一职责 | 每个组件只负责一个功能 |
| 受控组件 | 状态由父组件管理，数据流清晰 |
| 配置化 | 筛选选项外置配置，便于扩展 |
| 性能优化 | memo + useMemo + useCallback |

### 性能优化策略

- **虚拟列表**：FlatList + getItemLayout 优化长列表
- **原生动画**：useNativeDriver 开启原生线程执行
- **渲染优化**：memo、useMemo、useCallback 减少重渲染
- **加载体验**：骨架屏 + Loading弹窗

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

<div align="center">

**Made with ❤️ by EasyStay Team**

[⬆ 返回顶部](#-easystay)

</div>
