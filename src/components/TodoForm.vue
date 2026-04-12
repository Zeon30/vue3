<!--
  TodoForm.vue - 添加待办的表单组件
  包含输入框和提交按钮

  知识点：
  1. v-model 双向绑定
  2. 表单提交处理
  3. 事件修饰符 (.prevent)
  4. ref 响应式数据
-->

<template>
  <!-- 表单容器 -->
  <!-- @submit.prevent 绑定提交事件，.prevent 阻止默认行为（页面刷新） -->
  <form class="todo-form" @submit.prevent="handleSubmit">

    <!-- 输入框容器 -->
    <div class="input-group">

      <!-- 输入框 -->
      <!-- v-model 双向绑定到 inputText -->
      <!-- 用户输入的内容会自动同步到 inputText 变量 -->
      <!-- placeholder 设置占位提示文字 -->
      <input
        v-model="inputText"
        type="text"
        class="todo-input"
        placeholder="输入新的待办事项..."
        maxlength="100"
      />

      <!-- 提交按钮 -->
      <!-- :disabled 动态绑定禁用状态 -->
      <!-- 当 inputText 为空时禁用按钮 -->
      <button
        type="submit"
        class="btn-add"
        :disabled="!inputText.trim()"
      >
        添加
      </button>

    </div>

    <!-- 提示文字 -->
    <p class="hint">按 Enter 键快速添加</p>

  </form>
</template>

<script setup>
// ============================================
// 引入依赖
// ============================================
import { ref } from 'vue'

// ============================================
// 定义 Emits
// ============================================
// 定义 add 事件，用于通知父组件添加待办
const emit = defineEmits(['add'])

// ============================================
// 响应式数据
// ============================================
// ref() 创建响应式变量
// inputText 存储用户输入的内容
const inputText = ref('')

// ============================================
// 方法
// ============================================

/**
 * 处理表单提交
 */
const handleSubmit = () => {
  // 获取输入内容并去除首尾空格
  const text = inputText.value.trim()

  // 检查是否为空
  if (!text) {
    return
  }

  // 触发 add 事件，把输入内容传给父组件
  emit('add', text)

  // 清空输入框
  inputText.value = ''
}

// ============================================
// 说明
// ============================================
// 这个组件展示了表单处理的基本模式：
// 1. v-model 绑定表单输入
// 2. @submit.prevent 处理表单提交
// 3. emit 通知父组件
// 4. 提交后清空表单
</script>

<style scoped>
/* 表单容器 */
.todo-form {
  margin-bottom: 20px;
}

/* 输入框容器 */
.input-group {
  display: flex;
  gap: 10px;
}

/* 输入框 */
.todo-input {
  flex: 1;              /* 占据剩余空间 */
  padding: 12px 15px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  transition: border-color 0.3s;
}

/* 输入框聚焦 */
.todo-input:focus {
  border-color: #42b883;
  outline: none;
}

/* 添加按钮 */
.btn-add {
  padding: 12px 25px;
  font-size: 16px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

/* 按钮悬停 */
.btn-add:hover:not(:disabled) {
  background: #35495e;
}

/* 禁用状态 */
.btn-add:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* 提示文字 */
.hint {
  margin-top: 8px;
  font-size: 12px;
  color: #999;
}
</style>
