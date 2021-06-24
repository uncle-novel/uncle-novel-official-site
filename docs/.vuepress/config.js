module.exports = ctx => ({
  title: '📚Uncle小说',
  description: '一个能够下载下载小说的APP',
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
        'advanced',
        'script',
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