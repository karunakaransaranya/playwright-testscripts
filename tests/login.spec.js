import { test, expect } from '@playwright/test';
import LoginPage from '../pageobject/LoginPage.js';


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
  expect(errorMsg).toContain("Username and password do not match");
})

test("Login with invalid username and valid password", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.geturl();
  await loginPage.loginWithCredentials("invalid_user", "secret_sauce");
  const isErrorVisible = await loginPage.isErrorVisible();
  expect(isErrorVisible).toBeTruthy();
  const errorMsg = await loginPage.getErrorMessage();
  expect(errorMsg).toContain("Username and password do not match");
})

test("Login with both fields blank", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.geturl();
  await loginPage.loginWithCredentials("", "");
  const isErrorVisible = await loginPage.isErrorVisible();
  expect(isErrorVisible).toBeTruthy();
  const errorMsg = await loginPage.getErrorMessage();
  expect(errorMsg).toContain("Username is required");
})

test("Login with blank username and valid password", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.geturl();
  await loginPage.loginWithCredentials("", "secret_sauce");
  const isErrorVisible = await loginPage.isErrorVisible();
  expect(isErrorVisible).toBeTruthy();
  const errorMsg = await loginPage.getErrorMessage();
  expect(errorMsg).toContain("Username is required");
})

test("Login with valid username and blank password", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.geturl();
  await loginPage.loginWithCredentials("standard_user", "");
  const isErrorVisible = await loginPage.isErrorVisible();
  expect(isErrorVisible).toBeTruthy();
  const errorMsg = await loginPage.getErrorMessage();
  expect(errorMsg).toContain("Password is required");
})

