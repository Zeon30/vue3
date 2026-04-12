// stores/todo.js - 待办事项的状态管理
// 使用 Pinia 创建一个集中管理待办事项数据的"仓库"
// 所有组件都可以直接访问这个仓库，不需要层层传递 props

// ============================================
// 引入依赖
// ============================================
import { defineStore } from 'pinia'  // Pinia 的定义 store 函数
import { ref, computed } from 'vue'  // Vue3 的响应式 API

// ============================================
// 定义 Todo Store
// ============================================
// defineStore 参数说明：
// 参数1：store 的唯一 id（字符串），用于 devtools 调试
// 参数2：store 的定义函数，返回 state、getters、actions
export const useTodoStore = defineStore('todo', () => {

  // ============================================
  // State（状态）- 存储数据
  // ============================================

  // 待办事项列表
  // ref() 创建响应式数据，数据变化时视图自动更新
  // 每个待办事项是一个对象：{ id, text, completed, createdAt }
  const todos = ref([])

  // ============================================
  // Getters（计算属性）- 派生数据
  // ============================================

  // 计算未完成的待办数量
  // computed() 创建计算属性，有缓存，依赖变化时自动重新计算
  const unfinishedCount = computed(() => {
    // filter() 过滤出未完成的待办，然后取长度
    return todos.value.filter(todo => !todo.completed).length
  })

  // 计算已完成的待办数量
  const finishedCount = computed(() => {
    return todos.value.filter(todo => todo.completed).length
  })

  // 计算总数量
  const totalCount = computed(() => {
    return todos.value.length
  })

  // ============================================
  // Actions（方法）- 修改数据的操作
  // ============================================

  /**
   * 添加待办事项
   * @param {string} text - 待办内容
   */
  const addTodo = (text) => {
    // 检查文本是否为空
    if (!text || !text.trim()) {
      alert('请输入待办内容')
      return
    }

    // 创建新的待办对象
    const newTodo = {
      id: Date.now(),           // 使用时间戳作为唯一 id
      text: text.trim(),        // 去除首尾空格
      completed: false,         // 默认未完成
      createdAt: new Date().toLocaleString()  // 创建时间
    }

    // 添加到列表开头（最新的在最前面）
    todos.value.unshift(newTodo)

    // 保存到本地存储
    saveToStorage()
  }

  /**
   * 删除待办事项
   * @param {number} id - 待办事项的 id
   */
  const removeTodo = (id) => {
    // findIndex() 找到要删除的待办的索引
    const index = todos.value.findIndex(todo => todo.id === id)

    // 如果找到了（index >= 0）
    if (index !== -1) {
      // splice() 从数组中删除该元素
      // 参数1：起始索引
      // 参数2：删除的元素个数
      todos.value.splice(index, 1)

      // 保存到本地存储
      saveToStorage()
    }
  }

  /**
   * 切换待办事项的完成状态
   * @param {number} id - 待办事项的 id
   */
  const toggleTodo = (id) => {
    // find() 找到对应的待办对象
    const todo = todos.value.find(todo => todo.id === id)

    // 如果找到了
    if (todo) {
      // 取反完成状态
      todo.completed = !todo.completed

      // 保存到本地存储
      saveToStorage()
    }
  }

  /**
   * 清空所有已完成的待办
   */
  const clearCompleted = () => {
    // filter() 过滤出未完成的待办，重新赋值
    todos.value = todos.value.filter(todo => !todo.completed)

    // 保存到本地存储
    saveToStorage()
  }

  /**
   * 全部标记为完成/未完成
   */
  const toggleAll = () => {
    // 检查是否全部已完成
    const allCompleted = todos.value.every(todo => todo.completed)

    // 如果全部已完成，则全部标记为未完成；否则全部标记为完成
    todos.value.forEach(todo => {
      todo.completed = !allCompleted
    })

    // 保存到本地存储
    saveToStorage()
  }

  // ============================================
  // 本地存储相关方法
  // ============================================

  // 本地存储的 key
  const STORAGE_KEY = 'vue3-todo-app'

  /**
   * 保存数据到本地存储
   * localStorage 是浏览器的本地存储 API
   * 数据会持久化保存，关闭浏览器后不会丢失
   */
  const saveToStorage = () => {
    // JSON.stringify() 将 JavaScript 对象转为 JSON 字符串
    // localStorage.setItem() 保存到本地存储
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value))
  }

  /**
   * 从本地存储加载数据
   */
  const loadFromStorage = () => {
    // localStorage.getItem() 从本地存储获取数据
    const saved = localStorage.getItem(STORAGE_KEY)

    // 如果有保存的数据
    if (saved) {
      try {
        // JSON.parse() 将 JSON 字符串转为 JavaScript 对象
        todos.value = JSON.parse(saved)
      } catch (e) {
        // 如果解析失败（数据损坏），清空数据
        console.error('加载本地数据失败:', e)
        todos.value = []
      }
    }
  }

  // ============================================
  // 返回需要暴露的内容
  // ============================================
  // 只有返回的内容才能在组件中访问
  return {
    // State
    todos,

    // Getters
    unfinishedCount,
    finishedCount,
    totalCount,

    // Actions
    addTodo,
    removeTodo,
    toggleTodo,
    clearCompleted,
    toggleAll,
    loadFromStorage  // 暴露加载方法，让组件在合适的时机调用
  }
})
