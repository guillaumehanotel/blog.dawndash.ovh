module.exports = {
  title: 'Blog Ydays Dawndash', // Title for the site. This will be displayed in the navbar.
  plugins: [
    [
      '@vuepress/blog',
      {
        directories: [
          {
            // Unique ID of current classification
            id: 'post',
            // Target directory
            dirname: '_posts',
            // Path of the `entry page` (or `list page`)
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
    ]
  }
}
