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
        // Validate first item in checkout summary (multiple items exist)
        await expect(this.qty.first()).toContainText('1');
        await expect(this.productname.first()).toContainText(productname);
        await expect(this.productdesc.first()).toContainText(productdesc);
        await expect(this.price.first()).toContainText(price);    
        await this.finish.click();
        await expect(this.header).toHaveText('Thank you for your order!');
        await expect(this.text).toHaveText('Your order has been dispatched, and will arrive just as fast as the pony can get there!');
    }

    async validateAllCheckoutDetails(products) {
        // Validate all products in checkout summary
        const productNames = this.page.locator('.inventory_item_name');
        const productDescs = this.page.locator('.inventory_item_desc');
        const productPrices = this.page.locator('.inventory_item_price');
        const quantities = this.page.locator('.cart_quantity');

        // Verify number of items matches
        const itemCount = await productNames.count();
        expect(itemCount).toBe(products.length);
        console.log(`Validating ${itemCount} products in checkout`);

        // Validate each product
        for (let i = 0; i < products.length; i++) {
            console.log(`Validating product ${i + 1}: ${products[i].name}`);
            
            await expect(productNames.nth(i)).toContainText(products[i].name);
            await expect(productDescs.nth(i)).toContainText(products[i].desc);
            await expect(productPrices.nth(i)).toContainText(products[i].price);
            await expect(quantities.nth(i)).toContainText('1');
            
            console.log(`✓ Product ${i + 1} validated successfully`);
        }

        // Proceed to finish order
        await this.finish.click();
        await expect(this.header).toHaveText('Thank you for your order!');
        await expect(this.text).toHaveText('Your order has been dispatched, and will arrive just as fast as the pony can get there!');
        console.log('Order completed successfully!');
    }
}