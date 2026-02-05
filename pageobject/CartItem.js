import {expect} from '@playwright/test'
export default class CartItem {

    constructor(page){
        this.page = page;
        this.qtylbl = page.locator('.cart_quantity_label');
        this.desclbl = page.locator('.cart_desc_label');
        this.cartQty = page.locator('.cart_quantity');
        this.itemName = page.locator('.inventory_item_name');
        this.itemdesc = page.locator('.inventory_item_desc');
        this.itemprice = page.locator('.inventory_item_price');
        this.btnchkout = page.locator('#checkout');
        this.contShopbtn = page.getByRole('button', { name: 'Continue Shopping' });

    }

    async cartItemValidation(qty,itemname,itemdesc,price){
        await expect(this.qtylbl).toBeVisible();
        await expect(this.desclbl).toBeVisible();
        await expect(this.contShopbtn).toBeVisible();
        if (qty) {
            console.log("quantity is:" + qty);
            await expect(this.cartQty).toContainText(qty.toString());
        }
        if (itemname) {
            console.log("itemname is:" + itemname);
            await expect(this.itemName).toContainText(itemname);
        }
        if (itemdesc) {
            console.log("itemdesc is:" + itemdesc);
            await expect(this.itemdesc).toContainText(itemdesc);
        }
        if (price) {
            console.log("itemprice is:" + price);
            await expect(this.itemprice).toContainText(price);
        }
        await this.btnchkout.click();
   
    }

     async getCartItems() {
        const cartItems = [];
        const items = this.page.locator('.cart_item');
        const itemCount = await items.count();
        
        for (let i = 0; i < itemCount; i++) {
            const item = items.nth(i);
            const name = await item.locator('.inventory_item_name').textContent();
            const desc = await item.locator('.inventory_item_desc').textContent();
            const price = await item.locator('.inventory_item_price').textContent();
            const qty = await item.locator('.cart_quantity').textContent();
            
            cartItems.push({ name, desc, price, qty });
        }
        await this.btnchkout.click();
        return cartItems;
    }


}