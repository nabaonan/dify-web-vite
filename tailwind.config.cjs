const commonConfig = require('./tailwind-common-config.cjs')
const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './context/**/*.{js,ts,jsx,tsx}',
  ],
  ...commonConfig,
}

module.exports = config
