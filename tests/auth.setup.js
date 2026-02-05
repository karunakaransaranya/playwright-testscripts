import { test as setup } from '@playwright/test';
import LoginPage from '../pageobject/LoginPage.js';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Perform authentication
  const loginPage = new LoginPage(page);
  await loginPage.geturl();
  await loginPage.login();
  
  // Wait for navigation and page to be fully loaded
  await page.waitForURL('**/inventory.html', { timeout: 5000 });
  
  // Save authentication state to a file
  await page.context().storageState({ path: authFile });
  console.log('Auth state saved to:', authFile);
});
