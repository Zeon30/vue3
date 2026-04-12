// vite.config.js - Vite 构建工具的配置文件
// Vite 是一个现代化的前端构建工具，启动速度快，支持热更新

import { defineConfig } from 'vite'  // 引入 Vite 的配置定义函数
import vue from '@vitejs/plugin-vue'  // 引入 Vue 插件，让 Vite 能处理 .vue 文件

// 导出配置
export default defineConfig({
  // 插件配置
  plugins: [
    vue()  // 启用 Vue 插件
  ],

  // 开发服务器配置
  server: {
    port: 3000,        // 开发服务器端口
    open: true         // 启动时自动打开浏览器
  }
})
