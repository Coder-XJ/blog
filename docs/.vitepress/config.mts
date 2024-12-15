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
      {
        text: '随笔',
        link: 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzIzNzU0NDU1NQ==&uin=MTc5MTc2NzgxNA%3D%3D&key=daf9bdc5abc4e8d0e4b4c031fbdd6c227d9760fd85bc702dd98ac94500b691768a27e290a791478737cb85414bfd401d535b5345dc46765c7678a51fcaa9b3eef4384d6c95758a9b0f9c2244b9804628325b0cc8c720264b9277f3d723b0340a47dff66a966359e54e798249406042eaa228108b01d59673c73fa9069c87642d&devicetype=Windows+10+x64&version=63090c11&lang=zh_CN&a8scene=7&acctmode=0&pass_ticket=kCyVKriqB%2F1BIcFeRRGzNI6M2flTBPlwM1Qh8AK%2BqnhLOmgfqdN%2FAUYJkYL%2FoTK6&wx_header=1',
      },
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
      /* {
        text: '随笔',
        link: '/essay',
      }, */
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
