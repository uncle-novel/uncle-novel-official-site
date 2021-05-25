module.exports = {
  title: 'Uncle小说',
  description: '一个能够下载下载小说的APP',
  themeConfig: {
    sidebar: {
      '/tutorials/booksource/': [
        '',
        '章节一',
        '章节二'
      ],
      '/tutorials/usage/mp/': [
        '',
        '基本教程',
      ],
      '/commnon/': [
        '',
        'disclaimers',
      ],
    },
    smoothScroll: true,
    nav: [
      { text: '主页', link: '/' },
      {
        text: '教程',
        items: [
          { text: 'PC', link: '/tutorials/usage/pc/' },
          { text: '小程序', link: '/tutorials/usage/mp/' },
          { text: 'Android', link: '/tutorials/usage/android/' },
          { text: '书源教程', link: '/tutorials/booksource/' }
        ]
      },
      { text: 'Github', link: 'https://github.com/unclezs/NovelHarvester' },
      { text: '博客', link: 'https://blog.unclezs.com' },
    ]
  }
}