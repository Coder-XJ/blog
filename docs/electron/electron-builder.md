
## 下载 electron-builder

```shell
pnpm i electron-builder -D
```

使用 `pnpm` 安装依赖需要在 `.npmrc` 中进行如下配置：

```yaml
electron-builder-binaries_mirror=https://npmmirror.com/mirrors/electron-builder-binaries/
public-hoist-pattern=*
```

## 打包通用配置

`package.json`

```json
"scripts": {
  "dev": "vite ",
  "build": "vue-tsc && vite build",
  "preview": "vite preview",
  "build:mac": "electron-builder build --mac",
  "build:win": "electron-builder build --win",
  "build:linux": "USE_SYSTEM_FPM=true electron-builder build --linux",
  "compile": "npm run build && npm run build:win",
},
```

在项目根目录下创建 `electron-builder.json5`文件

```json
/**
 * @see https://www.electron.build/configuration/configuration
 */
{
  "$schema": "https://raw.githubusercontent.com/electron-userland/electron-builder/master/packages/app-builder-lib/scheme.json",
  // 应用ID
  "appId": "my-electron-app",
  // 应用名称
  "productName": "my-electron-app",
  // 加密
  "asar": true,
  // 打包输出的文件目录
  "directories": {
    "output": "release/${productName}-${platform}-${arch}-${version}"
  },
  // 需要打包的文件
  "files": [
    "dist/production/dist",
    // 包含 Prisma 生成的代码
    "node_modules/.prisma/**/*",
    // 包含 Prisma CLI
    "node_modules/prisma/**/*",
    // 包含 Prisma 客户端
    "node_modules/@prisma/**/*",
    // 包含迁移文件
    "prisma"
  ],
  // 需要解压的文件（用于运行时加载）
  "asarUnpack": [
    "**\\*.{node,dll,exe}",
    "node_modules/.prisma/**/*",
    "node_modules/prisma/**/*",
    "node_modules/@prisma/**/*"
  ],
  // 额外的资源文件，会将指定的资源文件复制到 resources 目录下
  "extraResources": [
    {
      "from": "prisma/migrations",
      "to": "prisma/migrations"
    },
    {
      "from": "prisma/schema.prisma",
      "to": "prisma/schema.prisma"
    }
  ],
  "includeSubNodeModules": true,
  // asarUnpack: ['./node_modules/.prisma/**/*', './node_modules/prisma/**/*', './node_modules/@prisma/**/*'],
  /*
  target:
    - win: nsis
    - mac: dmg、pkg、mas
    - linux: rpm、freebsd、pacman、p5p、apk
    - all platforms: 7z、zip、tar.xz、tar.7z、tar.lz、tar.gz、tar.bz2、dir
    arch: "x64" | "ia32" | "armv7l" | "arm64" | "universal"
   */
  "linux": {
    "artifactName": "${productName}-${platform}-${arch}-${version}.${ext}",
    "target": [
      {
        "target": "deb",
        "arch": ["x64"]
      }
    ]
  },
  "mac": {
    "artifactName": "${productName}-${platform}-${arch}-${version}.${ext}",
    "target": ["dmg"]
  },
  "win": {
    "artifactName": "${productName}-${platform}-${arch}-${version}.${ext}",
    "target": [
      {
        "target": "nsis",
        "arch": ["x64"]
      }
    ]
  },
  "nsis": {
    // 是否一件安装
    "oneClick": false,
    // 是否安装时开启权限限制（此电脑或当前用户）
    "perMachine": false,
    // 是否允许修改安装目录
    "allowToChangeInstallationDirectory": true,
    // 卸载时是否删除用户数据
    "deleteAppDataOnUninstall": true,
    // 安装图标
    // installerIcon: 'xxx',
    // 卸载图标
    // uninstallerIcon: 'xxx',
    // 安装时头部图标
    // installerHeaderIcon: 'xxx',
    // 创建桌面图标
    "createDesktopShortcut": true,
    // 创建开始菜单图标
    "createStartMenuShortcut": true
    // NSIS的路径包括自定义安装程序的脚本。默认为build/installer.nsh
    // include: 'installer.nsh',
  },
  // 自动更新升级
  // "publish": [
  //   {
  //   "provider": "generic",
  //   "url":"http://localhost:8848/static"
  //   }
  // ],
  // "releaseInfo": {
  //   "releaseNotes": "版本更新的具体内容"
  // }
}
```
