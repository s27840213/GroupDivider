// why use .cjs instead of .js? see this article https://segmentfault.com/q/1010000042298464

module.exports = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'none',
  bracketSpacing: true,
  arrowParens: 'always',
  // format range is the entire file
  rangeStart: 0,
  rangeEnd: Infinity,
  requirePragma: false,
  insertPragma: false,
  proseWrap: 'preserve',
  htmlWhitespaceSensitivity: 'css',
  endOfLine: 'auto',
  // pug settings
  pugSingleQuote: false,
  pugAttributeSeparator: 'none',
  pugClassNotation: 'attribute',
  pugFramework: 'vue',
  plugins: ['@prettier/plugin-pug']
}