::: tip
在 Electron 项目开发中遇到的一些问题和解决方案
:::

## 1. 新版 electron 中使用 remote 模块

在 `Electron 14` 版本后内置的 `remote` 模块被废除，使用 `@electron/remote` 模块进行替代

```shell
pnpm i @electron/remote
```

在主进程中引入 `@electron/remote` 并进行初始化

`main/index.ts`

```typescript
// 引入 remote 模块
import remote from'@electron/remote/main'
import { app, BrowserWindow } from 'electron'
let mainWindow: BrowserWindow
// 初始化 remote 模块
remote.initialize()

const createWindow = () => {
  // 创建窗口
  mainWindow = new BrowserWindow({
    show: false,
    width: 1280,
    height: 800,
    webPreferences: {
      // 关闭同源策略
      webSecurity: false,
      // 关闭进程隔离
      contextIsolation: false,
      // 集成 node 环境
      nodeIntegration: true
    }
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    // 加载 url
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    // 加载 index.html
    mainWindow.loadFile('dist/index.html')
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })
}


app.whenReady().then(() => {
  createWindow()
  
  // 启用远程模块对当前 WebContents 的支持
  remote.enable(mainWindow.webContents)

  app.on('activate', () => {
    // 在 macOS 系统内, 如果没有已开启的应用窗口
    // 点击托盘图标时通常会重新创建一个新窗口
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
```

## 2. 在 window 环境下打包 linux 包

`electron-builder` 依赖于打包环境，在 windows 环境下，需要借助 `docker`，具体操作如下：

拉取 `electronuserland/builder` 镜像

```shell
docker pull electronuserland/builder
```

运行容器，将当前共工作区于镜像中的目录相关联

```shell
docker run --rm -ti -v D:\WorkSpace\my-electron-app\:/project -w /project electronuserland/builder
```

进入当前目录，执行打包命令

```shell
cd /project
pnpm i
pnpm run build:linux
```

## 3. 开发环境下找不到 `app-update.yml`文件

![alt text](/assets/electron/image-5.png)
在项目根目录下，新建 `app-update.yml`文件，将打包生成的 `latest.yml`内容复制其中

```typescript
if (import.meta.env.DEV) {
  autoUpdater.updateConfigPath = join(__dirname, '../app-update.yml')
}
```

## 4. 开发环境下，跳过 electron-updater 的打包校验

使用 electron-updater 实现应用更新时，控制台会打印 `Skip checkForUpdates because application is not packed and dev update config is not forced`

```typescript
Object.defineProperty(app, 'isPackaged', {
  get() {
    return true
  },
})
```

## 5. 改变 electron 默认编译路径

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
     electron({
      // entry: 'electron/main/index.ts',
      onstart: (options) => {
        options.startup()
      },
      vite: {
        build: {
          rollupOptions: {
            external: ['ffi-napi', 'serialport', 'electron-updater'],
          },
          outDir: 'dist',
          lib: {
            entry: 'electron/main/index.ts',
            formats: ['cjs'],
            fileName: () => 'background.js',
          },
        },
      },
    }),
    // 在渲染进程中使用 electron api
    renderer(),
  ],
})

```

## 6. 在主进程使用 axios 报错

![alt text](/assets/electron/image-6.png)

```typescript
import axios from 'axios'

// 解决在主进程中使用 axios 报错
axios.defaults.adapter = require('axios/lib/adapters/http')
```

## 7. 关闭控制台安全警告

```typescript
// 屏蔽控制台的安全警告
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
```

## 8. 主进程中使用路径别名

```shell
pnpm i @rollup/plugin-alias -D
```

```typescript
import { defineConfig, loadEnv, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import alias from '@rollup/plugin-alias'
function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}
// vite.config.ts
export default defineConfig(({ mode }): UserConfig => {
  const { VITE_PORT } = loadEnv(mode, process.cwd())
  let port = +VITE_PORT
  return {
    plugins: [
      vue(),
      electron({
        entry: 'src/background.ts',
        onstart(options) {
          options.startup()
        },
        vite: {
          build: {
            rollupOptions: {
              external: ['serialport', 'sqlite3'],
              plugins: [
                // 主进程中使用路径别名
                alias({
                  entries: [
                    // /@/xxxx => src/xxxx
                    {
                      find: /\/@\//,
                      replacement: pathResolve('src') + '/'
                    },
                    // /#/xxxx => types/xxxx
                    {
                      find: /\/#\//,
                      replacement: pathResolve('types') + '/'
                    }
                  ]
                })
              ]
            },
            outDir: './dist'
          }
        }
      }),
    ],
    server: {
      host: '0.0.0.0',
      port: port || 4399
    },
    resolve: {
      // 配置路径别名
      alias: [
        // /@/xxxx => src/xxxx
        {
          find: /\/@\//,
          replacement: pathResolve('src') + '/'
        },
        // /#/xxxx => types/xxxx
        {
          find: /\/#\//,
          replacement: pathResolve('types') + '/'
        }
      ],
      // 引入文件的时候，可以忽略掉以下文件后缀
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    }
  }
})
```

## 9. 自定义窗口

```typescript
const win = new BrowserWindow({
  title: 'Electron APP',
  icon: iconPath,
  // 窗口大小
  width: 800,
  height: 300,
  x: 10,
  y: 10,
  frame: true, // 是否显示窗口标题栏和边框，默认为 true
  webPreferences: {
    // 网页的同源策略，关闭后，可以调用第三方网站的服务端接口，不会出现跨域问题
    webSecurity: false,
    // 关闭进程隔离
    contextIsolation: false,
    // 集成 node 环境
    nodeIntegration: true
    // 预加载脚本
    // preload: resolve(__dirname, 'preload.js')
  },
  // 隐藏窗口的系统菜单，使用 Alt 键可以显示
  // autoHideMenuBar: true,
  // 隐藏标题栏和窗口
  titleBarStyle: 'hidden',
  // 自定义标题栏时，设置系统窗口的按钮颜色
  titleBarOverlay: {
    height: 40,
    color: '#ec4899',
    symbolColor: '#fff'
  }
  // transparent: true // 设置窗口透明
})
```

## 10. 窗口拖拽

```css
/* 某一区域可拖拽 */
.custom {
  -webkit-app-region: drag;
}

/* 整个窗口可拖拽 */
body {
  -webkit-app-region: drag;
}
```

## 11. 禁用文本选择

```css
.titlebar {
  -webkit-user-select: none;
  -webkit-app-region: drag;
}
```

## 12. 应用重启

```typescript
app.relunch()
app.quit() or app.exit(0)
```

## 13. Linux 永久授权串口读写权限

查看 `ttyUSB0` 权限

```shell
ls -l /dev/ttyUSB0
```

查看 `dialog` 用户组成员

```shell
grep 'dialout' /etc/group
```

将普通用户加入到 `dialout` 组中

```shell
sudo usermod -aG dialout omc
```

重启

```shell
sudo reboot
```

## 14. 唤醒系统键盘

```typescript
function oppenKeyboard() {
  if (process.platform === 'win32') {
    exec('osk.exe');
  } else if (process.platform === 'linux') {
    exec('onboard');
  }
}
```
