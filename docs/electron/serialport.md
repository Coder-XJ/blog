## 下载依赖包

```shell
pnpm i serialport
```

## 配置环境

Node SerialPort 是一个 JavaScript 库，用于连接到在 NodeJS 和 Electron 中工作的串行端口，配置相关环境使其能够在渲染进程中使用

`vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    electron({
        entry: 'electron/main.ts',
        onstart: (options) => {
          options.startup()
        },
        vite: {
          build: {
            rollupOptions: {
              // vite 无法正确构建 Node.js 包，尤其是 C/C++ 原生模块，作为外部资源包加载
              external: [ 'serialport'],
            },
          },
        },
      }),
    // 在渲染进程中使用 electron api
    renderer({
      resolve: {
        serialport: { type: 'cjs' },
      },
    }),
  ],
})

```

## 在渲染进程中使用

`serialport.vue`

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import { dialog } from '@electron/remote'
  import { SerialPort, ByteLengthParser, DelimiterParser } from 'serialport'
  import type { PortInfo } from '@serialport/bindings-interface'

  const grossWeight = ref(0)
  const serialportList = ref<PortInfo[]>([])
  let port: SerialPort

  // 扫描串口
  const scanSerialPort = async () => {
    serialportList.value = await SerialPort.list()
  }

  // 打开串口
  const openSerialport = () => {
    port = new SerialPort({
      path: 'COM4',
      baudRate: 9600, // 波特率
      dataBits: 8, //数据位
      parity: 'none', // 奇偶校验
      stopBits: 1, // 停止位
      autoOpen: false, // 是否自动打开
    })

    // 以分隔符的形式解析数据包
    const parser = port.pipe(
      new DelimiterParser({
        delimiter: '\n',
      }),
    )

    /* // 指定字节长度进行解析
      const parser = port.pipe(new ByteLengthParser({ length: 14 })) 
    */

    port.open((err) => {
      if (err) return dialog.showErrorBox('打开串口失败', err.message)

      parser.on('data', (data) => {
        const res = data.toString('ascii') // ww00004366kg
        /*  // 方式一：提取数据
          grossWeight.value = +res.slice(2, -3)
          */
        // 方式二
        grossWeight.value = +res.replace(/[a-z]/gi, '')
      })
    })
  }

  // 关闭串口
  const closeSerialport = () => {
    port.close((err) => {
      if (err) return dialog.showErrorBox('关闭串口失败', err.message)
    })
  }
</script>
```
