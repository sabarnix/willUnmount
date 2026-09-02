// oxlint's ignorePatterns (.oxlintrc.json) excludes demos/**, so passing only
// demos/ files to oxlint makes it exit non-zero with "No files found to lint".
// Filter those out here instead of duplicating the ignore list.
module.exports = {
  '*.+(js|jsx|ts|tsx)': (files) => {
    const lintable = files.filter((file) => !file.includes('/demos/'))
    return lintable.length ? [`oxlint --fix ${lintable.join(' ')}`] : []
  },
  '*.+(js|jsx|ts|tsx|json|css|md|mdx|html)': ['prettier --write'],
}
