## 安装依赖

```shell
pnpm i electron-log
```

## 基本配置

在主进程中进行相应配置

```typescript
import logger from 'electron-log/main'
import dayjs from 'dayjs';
// 在渲染进程中使用
logger.initialize()
// 关闭控制台 console 打印
logger.transports.console.level = false
// 日志文件等级
logger.transports.file.level = 'info'
// 文件最大不超过 10M
logger.transports.file.maxSize = 10024300
// 设置日志文件的路径
logger.transports.file.resolvePathFn = () => join(app.getAppPath(), `logs/${dayjs().format('YYYY-MM-DD')}.log`)
// 设置日志格式,日志格式，默认：[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}
logger.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}] [{level}]{scope} {text}'
```

在渲染进程中使用

```typescript
import logger from 'electron-log/renderer'
logger.transports.console.format = '[{y}-{m}-{d} {h}:{i}:{s}] [{level}]{scope} {text}'

logger.info("hello") // [2024-12-10 16:52:22] [info] hello
```
