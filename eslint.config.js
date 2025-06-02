import neostandard from 'neostandard'

export default neostandard({
  noStyle: true, // Disable style-related rules, we use Prettier
  ts: false,
  env: ['mocha'],
  ignores: ['.cache/**', 'test/.cache/**'],
})
