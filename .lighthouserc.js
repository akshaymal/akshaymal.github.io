const fs = require('fs')
const path = require('path')

// Post URLs are derived from the static export output (rather than hardcoded)
// so a new post picked up by content/posts/ automatically gets Lighthouse
// coverage too — see issue #6.
const blogOutDir = path.join(__dirname, 'out', 'blog')
const postSlugs = fs.existsSync(blogOutDir)
  ? fs
      .readdirSync(blogOutDir)
      .filter((file) => file.endsWith('.html'))
      .map((file) => file.replace(/\.html$/, ''))
  : []

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npx serve@latest out -l 3000',
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/experience',
        'http://localhost:3000/projects',
        'http://localhost:3000/beyond-work',
        'http://localhost:3000/blog',
        ...postSlugs.map((slug) => `http://localhost:3000/blog/${slug}`),
      ],
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './.lighthouseci',
    },
  },
}
