import { test, expect } from '@playwright/test';
import LoginPage from '../pageobject/LoginPage.js';
import {
  PASSWORD,
  VALID_USERS,
  ERROR_MESSAGES,
} from './testdata/login.testdata.js';

const LOGIN_URL = process.env.LOGIN_URL || 'https://www.saucedemo.com/';

test("Validate the login page with valid credentials", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.geturl();
  await loginPage.login()
})

test("Login with invalid password and valid username", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.geturl();
  await loginPage.loginWithCredentials("standard_user", "invalid_password");
  const isErrorVisible = await loginPage.isErrorVisible();
  expect(isErrorVisible).toBeTruthy();
  const errorMsg = await loginPage.getErrorMessage();
  expect(errorMsg).toContain(ERROR_MESSAGES.userMismatch);
})

test("Login with invalid username and valid password", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.geturl();
  await loginPage.loginWithCredentials("invalid_user", PASSWORD);
  const isErrorVisible = await loginPage.isErrorVisible();
  expect(isErrorVisible).toBeTruthy();
  const errorMsg = await loginPage.getErrorMessage();
  expect(errorMsg).toContain('Username and password do not match');
})

test("Login with both fields blank", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.geturl();
  await loginPage.loginWithCredentials("", "");
  const isErrorVisible = await loginPage.isErrorVisible();
  expect(isErrorVisible).toBeTruthy();
  const errorMsg = await loginPage.getErrorMessage();
  expect(errorMsg).toContain(ERROR_MESSAGES.usernameRequired);
})

test("Login with blank username and valid password", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.geturl();
  await loginPage.loginWithCredentials("", PASSWORD);
  const isErrorVisible = await loginPage.isErrorVisible();
  expect(isErrorVisible).toBeTruthy();
  const errorMsg = await loginPage.getErrorMessage();
  expect(errorMsg).toContain(ERROR_MESSAGES.usernameRequired);
})

test("Login with valid username and blank password", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.geturl();
  await loginPage.loginWithCredentials("standard_user", "");
  const isErrorVisible = await loginPage.isErrorVisible();
  expect(isErrorVisible).toBeTruthy();
  const errorMsg = await loginPage.getErrorMessage();
  expect(errorMsg).toContain(ERROR_MESSAGES.passwordRequired);
})

// ═══════════════════════════════════════════════════════════════════════
//  Login Page - Look and Feel
// ═══════════════════════════════════════════════════════════════════════

test('Login Page - Look and Feel (all validations)', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.geturl();
  await loginPage.validateLookAndFeel(LOGIN_URL, VALID_USERS.map(user => user.username));
});

// ═══════════════════════════════════════════════════════════════════════
//  Login - All Valid Users
// ═══════════════════════════════════════════════════════════════════════

test.describe('Login - All Valid Users', () => {

  for (const { username, description } of VALID_USERS) {

    test(`${description} (${username}) should be able to logout after login`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.geturl();
      await loginPage.loginWithCredentials(username, PASSWORD);
      await loginPage.validateOnInventoryPage();
      await loginPage.validateInventoryItemsVisible();
      await loginPage.validateMenuButtonVisible();
      await loginPage.logout();
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════
//  Login - Locked Out User
// ═══════════════════════════════════════════════════════════════════════

test.describe('Login - Locked Out User', () => {

  test('locked_out_user should NOT be able to log in', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.geturl();
    await loginPage.loginWithCredentials('locked_out_user', PASSWORD);
    await loginPage.validateOnLoginPage();
    const isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBeTruthy();
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toContain(ERROR_MESSAGES.lockedOut);
    await loginPage.validateLoginFormVisible();
  });
});
// ═══════════════════════════════════════════════════════════════════════
//  Login - All Users with Wrong Password
// ═══════════════════════════════════════════════════════════════════════

test.describe('Login - All Users with Wrong Password', () => {

  for (const { username } of VALID_USERS) {
    test(`${username} with wrong password should show error`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.geturl();
      await loginPage.loginWithCredentials(username, "wrong_password");

      const isErrorVisible = await loginPage.isErrorVisible();
      expect(isErrorVisible).toBeTruthy();

      const errorMsg = await loginPage.getErrorMessage();
      expect(errorMsg).toContain(ERROR_MESSAGES.userMismatch);
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════
//  Login - Cart State After Fresh Login
// ═══════════════════════════════════════════════════════════════════════

test.describe('Login - Cart State After Fresh Login', () => {

  for (const { username, description } of VALID_USERS) {
    test(`${description} (${username}) should have empty cart after fresh login`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.geturl();
      await loginPage.loginWithCredentials(username, PASSWORD);
      await loginPage.validateOnInventoryPage();
      await loginPage.validateCartEmpty();
    });
  }
})

