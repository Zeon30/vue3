<!--
  NotFound.vue - 404 页面
  当访问不存在的路由时显示

  知识点：
  1. 路由匹配
  2. 简单的静态页面
-->

<template>
  <div class="not-found">
    <!-- 404 图标 -->
    <div class="error-code">404</div>

    <!-- 提示文字 -->
    <h1>页面未找到</h1>
    <p>抱歉，您访问的页面不存在</p>

    <!-- 返回首页按钮 -->
    <router-link to="/" class="home-link">返回首页</router-link>
  </div>
</template>

<script setup>
// 简单的静态页面，不需要额外逻辑
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 80px 20px;
}

.error-code {
  font-size: 120px;
  font-weight: bold;
  color: #42b883;
  line-height: 1;
  margin-bottom: 20px;
}

.not-found h1 {
  color: #35495e;
  margin-bottom: 15px;
}

.not-found p {
  color: #999;
  margin-bottom: 30px;
}

.home-link {
  display: inline-block;
  padding: 12px 30px;
  background: #42b883;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-size: 16px;
  transition: background 0.3s;
}

.home-link:hover {
  background: #35495e;
}
</style>
