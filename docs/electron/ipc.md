::: tip
在使用 vite + ts + vue 搭建的 electron 项目中，使用进程通信，具有以下几种方式
:::

## 1. 使用预加载脚本

主进程需要开启进程隔离

`electron/main.ts`

```typescript
import { app, BrowserWindow, ipcMain } from 'electron'
import { resolve } from 'path'

/* 
  在当前文件中你可以引入所有的主进程代码
  一个 Electron 应用只能有一个主进程，但可以多个渲染进程，一个 BrowserWindow 实例代表着一个渲染进程
  app：代表整个应用，可以获取应用程序生命周期的各个事件
  webContents：负责渲染和控制页面
  主进程：负责管理所有窗口及其对应的渲染进程，每个渲染进程都是独立的

  进程通信：
  主进程：ipcMain
  渲染进程：ipcRender
*/

let win: BrowserWindow | null

// 创建窗口
const createWindow = () => {
  // 创建浏览窗口
  win = new BrowserWindow({
    title: 'Main window',
    // 置于窗口之上
    alwaysOnTop: false,
    // 窗口位置及大小
    x: 1200,
    y: 10,
    width: 400,
    height: 300,
    // 是否允许改变窗口大小
    // resizable: true,
    // 是否显示窗口标题栏和边框，默认为 true
    frame: false,
    show: false,
    webPreferences: {
      // 集成 Node 环境
      // 如果加载一个不可信任的网页，应设置为 false，防止此页面有恶意脚本拥有访问 Node 环境的能力，做出伤害系统的行为
      nodeIntegration: true,
      // 开启进程隔离
      // 使用预加载脚本时，需要设置为 true，使用@vueuse/electron 或者 vite-plugin-electron-renderer 时，设置为 false
      // 默认为 true
      contextIsolation: true,
      // 网页的同源策略，关闭后，可以调用第三方网站的服务端接口，不会出现跨域问题
      // webSecurity: false,
      // 预加载脚本
      preload: resolve(__dirname, 'preload.js'),
    },
  })

  // 加载页面
  // You can use `process.env.VITE_DEV_SERVER_URL` when the vite command is called `serve`
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    // Load your file
    win.loadFile('dist/index.html')
  }

  // 打开开发工具
  // win.webContents.openDevTools()

  // 关闭控制台警告
  process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

  win.once('ready-to-show', () => {
    win?.show()
  })

  win.on('closed', () => {
    win = null
  })
}

// 禁用当前应用程序的硬件加速，在 ready 之前调用
app.disableHardwareAcceleration()

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // 在 macOS 系统内, 如果没有已开启的应用窗口
    // 点击托盘图标时通常会重新创建一个新窗口
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此, 通常
// 对应用程序和它们的菜单栏来说应该时刻保持激活状态,
// 直到用户使用 Cmd + Q 明确退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('window-min', () => {
  // 窗口最小化
  win?.minimize()
})

ipcMain.on('window-max', () => {
  // 窗口最大化
  const flag = win?.isMaximized()
  if (flag) return win?.unmaximize()

  win?.maximize()
})

ipcMain.on('window-close', () => {
  // 窗口关闭
  win?.close()
})

```

预加载脚本中使用 contextBridge 方法暴露相关 api 到渲染进程中

`electron/preload.ts`

```typescript
import { contextBridge, ipcRenderer } from 'electron'

/* 窗口操作 */
// 最小化
const min = () => {
  ipcRenderer.send('window-min')
}

// 最大化
const max = () => {
  ipcRenderer.send('window-max')
}

// 关闭
const close = () => {
  ipcRenderer.send('window-close')
}

contextBridge.exposeInMainWorld('electronAPI', {
  min,
  max,
  close,
})

```

渲染进程

`xxx.vue`

```vue
<script setup lang="ts">
  const { electronAPI } = window

  const min = () => {
    electronAPI.min()
  }

  const max = () => {
    electronAPI.max()
  }

  const close = () => {
    electronAPI.close()
  }
</script>
```

项目中集成 TS

`global.d.ts`

```typescript
export interface IElectronAPI {
  min:Function
  max:Function
  close:Function
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
```

## 2. @vueuse/electron

[VueUse](https://vueuse.org/electron/README.html)

主进程关闭进程隔离

```typescript
webPreferences: {
  ...
  // 关闭进程隔离
  contextIsolation: false,
  ...
}
```

```vue
<script setup lang="ts">
  import { useIpcRenderer } from '@vueuse/electron'
  const ipcRenderer = useIpcRenderer()

  const min = () => {
    ipcRenderer.send('window-min')
  }

  const max = () => {
    ipcRenderer.send('window-max')
  }

  const close = () => {
    ipcRenderer.send('window-close')
  }
</script>
```

## 3. vite-plugin-electron-renderer

[vite-plugin-electron-renderer](https://www.npmjs.com/package/vite-plugin-electron-renderer)

需要在 `vite.config.ts`中进行配置，这样就可以在渲染进程中使用相关 api 了

`vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    electron(
      {
        entry: 'electron/main.ts',
        onstart: (options) => {
          options.startup()
        },
      }  
    ),
    // 在渲染进程中使用 electron api
    renderer(),
  ],
})
```

主进程需要关闭进程隔离

```typescript
webPreferences: {
  // 集成 Node 环境
  // 如果加载一个不可信任的网页，应设置为 false，防止此页面有恶意脚本拥有访问 Node 环境的能力，做出伤害系统的行为
  nodeIntegration: true,
  // 开启进程隔离
  contextIsolation: false,
  // 预加载脚本
  preload: resolve(__dirname, 'preload.js'),
}
```

```vue
<script setup lang="ts">
  import { ipcRenderer } from 'electron'

  const min = () => {
    ipcRenderer.send('window-min')
  }

  const max = () => {
    ipcRenderer.send('window-max')
  }

  const close = () => {
    ipcRenderer.send('window-close')
  }
</script>

```

## 4. remote 模块

[@electron/remote](https://www.npmjs.com/package/@electron/remote)

需要在主进程中进行初始化，同时关闭进程隔离，然后就可以在渲染进程中使用主进程的对象了

```typescript
import remote from '@electron/remote/main'

let win: BrowserWindow | null = null

app.whenReady().then(() => {
  createWindow()

  remote.initialize()
  remote.enable(win!.webContents)

})

```

```vue
<script setup lang="ts">
  import { app, shell, getCurrentWindow } from '@electron/remote'
  const win = getCurrentWindow()

  const min = () => {
    win.minimize()
  }

  const max = () => {
    win.maximize()
  }

  const close = () => {
    win.close()
  }
</script>

```
