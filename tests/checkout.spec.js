import { test, expect } from '@playwright/test';
import AddToCart from '../pageobject/AddToCart.js';
import CartItem from '../pageobject/CartItem.js';
import Checkout from '../pageobject/checkout.js';


test("Validate checkout flow with single product", async ({ page }) => {
  const addtoCart = new AddToCart(page);
  const cartItem = new CartItem(page);
  const checkout = new Checkout(page);
  
  // Navigate directly to inventory page with auth state already applied
  await page.goto('https://www.saucedemo.com/inventory.html');
  await addtoCart.sidemenu();
  const { productName, productdesc, amt } = await addtoCart.addSingleItemToCart();
  const { count } = await addtoCart.cartItem();
  await cartItem.cartItemValidation(count, productName, productdesc, amt);
  await checkout.checkoutDetails("Sara", "Murphy", "12345");
  await checkout.validatedetail(count, productName, productdesc, amt);
})

test("Validate checkout flow with multiple products", async ({ page }) => {
  const addtoCart = new AddToCart(page);
  const checkout = new Checkout(page);
  const cartItem = new CartItem(page);
  
  // Navigate directly to inventory page with auth state already applied
  await page.goto('https://www.saucedemo.com/inventory.html');
  await addtoCart.sidemenu();
  
  // Add 3 products to cart
  const { products, cartCount } = await addtoCart.addMultipleItemsToCart(3);
  console.log(`Added ${cartCount} products to cart`);
  
  // Verify cart items
  const cartItems = await cartItem.getCartItems();
  expect(cartItems.length).toBe(3);
  console.log("Cart items verified:", cartItems);
  
  // Proceed to checkout
  await checkout.checkoutDetails("Sara", "Murphy", "12345");
  
  // Validate all products in checkout
  await checkout.validateAllCheckoutDetails(products);
})

