## 1. 在沙箱环境中使用支付宝支付

```ts
const EnvUtils: any = plus.android.importClass('com.alipay.sdk.app.EnvUtils')
EnvUtils.setEnv(EnvUtils.EnvEnum.SANDBOX)
```

## 2. Android 平台签名证书

首先需要电脑上安装 JDK，然后通过以下命令生成签名证书：
使用 `keytool -genkey` 命令生成证书：

```shell
keytool -genkey -alias testalias -keyalg RSA -keysize 2048 -validity 36500 -keystore test.keystore
```

- alias：别名，用于标识证书
- keyalg：密钥算法，这里使用 RSA
- keysize：密钥长度，这里使用 2048
- validity：证书有效期，单位为天，这里使用 36500 天，表示 100 年有效期
- keystore：证书文件名，这里使用 test.keystore

运行命令后，根据提示填写相关信息，填写完毕后会在当前目录生成 test.keystore 文件，这个文件就是签名证书。

查看证书信息，信息包含 MD5、SHA1、SHA256 等签名信息，可以使用以下命令查看：

```shell
keytool -list -v -keystore test.keystore  
```

新版 SDK 仅支持 SHA1、SHA256，如需获取 MD5 签名，可以使用以下命令：

```shell
keytool -exportcert -keystore test.keystore | openssl dgst -md5
```

## 3. APP 端调用宿主机第三方地图导航

使用 `plus.runtime.isApplicationExist` 来判断宿主机上是否安装某个应用，已安装则返回 true

```ts
// 是否安装高德
// Android
plus.runtime.isApplicationExist({pname: 'com.autonavi.minimap'})

// IOS
plus.runtime.isApplicationExist({action: 'iosamap://'})
```

使用 `plus.runtime.openURL` 打开第三方应用

```ts
plus.runtime.openURL( url, errorCB, identity )
```

- url：要打开的地址
- errorCB：打开失败的回调，可选
- identity：指定打开 url 的程序名称，可选

示例代码如下：

```vue
<template>
  <view>
    <button type="primary" @click="handleNavBefore(addressInfo)">导航</button>
  </view>
</template>

<script setup lang="ts">
import gcoord from 'gcoord'
interface IMap {
  title: string
  name: IMapName
  androidName: string
  iosName: string
}

interface IAddress {
  latitude: number
  longitude: number
  name: string
}

type IMapName = 'amap' | 'qqmap' | 'baidumap'

const baseMap: IMap[] = [
  {
    title: '高德地图（推荐）',
    name: 'amap',
    androidName: 'com.autonavi.minimap',
    iosName: 'iosamap://',
  },
  {
    title: '百度地图',
    name: 'baidumap',
    androidName: 'com.baidu.BaiduMap',
    iosName: 'baidumap://',
  },
  {
    title: '腾讯地图',
    name: 'qqmap',
    androidName: 'com.tencent.map',
    iosName: 'qqmap://',
  },
]
let mapList: IMap[] = []
let addressInfo: IAddress = {
  longitude: 118.66082303835742,
  latitude: 31.976416706504498,
  name: '鱼嘴湿地公园',
}

function handleNavBefore(addressInfo: IAddress) {
  mapList = []
  let platform = uni.getSystemInfoSync().platform
  // 判断设备上安装的地图软件
  platform === 'android' &&
    baseMap.forEach((item) => {
      if (plus.runtime.isApplicationExist({ pname: item.androidName })) {
        mapList.push(item)
      }
    })
  if (!mapList.length) {
    return uni.showToast({
      title: '该设备上暂无找到合适的地图软件！',
      icon: 'none',
      mask: true,
    })
  }

  // 选择地图
  uni.showActionSheet({
    itemList: mapList.map((item) => item.title),
    success: (e) => {
      let mapName = mapList[e.tapIndex].name
      handleNav({ mapName, ...addressInfo })
    },
  })
}

function handleNav({
  mapName,
  latitude,
  longitude,
  name,
}: IAddress & { mapName: IMapName }) {
  let result = []
  // 各个平台的坐标系不同，需要进行转换
  if (['amap', 'qqmap'].includes(mapName)) {
    result = gcoord.transform(
      [longitude, latitude], // 经纬度坐标
      gcoord.WGS84, // 当前坐标系
      gcoord.AMap // 目标坐标系
    )
    latitude = result[1]
    longitude = result[0]
  }
  let defaultUrl = {
    android: {
      amap: `amapuri://route/plan/?sid=&did=&dlat=${latitude}&dlon=${longitude}&dname=${name}&dev=0&t=0`,
      qqmap: `qqmap://map/routeplan?type=drive&to=${name}&tocoord=${latitude},${longitude}&referer=fuxishan_uni_client`,
      baidumap: `baidumap://map/marker?location=${latitude},${longitude}&title=${name}&coord_type=wgs84&src=andr.baidu.openAPIdemo`,
    },
  }
  let newurl = encodeURI(defaultUrl['android'][mapName])
  // 打开地图软件
  plus.runtime.openURL(newurl, function (res) {
    uni.showModal({
      content: res.message,
    })
  })
}
</script>

<style scoped></style>
```

效果图如下：

![alt text](/assets/uniapp/image-1.jpg)
![alt text](/assets/uniapp/image-2.jpg)
