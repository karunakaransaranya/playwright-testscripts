import { expect } from '@playwright/test'
export default class LoginPage {
    constructor(page) {
        this.page = page;
        this.username = page.locator("#user-name");
        this.password = page.locator("#password");
        this.loginbutton = page.locator("#login-button");
        this.title = page.locator('.title');
        this.errorMessage = page.locator('[data-test="error"]');
        this.logo = page.locator('.login_logo');
        this.loginCredentialsSection = page.locator('#login_credentials');
        this.passwordInfoSection = page.locator('.login_password');
        this.errorCloseButton = page.locator('.error-button');
        this.loginForm = page.locator('form');
        this.inventoryItems = page.locator('.inventory_item');
        this.menuButton = page.locator('#react-burger-menu-btn');
        this.logoutLink = page.locator('#logout_sidebar_link');
        this.cartBadge = page.locator('.shopping_cart_badge');


    }

    async geturl() {

        const loginUrl = process.env.LOGIN_URL;
       await this.page.goto(loginUrl, { waitUntil: 'domcontentloaded' });
     
    
    }


    async validateLookAndFeel(expectedURL, usernames) {
        await expect(this.page).toHaveTitle('Swag Labs');
        await expect(this.page).toHaveURL(expectedURL);

        await expect(this.logo).toBeVisible();
        await expect(this.logo).toHaveText('Swag Labs');

        await expect(this.username).toBeVisible();
        await expect(this.username).toHaveAttribute('placeholder', 'Username');
        await expect(this.username).toHaveAttribute('type', 'text');

        await expect(this.password).toBeVisible();
        await expect(this.password).toHaveAttribute('placeholder', 'Password');
        await expect(this.password).toHaveAttribute('type', 'password');

        await expect(this.loginbutton).toBeVisible();
        await expect(this.loginbutton).toHaveAttribute('value', 'Login');
        await expect(this.loginbutton).toBeEnabled();

        await expect(this.loginCredentialsSection).toBeVisible();
        await expect(this.loginCredentialsSection).toContainText('Accepted usernames are');
        for (const user of usernames) {
            await expect(this.loginCredentialsSection).toContainText(user);
        }

        await expect(this.passwordInfoSection).toBeVisible();
        await expect(this.passwordInfoSection).toContainText('Password for all users');
        await expect(this.passwordInfoSection).toContainText('secret_sauce');

        await expect(this.errorMessage).not.toBeVisible();

    }



    async validateErrorCloseButtonVisible() {
        await expect(this.errorMessage).toBeVisible();
        await expect(this.errorCloseButton).toBeVisible();
    }

    async closeErrorMessage() {
        await this.errorCloseButton.click();
        await expect(this.errorMessage).not.toBeVisible();
    }

    async fillUsername(value) {
        await this.username.fill(value);
        await expect(this.username).toHaveValue(value);
    }

    async fillPassword(value) {
        await this.password.fill(value);
        await expect(this.password).toHaveValue(value);
    }

    async validateOnInventoryPage() {
        await expect(this.page).toHaveURL(/inventory/, { timeout: 15000 });
        await expect(this.title).toHaveText('Products');
    }

    async validateInventoryItemsVisible() {
        await expect(this.inventoryItems.first()).toBeVisible();
        const count = await this.inventoryItems.count();
        expect(count).toBeGreaterThan(0);
    }

    async validateMenuButtonVisible() {
        await expect(this.menuButton).toBeVisible();
    }

    async logout() {
        await this.menuButton.click();
        await expect(this.logoutLink).toBeVisible({ timeout: 5000 });
        await this.logoutLink.click();
        await expect(this.page).toHaveURL(/saucedemo\.com\/?$/);
        await expect(this.loginbutton).toBeVisible();
    }

    async validateOnLoginPage() {
        await expect(this.page).toHaveURL(/saucedemo\.com\/?$/);
    }

    async validateLoginFormVisible() {
        await expect(this.username).toBeVisible();
        await expect(this.password).toBeVisible();
        await expect(this.loginbutton).toBeVisible();
    }

    async validateCartEmpty() {
        await expect(this.cartBadge).not.toBeVisible();
    }

    async login() {
        await this.username.fill("standard_user");
        await this.password.fill("secret_sauce");
        await this.loginbutton.click();
        await expect(this.title).toHaveText('Products');
    }

    async loginWithCredentials(username, password) {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.loginbutton.click();
    }

    async getErrorMessage() {
        return await this.errorMessage.textContent();
    }

    async isErrorVisible() {
        return await this.errorMessage.isVisible();
    }

    async clearFields() {
        await this.username.clear();
        await this.password.clear();
    }
}
