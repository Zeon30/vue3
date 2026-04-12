<!--
  Header.vue - 头部组件
  显示应用标题和导航链接

  知识点：
  1. 组件的基本结构
  2. router-link 路由跳转
  3. 响应式数据 ref
  4. 计算属性 computed
  5. Pinia store 的使用
-->

<template>
  <!-- 头部容器 -->
  <header class="header">

    <!-- 左侧：标题 -->
    <div class="header-left">
      <!-- router-link 是 Vue Router 提供的组件 -->
      <!-- to 属性指定跳转的目标路径 -->
      <!-- 它会被渲染成 <a> 标签，但不会刷新页面 -->
      <router-link to="/" class="logo">
        <h1>📝 待办事项</h1>
      </router-link>
    </div>

    <!-- 右侧：导航和统计 -->
    <div class="header-right">

      <!-- 统计信息：显示未完成数量 -->
      <!-- 使用 Pinia store 中的计算属性 -->
      <span class="stats" v-if="todoStore.totalCount > 0">
        未完成: {{ todoStore.unfinishedCount }} / {{ todoStore.totalCount }}
      </span>

      <!-- 导航链接 -->
      <nav class="nav">

        <!-- router-link 的激活状态 -->
        <!-- 当当前路由匹配 to 时，会自动添加 router-link-active 类 -->
        <!-- 我们可以用这个类来设置激活样式 -->
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/about" class="nav-link">关于</router-link>

      </nav>

    </div>

  </header>
</template>

<script setup>
// ============================================
// 引入依赖
// ============================================
import { useTodoStore } from '../stores/todo'

// ============================================
// 使用 Store
// ============================================
// 调用 useTodoStore() 获取 store 实例
// 之后可以通过 todoStore.xxx 访问 store 中的数据和方法
const todoStore = useTodoStore()

// ============================================
// 说明
// ============================================
// 这个组件展示了如何在组件中使用 Pinia store
// 1. 引入 store 定义函数
// 2. 调用函数获取 store 实例
// 3. 在模板中直接使用 store 的数据和方法
//
// 不需要 props 传递，不需要 emit 通知
// 所有使用这个 store 的组件都能获取到相同的、同步的数据
</script>

<style scoped>
/* scoped 表示样式只作用于当前组件 */

/* 头部容器样式 */
.header {
  /* 背景色：Vue 的绿色 */
  background: linear-gradient(135deg, #42b883, #35495e);

  /* 内边距 */
  padding: 15px 20px;

  /* 弹性布局，左右分布 */
  display: flex;
  justify-content: space-between;
  align-items: center;

  /* 固定在顶部 */
  position: sticky;
  top: 0;

  /* 层级最高，防止被其他元素遮挡 */
  z-index: 100;

  /* 阴影 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 左侧区域 */
.header-left .logo {
  /* 移除链接默认样式 */
  text-decoration: none;
}

.header-left h1 {
  color: white;
  font-size: 24px;
  margin: 0;
}

/* 右侧区域 */
.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* 统计信息 */
.stats {
  color: white;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.2);
  padding: 5px 10px;
  border-radius: 15px;
}

/* 导航 */
.nav {
  display: flex;
  gap: 10px;
}

/* 导航链接 */
.nav-link {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

/* 链接悬停效果 */
.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 激活状态的链接 */
/* router-link-active 是 Vue Router 自动添加的类 */
.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.3);
  font-weight: bold;
}
</style>
