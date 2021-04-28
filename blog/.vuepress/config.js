module.exports = {
  title: 'Blog Ydays Dawndash', // Title for the site. This will be displayed in the navbar.
  plugins: [
    [
      '@vuepress/back-to-top',
      '@vuepress/blog',
      {
        directories: [
          {
            id: 'post',
            dirname: '_posts',
            path: '/',
          },
        ],
      },
    ],
  ],
  theme: '@vuepress/theme-blog',
  themeConfig: {
    nav: [
      { text: 'Articles', link: '/' },
    ],
    footer: {
      contact: [
        {
          type: 'github',
          link: 'https://github.com/guillaumehanotel',
        },
        {
          type: 'linkedin',
          link: 'https://www.linkedin.com/in/guillaumehanotel/',
        },
      ],
    },
  }
}
