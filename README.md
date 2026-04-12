# Vue3 待办事项应用 - 项目说明

## 📁 项目结构

```
vue3-todo-app/
│
├── index.html              # 入口 HTML 文件（页面入口）
├── package.json            # 项目配置和依赖
├── vite.config.js          # Vite 构建配置
│
└── src/
    ├── main.js             # Vue 应用入口（创建应用实例）
    ├── App.vue             # 根组件（整体布局）
    ├── style.css           # 全局样式
    │
    ├── components/         # 可复用组件
    │   ├── Header.vue      # 头部组件（标题 + 导航）
    │   ├── TodoItem.vue    # 单个待办项组件
    │   └── TodoForm.vue    # 添加待办表单组件
    │
    ├── views/              # 页面组件
    │   ├── Home.vue        # 首页（待办列表）
    │   ├── About.vue       # 关于页面
    │   ├── TodoDetail.vue  # 待办详情页
    │   └── NotFound.vue    # 404 页面
    │
    ├── stores/             # Pinia 状态管理
    │   └── todo.js         # 待办事项的 Store
    │
    ├── router/             # Vue Router 路由
    │   └── index.js        # 路由配置
    │
    └── composables/        # 组合式函数
        └── useLocalStorage.js  # 本地存储工具函数
```

---

## 🔗 文件调用关系图

```
┌─────────────────────────────────────────────────────────────────┐
│                        index.html                                │
│                      (入口 HTML 文件)                            │
│                            │                                     │
│                            ▼                                     │
│                         main.js                                  │
│                    (创建 Vue 应用实例)                           │
│                            │                                     │
│              ┌─────────────┼─────────────┐                      │
│              ▼             ▼             ▼                      │
│         App.vue      router/index.js   stores/todo.js           │
│        (根组件)        (路由配置)        (状态管理)               │
│              │             │             ▲                      │
│              ▼             │             │                      │
│    ┌─────────┴─────────┐   │             │                      │
│    ▼                   ▼   │             │                      │
│ Header.vue       <router-view>           │                      │
│ (头部组件)            │                   │                      │
│                       ▼                   │                      │
│              ┌────────┴────────┐         │                      │
│              ▼                 ▼         │                      │
│          Home.vue         About.vue      │                      │
│          (首页)            (关于)        │                      │
│              │                           │                      │
│    ┌─────────┴─────────┐                 │                      │
│    ▼                   ▼                 │                      │
│ TodoForm.vue      TodoItem.vue           │                      │
│ (添加表单)          (待办项)              │                      │
│    │                   │                 │                      │
│    │                   ▼                 │                      │
│    │            TodoDetail.vue           │                      │
│    │            (待办详情)               │                      │
│    │                   │                 │                      │
│    └───────────────────┴─────────────────┘                      │
│                        │                                         │
│                        ▼                                         │
│                  useTodoStore()                                  │
│                  (访问共享状态)                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 数据流向

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                      Pinia Store (todo.js)                      │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  State: todos (待办列表)                                  │  │
│   │  Getters: unfinishedCount, finishedCount, totalCount     │  │
│   │  Actions: addTodo, removeTodo, toggleTodo, ...           │  │
│   └─────────────────────────────────────────────────────────┘  │
│                            ▲                                    │
│                            │                                    │
│           ┌────────────────┼────────────────┐                  │
│           │                │                │                  │
│           ▼                ▼                ▼                  │
│       Home.vue       TodoItem.vue      TodoForm.vue            │
│       (读取列表)      (读取/修改)       (添加新项)              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 如何运行项目

### 第一步：安装 Node.js

如果还没有安装 Node.js，请先安装：

1. 访问 https://nodejs.org/
2. 下载 LTS（长期支持）版本
3. 安装完成后，打开终端验证：

```bash
node -v    # 显示版本号表示安装成功
npm -v     # 显示 npm 版本
```

### 第二步：安装依赖

打开终端，进入项目目录：

```bash
# 进入项目目录
cd /c/JAVA_basic/vue3-todo-app

# 安装依赖包
npm install
```

### 第三步：启动开发服务器

```bash
# 启动开发服务器
npm run dev
```

启动后会显示：

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
```

### 第四步：在浏览器中查看

1. 打开浏览器
2. 访问 http://localhost:3000
3. 你会看到待办事项应用界面

---

## 🎯 功能演示

### 1. 添加待办
- 在输入框输入内容
- 按回车或点击"添加"按钮
- 新待办会出现在列表顶部

### 2. 完成待办
- 点击待办左侧的复选框
- 待办会显示删除线，表示已完成

### 3. 删除待办
- 点击待办右侧的删除按钮
- 确认后删除该待办

### 4. 查看详情
- 点击待办右侧的眼睛图标
- 跳转到详情页查看完整信息

### 5. 页面导航
- 点击顶部导航切换页面
- 首页：待办列表
- 关于：应用介绍

### 6. 数据持久化
- 所有数据自动保存到浏览器本地存储
- 刷新页面数据不会丢失

---

## 📚 知识点对照表

| 文件 | 知识点 |
|------|--------|
| `main.js` | 应用创建、插件注册 |
| `App.vue` | 根组件、router-view |
| `Header.vue` | router-link、Pinia 使用 |
| `TodoItem.vue` | props、emit、动态 class |
| `TodoForm.vue` | v-model、表单处理 |
| `Home.vue` | 生命周期、v-for、v-if、computed |
| `About.vue` | 静态页面组件 |
| `TodoDetail.vue` | useRoute、useRouter、路由参数 |
| `stores/todo.js` | Pinia Store、ref、computed |
| `router/index.js` | 路由配置、路由守卫 |
| `composables/useLocalStorage.js` | 组合式函数、watch |

---

## 🛠️ 常用命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

---

## ❓ 常见问题

### Q: npm install 很慢怎么办？

可以使用国内镜像：

```bash
# 使用淘宝镜像
npm config set registry https://registry.npmmirror.com

# 然后再安装
npm install
```

### Q: 端口被占用怎么办？

修改 `vite.config.js` 中的端口：

```javascript
server: {
  port: 3001,  // 改成其他端口
  open: true
}
```

### Q: 页面空白怎么办？

1. 打开浏览器开发者工具（F12）
2. 查看 Console 是否有错误
3. 确保依赖已安装：`npm install`
4. 重启开发服务器：`npm run dev`

---

## 📖 学习建议

1. **先运行起来**：按照步骤运行项目，看到效果
2. **阅读代码**：从 `main.js` 开始，顺着调用关系阅读
3. **修改尝试**：尝试修改样式、文字，看效果变化
4. **添加功能**：尝试添加新功能，如"编辑待办"
5. **对照文档**：遇到不懂的 API，查阅 Vue 官方文档

**Vue 官方文档**：https://cn.vuejs.org/
