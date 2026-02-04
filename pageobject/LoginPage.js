import {expect} from '@playwright/test'
export default class LoginPage {
    constructor(page) {
        this.page = page;
        this.username = page.locator("#user-name");
        this.password = page.locator("#password");
        this.loginbutton = page.locator("#login-button");
        this.title = page.locator('.title');
    }

    async geturl() {
        await this.page.goto('https://www.saucedemo.com');
    }

    async login() {
        await this.username.fill("standard_user");
        await this.password.fill("secret_sauce");
        await this.loginbutton.click();
        await expect(this.title).toHaveText('Products');

    }
}
