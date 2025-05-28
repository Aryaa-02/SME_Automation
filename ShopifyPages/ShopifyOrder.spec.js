import {test,expect} from '@playwright/test';
import { ShopifyState } from '../Pages/Storage';
import {ShopifyData, orderData} from '../Pages/SMEData';
import customerData from '../customerData.json' assert { type: 'json' };
import ShopifyProductInfo from '../ShopifyProductInfo.json' assert { type: 'json' };

test('ShopifyOrder', async ({ browser }) => {
    const { ShopifyPage } = await ShopifyState(browser);
    await ShopifyPage.goto(ShopifyData.ShopifyURL);
    await ShopifyPage.locator('text="Log in"').first().click();
    await ShopifyPage.locator(".user-card__name").click();
    await ShopifyPage.locator('text="Orders"').first().click();
    await ShopifyPage.locator('text="Create order"').click();
    await ShopifyPage.waitForLoadState('load');

    //Selecting the prduct
    const browseProduct = await ShopifyPage.locator('input[name="productPicker"]');
    await browseProduct.click();
    await browseProduct.fill("Fantastic Plastic Shoes");
    const selectProduct = await ShopifyPage.locator('.Polaris-Modal-Dialog__Modal');
    await selectProduct.locator('text="Fantastic Plastic Shoes"').last().click();
    await selectProduct.locator('text="Add"').click();
    await ShopifyPage.waitForSelector('.Polaris-LegacyCard input[type="number"]', { state: 'visible' });
    const quantityInputs = ShopifyPage.locator('.Polaris-LegacyCard input[type="number"]');
    const productCount = await quantityInputs.count();

    let orderProductQuantity = []

    //Increasnig the quantity of products
    for (let i = 0; i < productCount; i++) {
        const quantityInput = quantityInputs.nth(i);
        const valueToFill = String(orderData.variantQuantity[i]);

        await quantityInput.fill(valueToFill);

        const filledValue = await quantityInput.inputValue();

        orderProductQuantity.push({
            quantity: filledValue
        });
    }


    await ShopifyPage.locator('input[placeholder="Search or create a customer"]').fill("Alia Gorczany");//(customerData.FirstName + customerData.LastName);
    const selectCustomer = await ShopifyPage.locator('.Polaris-Popover__ContentContainer');
    await selectCustomer.locator('text="Alia Gorczany"').click();//(`text=${customerData.FirstName + customerData.LastName}`).click();
    const confirmOrderCustomer = await ShopifyPage.locator('div[aria-label="Customer"]');
    await expect(confirmOrderCustomer).toBeVisible();
    await ShopifyPage.locator('text="Mark as paid"').click();
    const confirmOrder = await ShopifyPage.locator('.Polaris-Modal-Dialog__Modal');
    await confirmOrder.locator('text="Create order"').click();
    const orderCreatedText = ShopifyPage.locator('span:has-text("Order created")');
    await orderCreatedText.waitFor({ state: 'visible' });
    await orderCreatedText.waitFor({ state: 'hidden' });
    await ShopifyPage.waitForLoadState('load');
    const orderPageUrl= await ShopifyPage.url();
    const getShopifyID = orderPageUrl.split("orders/")[1];
    let shopifyOrderId = getShopifyID.split("?")[0];
    let shopifyOrderID = shopifyOrderId;
    console.log(shopifyOrderID);
});