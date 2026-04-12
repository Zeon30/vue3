<!--
  TodoDetail.vue - 待办详情页面
  展示单条待办的详细信息

  知识点：
  1. 获取路由参数 useRoute
  2. 计算属性
  3. v-if 条件渲染
  4. 编程式导航 useRouter
-->

<template>
  <div class="todo-detail">

    <!-- 加载中状态 -->
    <div v-if="!todo" class="not-found">
      <p>😅 找不到该待办事项</p>
      <router-link to="/" class="back-btn">返回首页</router-link>
    </div>

    <!-- 详情内容 -->
    <div v-else class="detail-card">

      <!-- 标题 -->
      <h1>待办详情</h1>

      <!-- 信息列表 -->
      <div class="info-list">

        <!-- ID -->
        <div class="info-item">
          <span class="label">ID：</span>
          <span class="value">{{ todo.id }}</span>
        </div>

        <!-- 内容 -->
        <div class="info-item">
          <span class="label">内容：</span>
          <span class="value" :class="{ completed: todo.completed }">
            {{ todo.text }}
          </span>
        </div>

        <!-- 状态 -->
        <div class="info-item">
          <span class="label">状态：</span>
          <span class="value">
            <!-- 动态显示状态 -->
            <span :class="todo.completed ? 'status-done' : 'status-pending'">
              {{ todo.completed ? '✅ 已完成' : '⏳ 进行中' }}
            </span>
          </span>
        </div>

        <!-- 创建时间 -->
        <div class="info-item">
          <span class="label">创建时间：</span>
          <span class="value">{{ todo.createdAt }}</span>
        </div>

      </div>

      <!-- 操作按钮 -->
      <div class="actions">

        <!-- 切换状态按钮 -->
        <button @click="toggleStatus" class="btn-toggle">
          {{ todo.completed ? '标记为未完成' : '标记为已完成' }}
        </button>

        <!-- 返回按钮 -->
        <button @click="goBack" class="btn-back">返回</button>

      </div>

    </div>

  </div>
</template>

<script setup>
// ============================================
// 引入依赖
// ============================================
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTodoStore } from '../stores/todo'

// ============================================
// 获取路由和 store
// ============================================
// useRoute() 获取当前路由信息
// 可以从中获取路由参数、查询参数等
const route = useRoute()

// useRouter() 获取路由实例
// 可以用于编程式导航（跳转页面）
const router = useRouter()

// 获取 store
const todoStore = useTodoStore()

// ============================================
// 计算属性
// ============================================
// 根据路由参数中的 id 查找对应的待办
const todo = computed(() => {
  // route.params.id 获取动态路由参数
  // 注意：路由参数是字符串，需要转换为数字
  const id = Number(route.params.id)

  // 在 store 中查找对应的待办
  return todoStore.todos.find(t => t.id === id)
})

// ============================================
// 方法
// ============================================

/**
 * 切换完成状态
 */
const toggleStatus = () => {
  if (todo.value) {
    todoStore.toggleTodo(todo.value.id)
  }
}

/**
 * 返回上一页
 */
const goBack = () => {
  // router.back() 返回上一页
  // 等同于 router.go(-1)
  router.back()
}

// ============================================
// 说明
// ============================================
// 这个页面展示了：
// 1. 如何获取动态路由参数
// 2. 如何使用计算属性查找数据
// 3. 如何进行编程式导航
</script>

<style scoped>
/* 详情页面容器 */
.todo-detail {
  max-width: 600px;
  margin: 0 auto;
}

/* 未找到状态 */
.not-found {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 8px;
}

.not-found p {
  font-size: 20px;
  color: #666;
  margin-bottom: 20px;
}

.back-btn {
  display: inline-block;
  padding: 10px 20px;
  background: #42b883;
  color: white;
  border-radius: 4px;
  text-decoration: none;
}

/* 详情卡片 */
.detail-card {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.detail-card h1 {
  color: #42b883;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #eee;
}

/* 信息列表 */
.info-list {
  margin-bottom: 30px;
}

.info-item {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item .label {
  width: 100px;
  color: #999;
  flex-shrink: 0;
}

.info-item .value {
  color: #333;
  flex: 1;
}

/* 已完成状态文字 */
.info-item .value.completed {
  text-decoration: line-through;
  color: #999;
}

/* 状态标签 */
.status-done {
  color: #52c41a;
}

.status-pending {
  color: #faad14;
}

/* 操作按钮 */
.actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.btn-toggle {
  padding: 12px 25px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.btn-toggle:hover {
  background: #35495e;
}

.btn-back {
  padding: 12px 25px;
  background: #f0f0f0;
  color: #666;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.btn-back:hover {
  background: #e0e0e0;
}
</style>
