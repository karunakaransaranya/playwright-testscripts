import { test } from '@playwright/test';
import LoginPage from '../pageobject/LoginPage.js';
import AddToCart from '../pageobject/AddToCart.js';
import CartItem from '../pageobject/CartItem.js';
import Checkout from '../pageobject/checkout.js';


test("Validate the login page", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.geturl();
  await loginPage.login()

})

test.only("Validate checkout flow", async ({ page }) => {

  const loginPage = new LoginPage(page);
  const addtoCart = new AddToCart(page);
  const cartItem = new CartItem(page);
  const checkout = new Checkout(page);
  await loginPage.geturl();
  await loginPage.login();
  await addtoCart.sidemenu();
  const { productName, productdesc, amt } = await addtoCart.addSingleItemToCart();
  const { count } = await addtoCart.cartItem();
  await cartItem.cartItemValidation(count, productName, productdesc, amt);
  await checkout.checkoutDetails("Sara", "Murphy", "12345");
  await checkout.validatedetail(count, productName, productdesc, amt);

})