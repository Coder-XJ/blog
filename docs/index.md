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
    link: /essay/
    icon: ✒
    details: 总结工作中遇到的问题，引以为戒，并记录解决方案。
  - title:  技术更新
    icon: 🚀
    details: 针对时下主流技术，结合自身学习掌握，总结整理，多种方式记录。
---