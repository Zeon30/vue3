// composables/useLocalStorage.js - 本地存储的组合式函数
// 这是一个可复用的工具函数，封装了 localStorage 的操作
// 多个组件可以共享使用这个逻辑

// ============================================
// 引入依赖
// ============================================
import { ref, watch } from 'vue'

// ============================================
// 定义组合式函数
// ============================================
/**
 * 使用本地存储的响应式数据
 * @param {string} key - 存储的键名
 * @param {any} defaultValue - 默认值
 * @returns {ref} - 响应式的数据引用
 *
 * 使用示例：
 * const username = useLocalStorage('username', '游客')
 * username.value = '小明'  // 自动保存到 localStorage
 */
export function useLocalStorage(key, defaultValue = null) {

  // ============================================
  // 1. 从 localStorage 读取初始值
  // ============================================
  // 尝试从 localStorage 获取已保存的数据
  const savedValue = localStorage.getItem(key)

  // 如果有保存的数据，解析它；否则使用默认值
  let initialValue = defaultValue
  if (savedValue !== null) {
    try {
      // JSON.parse 将 JSON 字符串转为 JavaScript 值
      initialValue = JSON.parse(savedValue)
    } catch (e) {
      // 解析失败则使用默认值
      console.error(`解析 localStorage 数据失败: ${key}`, e)
      initialValue = defaultValue
    }
  }

  // ============================================
  // 2. 创建响应式数据
  // ============================================
  // ref 创建响应式引用
  const data = ref(initialValue)

  // ============================================
  // 3. 监听数据变化，自动保存
  // ============================================
  // watch 监听数据变化
  // 当 data.value 变化时，自动保存到 localStorage
  watch(
    () => data.value,  // 监听的源
    (newValue) => {
      // 数据变化时保存到 localStorage
      // JSON.stringify 将 JavaScript 值转为 JSON 字符串
      localStorage.setItem(key, JSON.stringify(newValue))
    },
    {
      deep: true  // 深度监听，对象内部变化也会触发
    }
  )

  // ============================================
  // 4. 返回响应式数据
  // ============================================
  // 返回 ref，组件可以直接使用
  return data
}

// ============================================
// 另一个实用的组合式函数：计数器
// ============================================
/**
 * 计数器组合式函数
 * @param {number} initialValue - 初始值
 * @returns {object} - 包含 count 和操作方法的对象
 *
 * 使用示例：
 * const { count, increment, decrement, reset } = useCounter(10)
 */
export function useCounter(initialValue = 0) {

  // 响应式计数
  const count = ref(initialValue)

  // 增加
  const increment = () => {
    count.value++
  }

  // 减少
  const decrement = () => {
    count.value--
  }

  // 重置
  const reset = () => {
    count.value = initialValue
  }

  // 返回数据和方法
  return {
    count,
    increment,
    decrement,
    reset
  }
}

// ============================================
// 说明
// ============================================
// 组合式函数（Composables）的优势：
// 1. 逻辑复用：多个组件可以共享同一套逻辑
// 2. 关注点分离：把特定功能抽离成独立模块
// 3. 测试友好：独立函数更容易测试
// 4. 类型推断：TypeScript 支持更好
//
// 使用场景：
// - 数据格式化
// - API 请求
// - 事件监听
// - 浏览器 API 封装
// - 任何需要复用的逻辑
