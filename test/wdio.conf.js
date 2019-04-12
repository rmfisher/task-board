const timeout = process.env.DEBUG ? 99999999 : 30000
const headless = process.env.headless === 'true'

exports.config = {
  runner: 'local',
  baseUrl: 'https://rmfisher.github.io',
  specs: ['./src/**/*.spec.ts'],
  maxInstances: 1,
  capabilities: [
    {
      maxInstances: 1,
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: headless ? ['--headless', '--disable-gpu'] : [],
      },
    },
  ],
  logLevel: 'silent',
  deprecationWarnings: false,
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 10000,
  connectionRetryCount: 3,
  services: ['selenium-standalone'],
  reporters: ['spec'],
  framework: 'mocha',
  mochaOpts: {
    compilers: ['tsconfig-paths/register'],
    ui: 'bdd',
    timeout: timeout,
  },
  before: function() {
    require('ts-node').register({ files: true })
  },
}
