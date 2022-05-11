module.exports = ctx => ({
  plugins: {
    'sitemap': {
      hostname: 'https://app.unclezs.com/'
    },
  },
  title: '📚Uncle小说',
  description: 'Uncle小说官网 Uncle小说V5.0 一个全网小说下载器',
  head: [
    ['meta', { baidu: 'baidu-site-verification', content: 'code-JufzRAnClF' }]
  ],
  base: '/uncle-novel-official-site/',
  themeConfig: {
    repo: 'unclezs/uncle-novel-official-site',
    repoLabel: '本站源码',
    docsRepo: 'unclezs/uncle-novel-official-site',
    docsDir: 'docs',
    docsBranch: 'main',
    editLinks: true,
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdated: '上次更新',
    // 搜索配置
    search: true,
    searchMaxSuggestions: 10,
    // 最近更新
    smoothScroll: true,
    nav: require('./nav'),
    sidebar: {
      '/booksource/': getBookSourceSidebar(),
      '/guide/mp/': getMpSidebar(),
      '/guide/pc/': getPcSidebar(),
      '/commnon/': getCommonSidebar(),
      '/qa/': getQaSidebar(),
    },
  }
})

function getBookSourceSidebar() {
  return [
    {
      title: "书源教程",
      collapsable: false,
      sidebarDepth: 2,
      children: [
        ['', "介绍"],
        'format',
        'rule-introduce',
        'search',
        'script',
        'replace',
        'advanced',
        'skills',
        'debug',
      ]
    }
  ]
}

function getCommonSidebar() {
  return [
    '',
    'disclaimers',
  ]
}

function getMpSidebar() {
  return [
    '',
  ]
}

function getPcSidebar() {
  return [
    {
      title: "PC版文档",
      collapsable: false,
      sidebarDepth: 2,
      children: [
        ['', "介绍"],
        'skills',
        'changelog',
        'versions',
      ]
    }
  ]
}

function getQaSidebar() {
  return [
    ["", "常见问题"]
  ]
}