<!--
  TodoItem.vue - 单个待办事项组件
  显示一条待办事项，支持完成、删除操作

  知识点：
  1. props 接收父组件传递的数据
  2. emit 向父组件发送事件
  3. v-model 双向绑定（复选框）
  4. 条件渲染 v-if
  5. 动态 class 绑定
-->

<template>
  <!-- 待办项容器 -->
  <!-- :class 动态绑定类名 -->
  <!-- 当 todo.completed 为 true 时，添加 'completed' 类 -->
  <li class="todo-item" :class="{ completed: todo.completed }">

    <!-- 左侧：复选框和文本 -->
    <div class="todo-content">

      <!-- 复选框 -->
      <!-- v-model 双向绑定到 todo.completed -->
      <!-- 用户勾选时，todo.completed 自动更新 -->
      <!-- 但注意：直接修改 props 是不推荐的，这里简化演示 -->
      <input
        type="checkbox"
        :checked="todo.completed"
        @change="handleToggle"
        class="checkbox"
      />

      <!-- 待办文本 -->
      <!-- 根据 completed 状态显示不同样式 -->
      <span class="todo-text" :class="{ 'text-completed': todo.completed }">
        {{ todo.text }}
      </span>

    </div>

    <!-- 右侧：时间和操作按钮 -->
    <div class="todo-actions">

      <!-- 创建时间 -->
      <span class="created-time">{{ todo.createdAt }}</span>

      <!-- 查看详情按钮 -->
      <!-- 使用 router-link 跳转到详情页 -->
      <!-- :to 动态绑定跳转路径 -->
      <router-link
        :to="{ name: 'TodoDetail', params: { id: todo.id } }"
        class="btn-detail"
        title="查看详情"
      >
        👁️
      </router-link>

      <!-- 删除按钮 -->
      <!-- @click 绑定点击事件 -->
      <button
        @click="handleDelete"
        class="btn-delete"
        title="删除"
      >
        🗑️
      </button>

    </div>

  </li>
</template>

<script setup>
// ============================================
// 定义 Props（接收父组件传递的数据）
// ============================================
// defineProps() 定义组件接收的属性
// 父组件使用 <TodoItem :todo="xxx" /> 传递数据
const props = defineProps({
  // todo 属性的定义
  todo: {
    // 类型：对象
    type: Object,

    // 是否必须
    required: true,

    // 默认值（对象类型要用函数返回）
    default: () => ({
      id: 0,
      text: '',
      completed: false,
      createdAt: ''
    })
  }
})

// ============================================
// 定义 Emits（向父组件发送事件）
// ============================================
// defineEmits() 定义组件可以触发的事件
// 父组件使用 <TodoItem @toggle="xxx" @delete="xxx" /> 监听事件
const emit = defineEmits(['toggle', 'delete'])

// ============================================
// 事件处理函数
// ============================================

/**
 * 处理切换完成状态
 */
const handleToggle = () => {
  // emit() 触发事件
  // 参数1：事件名称
  // 参数2：传递的数据
  emit('toggle', props.todo.id)
}

/**
 * 处理删除
 */
const handleDelete = () => {
  // 确认删除
  if (confirm('确定要删除这条待办吗？')) {
    emit('delete', props.todo.id)
  }
}

// ============================================
// 说明
// ============================================
// 这个组件展示了父子组件通信的标准模式：
// 1. 父组件通过 props 传递数据给子组件
// 2. 子组件通过 emit 发送事件通知父组件
// 3. 父组件监听事件并执行相应操作
//
// 这样可以保持数据流的清晰：
// 数据向下流动（props），事件向上冒泡（emit）
</script>

<style scoped>
/* 待办项容器 */
.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 15px;

  background: white;
  border: 1px solid #eee;
  border-radius: 8px;

  margin-bottom: 10px;

  transition: all 0.3s ease;
}

/* 悬停效果 */
.todo-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* 已完成状态 */
.todo-item.completed {
  background: #f9f9f9;
  border-color: #42b883;
}

/* 左侧内容 */
.todo-content {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

/* 复选框 */
.checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

/* 待办文本 */
.todo-text {
  font-size: 16px;
  color: #333;
}

/* 已完成的文本样式 */
.text-completed {
  text-decoration: line-through;
  color: #999;
}

/* 右侧操作区 */
.todo-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 创建时间 */
.created-time {
  font-size: 12px;
  color: #999;
}

/* 详情按钮 */
.btn-detail {
  text-decoration: none;
  font-size: 16px;
  padding: 5px 10px;
  background: #f0f0f0;
  border-radius: 4px;
  transition: background 0.3s;
}

.btn-detail:hover {
  background: #e0e0e0;
}

/* 删除按钮 */
.btn-delete {
  background: #ff4d4f;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
}

.btn-delete:hover {
  background: #ff7875;
}
</style>
