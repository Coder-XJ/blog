import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/blog/',
  title: '菜鸟码猿',
  description: '简单的个人笔记，记录自己的学习心得！',
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  // 主题相关配置
  themeConfig: {
    logo: '/logo.jpg',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '随笔', link: '/essay' },
    ],

    // 侧边栏
    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'gitee', link: 'https://gitee.com/balabilibo' },
      { icon: 'github', link: 'https://github.com/Coder-XJ' },
      { icon: 'juejin', link: 'https://juejin.cn/user/2533731084013902/posts' },
    ],
  },
})
