module.exports = {
  title: 'Uncle小说',
  description: '一个能够下载下载小说的APP',
  themeConfig: {
    sidebar: {
      '/documents/booksource/':[
        '',
        'a',
        'b'
      ],
      '/documents/usage/':[
        '',
        'a',
        'b'
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
      { text: 'github', link: 'https://github.com/unclezs/NovelHarvester' },
    ]
  }
}