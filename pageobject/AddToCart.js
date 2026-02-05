import { expect } from '@playwright/test';

export default class AddToCart {

    constructor(page) {
        this.page = page;
        this.title = page.locator('.title');
        this.menu = page.locator('.react-burger-menu-btn');
        this.menuitem = page.locator('.bm-item-list>a');
        this.itemlist = page.locator('.inventory_list');
        this.addcartbtn = page.locator('button:has-text("Add to cart")');
        this.carticon = page.locator('a.shopping_cart_link');
        this.itemName = page.locator('.inventory_item_name');
        this.itemDesc = page.locator('.inventory_item_desc');
        this.price = page.locator('.inventory_item_price');
        this.inventoryItems = page.locator('.inventory_item');
        this.removebtn = page.locator('button:has-text("Remove")');
    }

    async sidemenu() {
        await expect(this.menuitem).toHaveText(['All Items', 'About', 'Logout', 'Reset App State']);
    }

    async addSingleItemToCart() {
        await expect(this.itemlist).toBeVisible();
        const firstAddBtn = this.page.locator('button:has-text("Add to cart")').first();
        await expect(firstAddBtn).toBeVisible();
        await firstAddBtn.click();
        const productName = await this.page.locator('.inventory_item_name').first().textContent();
        const productdesc = await this.page.locator('.inventory_item_desc').first().textContent();
        const amt = await this.page.locator('.inventory_item_price').first().textContent();
        await expect(this.page.locator('button:has-text("Remove")').first()).toBeVisible();
        await expect(this.carticon).toContainText('1');
        await this.carticon.click();
        console.log("ProductName:" + productName + "\n Product desc:" + productdesc + "\n Amount:" + amt);
        return { productName, productdesc, amt };
    }

    async addMultipleItemsToCart(numberOfItems) {
        await expect(this.itemlist).toBeVisible();
        const products = [];
        const addButtons = this.page.locator('button:has-text("Add to cart")');
        const totalButtons = await addButtons.count();
        
        // Add specified number of items
        const itemsToAdd = Math.min(numberOfItems, totalButtons);
        for (let i = 0; i < itemsToAdd; i++) {
            const itemContainer = this.page.locator('.inventory_item').nth(i);
            const productName = await itemContainer.locator('.inventory_item_name').textContent();
            const productDesc = await itemContainer.locator('.inventory_item_desc').textContent();
            const productPrice = await itemContainer.locator('.inventory_item_price').textContent();
            
            const addBtn = itemContainer.locator('button:has-text("Add to cart")');
            await addBtn.click();
            
            products.push({
                name: productName,
                desc: productDesc,
                price: productPrice
            });
            
            console.log(`Added item ${i + 1}: ${productName}`);
        }
        
        // Verify cart count
        await expect(this.carticon).toContainText(itemsToAdd.toString());
        await this.carticon.click();
        
        return { products, cartCount: itemsToAdd };
    }

    async cartItem() {
        await expect(this.carticon).toBeVisible();
        const count = await this.page.locator('a.shopping_cart_link').textContent();
        console.log("Count:" + count);
        return { count };
    }

   
}

