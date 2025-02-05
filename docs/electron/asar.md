### 下载依赖包

```shell
yarn add asar -g
```

### 打包

```shell
asar pack your-app app.asar 
```

### 解压

在 `asar`文件所在的根目录下，在地址栏输入 `cmd`，打开命令窗口，执行如下命令

```shell
asar extract app.asar ./
```

### 读取 asar 里面的文件

```shell
asar list app.asar ./
```
