// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
const envName = process.env.TEST_ENV || 'dev';
dotenv.config({ path: path.resolve(process.cwd(), '.env.dev') });
dotenv.config({ path: path.resolve(process.cwd(), `.env.${envName}`), override: true });

const authFile = 'playwright/.auth/user.json';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: 2,
  /* Opt out of parallel tests on CI. */
  workers: 3,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { open: 'never' }],
    ['list'],                 // console output
    ['junit', { outputFile: 'results.xml' }], // CI/Jenkins/GitLab
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    headless: !!process.env.CI,

    screenshot: 'only-on-failure',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Run your local dev server before starting the tests */
  webServer: undefined,

  /* Configure projects for major browsers */
  projects: [
    // Setup project
    { name: 'setup', testMatch: /.*\.setup\.js/, use: { ...devices['Desktop Chrome'] } },

    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        /* Use saved auth state for all tests (if it exists) */
        storageState: fs.existsSync(authFile) ? authFile : undefined,
      },
      /* Depend on setup project */
      dependencies: ['setup'],
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: fs.existsSync(authFile) ? authFile : undefined,
      },
      dependencies: ['setup'],
    }

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

