module.exports = {
  title: 'Uncle小说',
  description: '一个能够下载下载小说的APP',
  themeConfig: {
    sidebar: {
      '/documents/booksource/':[
        '',
        '章节一',
        '章节二'
      ],
      '/documents/usage/':[
        '',
        '章节一',
        '章节二'
      ],
    },
    smoothScroll: true,
    nav: [
      { text: '主页', link: '/' },
      {
        text: '教程',
        items: [
          { text: '使用教程', link: '/documents/usage/' },
          { text: '书源教程', link: '/documents/booksource/' }
        ]
      },
      { text: 'Github', link: 'https://github.com/unclezs/NovelHarvester' },
      { text: '博客', link: 'https://blog.unclezs.com' },
    ]
  }
}