<!--
  Home.vue - 首页
  显示待办列表，是应用的主页面

  知识点：
  1. 生命周期钩子 onMounted
  2. v-for 列表渲染
  3. v-if 条件渲染
  4. 组件通信（props 和 emit）
  5. Pinia store 的使用
  6. 计算属性 computed
-->

<template>
  <div class="home">

    <!-- ============================================ -->
    <!-- 添加待办表单 -->
    <!-- ============================================ -->
    <!-- 监听子组件的 add 事件 -->
    <TodoForm @add="handleAdd" />

    <!-- ============================================ -->
    <!-- 操作按钮区 -->
    <!-- ============================================ -->
    <div class="actions" v-if="todoStore.totalCount > 0">

      <!-- 全部标记按钮 -->
      <button @click="todoStore.toggleAll" class="btn-action">
        {{ allCompleted ? '全部取消' : '全部完成' }}
      </button>

      <!-- 清除已完成按钮 -->
      <button
        @click="handleClearCompleted"
        class="btn-action btn-danger"
        :disabled="todoStore.finishedCount === 0"
      >
        清除已完成 ({{ todoStore.finishedCount }})
      </button>

    </div>

    <!-- ============================================ -->
    <!-- 待办列表 -->
    <!-- ============================================ -->
    <!-- v-if：条件渲染，没有待办时显示提示 -->
    <div v-if="todoStore.todos.length === 0" class="empty-state">
      <p>🎉 暂无待办事项</p>
      <p class="hint">在上方输入框添加新的待办吧！</p>
    </div>

    <!-- v-else：有待办时显示列表 -->
    <ul v-else class="todo-list">

      <!-- v-for：循环渲染待办项 -->
      <!-- :key 是必须的，帮助 Vue 识别每个元素 -->
      <!-- :todo 传递数据给子组件 -->
      <!-- @toggle @delete 监听子组件事件 -->
      <TodoItem
        v-for="todo in todoStore.todos"
        :key="todo.id"
        :todo="todo"
        @toggle="handleToggle"
        @delete="handleDelete"
      />

    </ul>

    <!-- ============================================ -->
    <!-- 统计信息 -->
    <!-- ============================================ -->
    <div class="stats" v-if="todoStore.totalCount > 0">
      <p>
        共 {{ todoStore.totalCount }} 条待办，
        已完成 {{ todoStore.finishedCount }} 条，
        未完成 {{ todoStore.unfinishedCount }} 条
      </p>

      <!-- 进度条 -->
      <div class="progress-bar">
        <div
          class="progress"
          :style="{ width: progressPercent + '%' }"
        ></div>
      </div>
      <p class="progress-text">完成进度：{{ progressPercent }}%</p>
    </div>

  </div>
</template>

<script setup>
// ============================================
// 引入依赖
// ============================================
import { computed, onMounted } from 'vue'
import { useTodoStore } from '../stores/todo'
import TodoForm from '../components/TodoForm.vue'
import TodoItem from '../components/TodoItem.vue'

// ============================================
// 使用 Store
// ============================================
const todoStore = useTodoStore()

// ============================================
// 计算属性
// ============================================

// 是否全部已完成
const allCompleted = computed(() => {
  // every() 检查是否所有待办都已完成
  // 如果列表为空，every() 返回 true，所以需要额外判断
  return todoStore.totalCount > 0 &&
         todoStore.todos.every(todo => todo.completed)
})

// 完成进度百分比
const progressPercent = computed(() => {
  if (todoStore.totalCount === 0) return 0
  // Math.round() 四舍五入
  return Math.round((todoStore.finishedCount / todoStore.totalCount) * 100)
})

// ============================================
// 生命周期钩子
// ============================================
// onMounted：组件挂载后执行
// 在这里从本地存储加载数据
onMounted(() => {
  // 调用 store 的加载方法
  todoStore.loadFromStorage()
  console.log('首页已挂载，数据已加载')
})

// ============================================
// 方法
// ============================================

/**
 * 处理添加待办
 * @param {string} text - 待办内容
 */
const handleAdd = (text) => {
  // 调用 store 的添加方法
  todoStore.addTodo(text)
}

/**
 * 处理切换完成状态
 * @param {number} id - 待办 id
 */
const handleToggle = (id) => {
  // 调用 store 的切换方法
  todoStore.toggleTodo(id)
}

/**
 * 处理删除待办
 * @param {number} id - 待办 id
 */
const handleDelete = (id) => {
  // 调用 store 的删除方法
  todoStore.removeTodo(id)
}

/**
 * 处理清除已完成
 */
const handleClearCompleted = () => {
  if (confirm('确定要清除所有已完成的待办吗？')) {
    todoStore.clearCompleted()
  }
}

// ============================================
// 说明
// ============================================
// 这个页面展示了 Vue3 组件的核心用法：
// 1. 使用 Pinia store 管理状态
// 2. 使用生命周期钩子初始化数据
// 3. 使用计算属性派生数据
// 4. 与子组件通信（props + emit）
// 5. 条件渲染和列表渲染
</script>

<style scoped>
/* 首页容器 */
.home {
  max-width: 600px;
  margin: 0 auto;
}

/* 操作按钮区 */
.actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

/* 操作按钮 */
.btn-action {
  padding: 10px 15px;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-action:hover:not(:disabled) {
  background: #e0e0e0;
}

.btn-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 危险按钮 */
.btn-danger {
  background: #fff1f0;
  border-color: #ffa39e;
  color: #ff4d4f;
}

.btn-danger:hover:not(:disabled) {
  background: #ffccc7;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 8px;
  border: 2px dashed #ddd;
}

.empty-state p {
  font-size: 18px;
  color: #666;
  margin-bottom: 10px;
}

.empty-state .hint {
  font-size: 14px;
  color: #999;
}

/* 待办列表 */
.todo-list {
  /* 移除默认的列表样式和内外边距 */
  list-style: none;
  padding: 0;
  margin: 0;
}

/* 统计信息 */
.stats {
  margin-top: 30px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  text-align: center;
}

.stats p {
  color: #666;
  margin-bottom: 10px;
}

/* 进度条 */
.progress-bar {
  height: 10px;
  background: #f0f0f0;
  border-radius: 5px;
  overflow: hidden;
  margin: 10px 0;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #42b883, #35495e);
  border-radius: 5px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 14px;
  color: #42b883;
  font-weight: bold;
}
</style>
