import { expect } from '@playwright/test';

export default class AddToCart {

    constructor(page) {
        this.page = page;
        this.title = page.locator('.title');
        this.menu = page.locator('.react-burger-menu-btn');
        this.menuitem = page.locator('.bm-item-list>a');
        this.itemlist = page.locator('.inventory_list');
        this.addcartbtn = page.locator('button:has-text("Add to cart")').first();
        this.carticon = page.locator('a.shopping_cart_link');
        this.itemName = page.locator('.inventory_item_name ').first();
        this.itemDesc = page.locator('.inventory_item_desc').first();
        this.price = page.locator('.inventory_item_price').first();
        this.removebtn = page.locator('button:has-text("Remove")')
    }

    async sidemenu() {
        await expect(this.menuitem).toHaveText(['All Items', 'About', 'Logout', 'Reset App State']);
    }

    async addSingleItemToCart() {
        await expect(this.itemlist).toBeVisible();
        await expect(this.addcartbtn).toBeVisible();
        await this.addcartbtn.click();
        const productName = await this.itemName.textContent();
        const productdesc = await this.itemDesc.textContent();
        const amt = await this.price.textContent();
        await expect(this.removebtn).toBeVisible();
        await expect(this.carticon).toHaveText('1');
        await this.carticon.click();
        console.log("ProductName:" + productName + "\n Product desc:" + productdesc + "\n Amount:" + amt);
        return { productName, productdesc, amt };
    }

    async cartItem() {
        await expect(this.carticon).toBeVisible();
        const count = await this.page.locator('a.shopping_cart_link').textContent();
        console.log("Count:" + count);
        return { count };
    }


}

