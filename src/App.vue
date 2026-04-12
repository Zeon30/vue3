<!--
  App.vue - 根组件
  这是整个应用的根组件，所有页面内容都在这里展示

  Vue 单文件组件（.vue）由三部分组成：
  1. <template> - 模板，写 HTML 结构
  2. <script setup> - 脚本，写 JavaScript 逻辑
  3. <style> - 样式，写 CSS
-->

<!-- ============================================ -->
<!-- 模板部分：定义组件的 HTML 结构 -->
<!-- ============================================ -->
<template>
  <!-- 最外层容器 -->
  <div id="app-container">

    <!-- Header 组件：显示标题和导航 -->
    <!-- 组件使用方式：直接写组件名作为标签 -->
    <Header />

    <!-- 主内容区域 -->
    <main class="main-content">

      <!-- router-view：路由出口 -->
      <!-- 根据当前 URL 显示对应的页面组件 -->
      <!-- 比如：访问 / 显示 Home.vue，访问 /about 显示 About.vue -->
      <router-view />

    </main>

    <!-- Footer 组件：显示底部信息 -->
    <footer class="footer">
      <p>Vue3 待办事项应用 - 学习项目</p>
    </footer>

  </div>
</template>

<!-- ============================================ -->
<!-- 脚本部分：定义组件的逻辑 -->
<!-- ============================================ -->
<script setup>
// <script setup> 是 Vue3 的语法糖
// 相比普通的 <script>，它更简洁，不需要 export default

// 引入 Header 组件
// 组件引入后可以直接在 template 中使用
import Header from './components/Header.vue'

// 这里可以写组件的逻辑代码
// 比如：响应式数据、计算属性、方法、生命周期钩子等

// 注意：这个根组件比较简单，主要起布局作用
// 具体的业务逻辑在各个子组件和页面组件中
</script>

<!-- ============================================ -->
<!-- 样式部分：定义组件的 CSS -->
<!-- ============================================ -->
<style>
/* 没有 scoped 属性，所以这里的样式是全局的 */

/* 整个应用容器的样式 */
#app-container {
  /* 使用 flex 布局，让内容垂直排列 */
  display: flex;
  flex-direction: column;
  /* 最小高度为视口高度，确保 footer 在底部 */
  min-height: 100vh;
}

/* 主内容区域样式 */
.main-content {
  /* flex: 1 让主内容区域占据剩余空间 */
  flex: 1;
  /* 内边距 */
  padding: 20px;
  /* 最大宽度，防止内容过宽 */
  max-width: 800px;
  /* 居中显示 */
  margin: 0 auto;
  width: 100%;
  /* 盒模型 */
  box-sizing: border-box;
}

/* 底部样式 */
.footer {
  /* 背景色 */
  background-color: #f5f5f5;
  /* 内边距 */
  padding: 20px;
  /* 文字居中 */
  text-align: center;
  /* 上边框 */
  border-top: 1px solid #ddd;
  /* 文字颜色 */
  color: #666;
}
</style>
