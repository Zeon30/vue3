# Vue3 核心笔记

> Vue3 是一个 JavaScript 工具包，可以让网页自动跟着数据变化【响应式】，并且防止重复造轮子【网页组件化】

---

## 一、响应式数据

### ref

定义单个变量，需要用 `.value` 去修改值

```javascript
import { ref } from 'vue'

const count = ref(0)
count.value = 10  // 修改值需要 .value
```

### reactive

定义对象或数组，可以直接用对象的属性名去访问

```javascript
import { reactive } from 'vue'

const user = reactive({
  name: '小明',
  age: 18
})
user.name = '小红'  // 直接访问，不需要 .value
```

---

## 二、模板语法

### 指令

用 `v-` 开头，告诉 Vue 要如何处理 DOM 元素

| 指令 | 作用 |
|------|------|
| `v-if` / `v-else` | 条件渲染 |
| `v-for` | 列表循环 |
| `v-bind` (简写 `:`) | 绑定属性 |
| `v-on` (简写 `@`) | 绑定事件 |
| `v-model` | 双向绑定 |

### 计算属性 computed

数据一变自动重新计算

```javascript
import { computed } from 'vue'

const fullName = computed(() => {
  return firstName.value + lastName.value
})
```

### 监听器 watch

数据一变自动执行操作

```javascript
import { watch } from 'vue'

watch(count, (newValue, oldValue) => {
  console.log(`从 ${oldValue} 变成 ${newValue}`)
})
```

---

## 三、父子组件通信

### 父传子

```vue
<!-- 父组件 -->
<Child :data="xxx" />
```

```vue
<!-- 子组件 -->
<script setup>
const props = defineProps(['data'])
</script>
```

### 子传父

```vue
<!-- 父组件 -->
<Child @task="handleTask" />
```

```vue
<!-- 子组件 -->
<script setup>
const emit = defineEmits(['task'])

const doSomething = () => {
  emit('task', data)  // 发出事件
}
</script>
```

### 双向绑定 v-model

```vue
<!-- 父组件 -->
<Child v-model="value" />
```

```vue
<!-- 子组件 -->
<script setup>
defineProps(['modelValue'])
defineEmits(['update:modelValue'])
</script>
```

---

## 四、组件生命周期

```
创建 script setup()
    │
    │  初始化数据 + 设置响应式
    │
    ▼
挂载到页面 onMounted()
    │
    │  生成 DOM，显示在页面上
    │  适合：发请求、操作 DOM
    │
    ▼
更新 onUpdated()（可选）
    │
    │  数据变化时重新渲染
    │
    ▼
销毁 onUnmounted()
    │
    │  切换新页面 / 弹窗关闭时触发
    │  适合：清理定时器、移除监听
    │
    ▼
组件消失
```

---

## 五、组合式函数 Composables

将可复用逻辑单独拎出来，让多组件共享

### 定义

```javascript
// composables/useCounter.js
import { ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)

  const increment = () => count.value++
  const decrement = () => count.value--

  return { count, increment, decrement }
}
```

### 使用

```vue
<script setup>
import { useCounter } from './composables/useCounter'

const { count, increment, decrement } = useCounter(10)
</script>
```

---

## 六、路由 Vue Router

### 配置路由

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

### 在组件中使用

```vue
<template>
  <!-- 路由跳转 -->
  <router-link to="/">首页</router-link>
  <router-link to="/about">关于</router-link>

  <!-- 路由出口：显示对应组件 -->
  <router-view />
</template>
```

### 路由守卫

```javascript
router.beforeEach((to, from, next) => {
  // to  - 要去的路由
  // from - 来源路由
  // next - 放行函数

  if (需要登录 && 未登录) {
    next('/login')  // 跳转登录页
  } else {
    next()  // 放行
  }
})
```

---

## 七、状态管理 Pinia

### 问题

原来如果数据放在 App 组件中：
- 其他组件要用需要 props 一层层传下去
- 还要把数据汇报给 App
- App 会变得很臃肿

### 解决：中央仓库

```javascript
// stores/user.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const name = ref('')
  const isLoggedIn = ref(false)

  const login = (userName) => {
    name.value = userName
    isLoggedIn.value = true
  }

  return { name, isLoggedIn, login }
})
```

### 各组件直接存取

```vue
<script setup>
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

// 直接读取
console.log(userStore.name)

// 直接调用方法
userStore.login('小明')
</script>
```

---

## 八、网络请求 Axios

### 创建请求实例

```javascript
import axios from 'axios'

const request = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000
})
```

### 使用

```javascript
// GET 请求
const data = await request.get('/users')

// POST 请求
const result = await request.post('/users', { name: '小明' })
```

---

## 速查表

| 概念 | 用途 | 关键词 |
|------|------|--------|
| ref | 单个变量 | `.value` |
| reactive | 对象/数组 | 直接访问 |
| computed | 计算属性 | 自动重算 |
| watch | 监听器 | 自动执行 |
| props | 父传子 | `defineProps` |
| emit | 子传父 | `defineEmits` |
| onMounted | 挂载后 | 发请求 |
| onUnmounted | 销毁前 | 清理 |
| Composables | 复用逻辑 | `export function` |
| router-link | 路由跳转 | 不刷新页面 |
| router-view | 路由出口 | 显示组件 |
| beforeEach | 路由守卫 | 权限控制 |
| Pinia | 状态管理 | `defineStore` |
| Axios | 网络请求 | `axios.create` |
