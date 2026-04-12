<!--
  About.vue - 关于页面
  展示应用介绍和使用说明

  知识点：
  1. 静态页面组件
  2. 模板语法（插值表达式）
  3. 样式绑定
-->

<template>
  <div class="about">

    <!-- 页面标题 -->
    <h1>关于本应用</h1>

    <!-- 介绍卡片 -->
    <div class="card">
      <h2>📖 项目介绍</h2>
      <p>
        这是一个使用 <strong>Vue3</strong> 开发的待办事项应用，
        用于学习和演示 Vue3 的核心功能。
      </p>
    </div>

    <!-- 技术栈卡片 -->
    <div class="card">
      <h2>🛠️ 技术栈</h2>
      <ul class="tech-list">
        <li>
          <span class="tech-name">Vue 3</span>
          <span class="tech-desc">渐进式 JavaScript 框架</span>
        </li>
        <li>
          <span class="tech-name">Vue Router</span>
          <span class="tech-desc">官方路由管理器</span>
        </li>
        <li>
          <span class="tech-name">Pinia</span>
          <span class="tech-desc">新一代状态管理工具</span>
        </li>
        <li>
          <span class="tech-name">Vite</span>
          <span class="tech-desc">下一代前端构建工具</span>
        </li>
      </ul>
    </div>

    <!-- 功能特性卡片 -->
    <div class="card">
      <h2>✨ 功能特性</h2>
      <ul class="feature-list">
        <li>✅ 添加待办事项</li>
        <li>✅ 标记完成/未完成</li>
        <li>✅ 删除待办事项</li>
        <li>✅ 本地存储持久化</li>
        <li>✅ 统计完成进度</li>
        <li>✅ 路由页面切换</li>
      </ul>
    </div>

    <!-- 使用说明卡片 -->
    <div class="card">
      <h2>📝 使用说明</h2>
      <ol class="guide-list">
        <li>在输入框输入待办内容，按回车或点击"添加"按钮</li>
        <li>点击复选框标记待办为已完成</li>
        <li>点击删除按钮移除待办</li>
        <li>数据会自动保存到浏览器本地存储</li>
      </ol>
    </div>

    <!-- 返回首页链接 -->
    <div class="back-link">
      <router-link to="/">← 返回首页</router-link>
    </div>

  </div>
</template>

<script setup>
// ============================================
// 这是一个静态页面，不需要复杂的逻辑
// ============================================

// 可以在这里添加一些页面逻辑
// 比如：获取应用版本号、统计信息等

console.log('关于页面已加载')
</script>

<style scoped>
/* 关于页面容器 */
.about {
  max-width: 700px;
  margin: 0 auto;
}

/* 页面标题 */
.about h1 {
  text-align: center;
  color: #42b883;
  margin-bottom: 30px;
}

/* 卡片样式 */
.card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card h2 {
  color: #35495e;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #42b883;
}

.card p {
  color: #666;
  line-height: 1.8;
}

/* 技术列表 */
.tech-list {
  list-style: none;
  padding: 0;
}

.tech-list li {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.tech-list li:last-child {
  border-bottom: none;
}

.tech-name {
  font-weight: bold;
  color: #42b883;
}

.tech-desc {
  color: #999;
}

/* 功能列表 */
.feature-list {
  list-style: none;
  padding: 0;
}

.feature-list li {
  padding: 8px 0;
  color: #666;
}

/* 使用说明列表 */
.guide-list {
  padding-left: 20px;
}

.guide-list li {
  padding: 8px 0;
  color: #666;
  line-height: 1.6;
}

/* 返回链接 */
.back-link {
  text-align: center;
  margin-top: 30px;
}

.back-link a {
  display: inline-block;
  padding: 10px 20px;
  background: #42b883;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  transition: background 0.3s;
}

.back-link a:hover {
  background: #35495e;
}
</style>
