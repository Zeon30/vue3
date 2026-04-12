// router/index.js - Vue Router 路由配置
// 路由决定了 URL 和页面组件的对应关系
// 比如：访问 "/" 显示首页，访问 "/about" 显示关于页

// ============================================
// 引入依赖
// ============================================
import { createRouter, createWebHistory } from 'vue-router'

// 引入页面组件
// 懒加载：使用 () => import() 语法
// 这样页面组件会在访问对应路由时才加载，提高首屏加载速度
import Home from '../views/Home.vue'

// ============================================
// 定义路由规则
// ============================================
// 每个路由是一个对象，包含 path、name、component 等属性
const routes = [
  {
    // 路由路径：URL 中的路径
    path: '/',

    // 路由名称：用于编程式导航
    name: 'Home',

    // 对应的组件：访问这个路径时显示的页面
    component: Home,

    // 路由元信息：可以存放一些自定义数据
    meta: {
      title: '首页 - 待办事项'
    }
  },
  {
    path: '/about',
    name: 'About',

    // 懒加载：只有访问 /about 时才加载这个组件
    // 这样可以减少首屏加载的资源量
    component: () => import('../views/About.vue'),

    meta: {
      title: '关于 - 待办事项'
    }
  },
  {
    // 动态路由：带参数的路由
    // :id 是一个动态参数，可以在组件中通过 route.params.id 获取
    path: '/todo/:id',
    name: 'TodoDetail',

    component: () => import('../views/TodoDetail.vue'),

    meta: {
      title: '待办详情'
    }
  },
  {
    // 404 页面：匹配所有未定义的路由
    // path: '/:pathMatch(.*)*' 是 Vue Router 4 的写法
    path: '/:pathMatch(.*)*',
    name: 'NotFound',

    component: () => import('../views/NotFound.vue'),

    meta: {
      title: '页面未找到'
    }
  }
]

// ============================================
// 创建路由实例
// ============================================
const router = createRouter({
  // 路由模式
  // createWebHistory()：使用 HTML5 History 模式
  // URL 看起来像：http://example.com/about（没有 #号）
  // 需要服务器配置支持（所有路由都返回 index.html）
  history: createWebHistory(),

  // 路由规则
  routes
})

// ============================================
// 全局路由守卫
// ============================================
// beforeEach：全局前置守卫
// 在每次路由跳转前执行，可以用于权限验证、修改页面标题等
router.beforeEach((to, from, next) => {
  // to：即将进入的目标路由对象
  // from：当前要离开的路由对象
  // next：放行函数，必须调用

  // 修改页面标题
  // document.title 是页面的标题
  // to.meta.title 是我们在路由元信息中定义的标题
  document.title = to.meta.title || 'Vue3 待办事项'

  // 放行，继续导航
  next()
})

// ============================================
// 导出路由实例
// ============================================
export default router
