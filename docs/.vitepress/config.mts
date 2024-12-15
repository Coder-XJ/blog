import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  base: '/blog/',
  title: '菜鸟码猿',
  description: '简单的个人笔记，记录自己的学习心得！',
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  // 主题相关配置
  themeConfig: {
    logo: '/logo.jpg',
    // https://vitepress.dev/reference/default-theme-config
    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '随笔', link: '/essay' },
    ],

    // 左侧侧边栏
    sidebar: [
      {
        // 侧边栏文本
        text: 'Electron',
        // 侧边栏子项
        items: [{ text: '进程通信', link: '/electron/ipc' }],
        // 是否折叠
        collapsed: true,
      },
    ],
    // 社交链接
    socialLinks: [
      { icon: 'gitee', link: 'https://gitee.com/balabilibo' },
      { icon: 'github', link: 'https://github.com/Coder-XJ' },
      { icon: 'juejin', link: 'https://juejin.cn/user/2533731084013902/posts' },
    ],

    // 右侧侧边栏
    outline: {
      label: '页面导航',
    },

    // 搜索
    search: {
      provider: 'local',
    },

    // 上一页与下一页
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

    // 最后更新时间
    lastUpdated: {
      text: '最后更新于',
    },
  },
})
