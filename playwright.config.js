
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 2 : undefined,

  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],

  use: {
  baseURL: 'https://www.saucedemo.com',
  headless: false,
  launchOptions: {
    slowMo: 500
  },
  screenshot: 'only-on-failure',
  trace: 'retain-on-failure',
  ...devices['Desktop Chrome']
}
});
