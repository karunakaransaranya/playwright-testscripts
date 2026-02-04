import { expect } from '@playwright/test';

export default class Checkout {

    constructor(page) {
        this.page = page;
        this.fn = page.locator('[data-test="firstName"]');
        this.ln = page.locator('[data-test="lastName"]');
        this.zip = page.locator('[data-test="postalCode"]');
        this.cancel= page.locator('[data-test="cancel"]');
        this.continuebtn = page.locator('#continue')
        this.finish = page.locator('[data-test="finish"]');
        this.header = page.locator('[data-test="complete-header"]');
        this.text = page.locator('[data-test="complete-text"]');
        this.qty = page.locator('.cart_quantity');
        this.productname = page.locator('.inventory_item_name');
        this.productdesc = page.locator('.inventory_item_desc');
        this.price = page.locator('.inventory_item_price');
    }

    async checkoutDetails(firstname, lastname, postalcode) {
        await this.fn.fill(firstname);
        await this.ln.fill(lastname);
        await this.zip.fill(postalcode);
        await expect(this.cancel).toBeVisible();
        await this.continuebtn.click();
    }

    async validatedetail(qty,productname,productdesc,price) {
            await expect(this.qty).toContainText(qty.toString());
            await expect(this.productname).toContainText(productname);
            await expect(this.productdesc).toContainText(productdesc);
            await expect(this.price).toContainText(price);    
        await this.finish.click();
        await expect(this.header).toHaveText('Thank you for your order!');
        await expect(this.text).toHaveText('Your order has been dispatched, and will arrive just as fast as the pony can get there!');
    }
}