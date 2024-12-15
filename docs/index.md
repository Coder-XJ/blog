---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "菜鸟码猿"
  text: "简单的个人笔记，记录自己的学习心得！"
  tagline: Vue、React、UniApp、Electron、Docker、Git
  image:
     src: /logo.jpg
     alt: "菜鸟码猿"
  actions:
      # 按钮的颜色主题，默认为 `brand`
    - theme: brand
      text: 快速阅读
      link: /electron/ipc
    - theme: alt
      text: Gitee
      link: https://gitee.com/balabilibo

features:
  - title: Electron
    link: /electron/ipc
    icon:  
      src: icons/icon_electron.svg
    details: 是一个使用 JavaScript、HTML 和 CSS 构建桌面应用程序的框架。 嵌入 Chromium 和 Node.js。
  - title: Docker
    icon:
      src: icons/icon_docker.svg
    details: 是轻量级的应用容器框架，可以打包、分发和运行任何应用。
  - title: 随笔
    link: https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzIzNzU0NDU1NQ==&uin=MTc5MTc2NzgxNA%3D%3D&key=daf9bdc5abc4e8d0e4b4c031fbdd6c227d9760fd85bc702dd98ac94500b691768a27e290a791478737cb85414bfd401d535b5345dc46765c7678a51fcaa9b3eef4384d6c95758a9b0f9c2244b9804628325b0cc8c720264b9277f3d723b0340a47dff66a966359e54e798249406042eaa228108b01d59673c73fa9069c87642d&devicetype=Windows+10+x64&version=63090c11&lang=zh_CN&a8scene=7&acctmode=0&pass_ticket=kCyVKriqB%2F1BIcFeRRGzNI6M2flTBPlwM1Qh8AK%2BqnhLOmgfqdN%2FAUYJkYL%2FoTK6&wx_header=1
    icon: ✒
    details: 总结工作中遇到的问题，引以为戒，并记录解决方案。
  - title:  技术更新
    icon: 🚀
    details: 针对时下主流技术，结合自身学习掌握，总结整理，多种方式记录。
---