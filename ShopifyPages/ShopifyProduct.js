import { expect } from '@playwright/test';
import { ShopifyState } from '../Pages/Storage';
import { ShopifyData, productData } from '../Pages/SMEData';
import { promises as fs } from 'fs';
import { writeFile } from 'fs/promises';

export async function createShopifyProduct(browser){
    const { ShopifyPage } = await ShopifyState(browser);
    await ShopifyPage.goto(ShopifyData.ShopifyURL);
    await ShopifyPage.getByText("Log in").first().click();
    await ShopifyPage.locator(".user-card__name").click();
    await ShopifyPage.getByText("Products").click();
    await ShopifyPage.getByText("Add product").click();
    await ShopifyPage.waitForLoadState('load');
    const enterProductName = await ShopifyPage.locator("input[name='title']");
    await expect(enterProductName).toBeVisible();
    await enterProductName.fill(productData.Product);
    const productDescripton = await ShopifyPage.frameLocator("#product-description_ifr");
    await productDescripton.locator("#tinymce").fill(productData.ProductDescription);
    await ShopifyPage.locator('input[name="price"]').fill(productData.ProductPrice);
    const productPrice = await ShopifyPage.locator('input[name="price"]').inputValue();
    await ShopifyPage.locator('input[name="weight"]').fill(String(productData.ProductWeight));
    const productUnit = await ShopifyPage.locator("#ShippingCardWeightUnit");
    productUnit.selectOption("KILOGRAMS");

    //Adding the variants in the product.
    await ShopifyPage.locator('text="Add options like size or color"').click();

    await ShopifyPage.locator('input[name="optionName[0]"]').fill("Color");
    await ShopifyPage.locator('input[name="optionValue[0][0]"]').fill(productData.ProductVariant1);
    await ShopifyPage.locator('input[name="optionValue[0][1]"]').fill(productData.ProductVariant2);
    await ShopifyPage.locator('input[name="optionValue[0][2]"]').fill(productData.ProductVariant3);
    await ShopifyPage.locator('text="Done"').click();

    const rows = await ShopifyPage.locator('.Polaris-IndexTable__Table tr.Polaris-IndexTable__TableRow');
    const rowCount = await rows.count();

    //Creating a array for storing the Name, Inventory and Variant Value.
    const variantData = []



    for (let i = 0; i < rowCount; i++) {
        const variantNameInput = rows.nth(i).locator('td:nth-child(2) .Polaris-BlockStack:nth-of-type(2)');
        const priceInput = rows.nth(i).locator('td:nth-child(3) input.Polaris-TextField__Input');
        const quantityInput = rows.nth(i).locator('td:nth-child(4) input.Polaris-TextField__Input');

        await priceInput.fill(productData.ProductVariantPrices[i]);
        await quantityInput.fill(String(productData.ProductVariantQuantity[i]));

        const variantName = await variantNameInput.textContent();
        const variantValue = await priceInput.inputValue();
        const quantiyValue = await quantityInput.inputValue();

        variantData.push({
            name: variantName,
            price: variantValue,
            quantity: quantiyValue
        });
    }

    await ShopifyPage.locator("button[aria-label='Save']").click();
    await ShopifyPage.locator('text=Product created').waitFor({ state: 'visible' });
    await ShopifyPage.locator("text=Product created").waitFor({ state: 'hidden' });
    await ShopifyPage.waitForLoadState('load');

    //Getting the Product Shopify ID from URL.
    const productPageURL = await ShopifyPage.url();
    const productID = productPageURL.split("products/")[1];
    console.log(productID);

    // await ShopifyPage.pause();

    for (let a = 0; a < rowCount; a++) {
  const variantName = variantData[a].name;
  const productVariantLocator = ShopifyPage.locator(`xpath=//p[normalize-space()='${variantName}']`);
  await productVariantLocator.click();
  await ShopifyPage.locator("input[name='selectedOptions.0.value']").waitFor({ state: 'visible' });
  await ShopifyPage.waitForLoadState('load');

  const variantURL = ShopifyPage.url();
  const variantShopifyId = variantURL.split("variants/")[1];
  variantData[a].ID = variantShopifyId;

  await ShopifyPage.goBack();
  await ShopifyPage.waitForLoadState('load');
}

    //Getting all the data from the fields
    let productName = await ShopifyPage.locator("input[name='title']").inputValue();
    const enteredDescripton = await ShopifyPage.frameLocator("#product-description_ifr");
    let productDescription = await enteredDescripton.locator("#tinymce").textContent();
    const  productDescriptionwithTags = "<p>"+productDescription+"</p>"
    console.log(productDescriptionwithTags);

    const Shopifyproductdata = {
        productID,
        productName,
        productDescriptionwithTags,
        productPrice,
        variantData
    }

    await fs.writeFile('../SME_Easy/ShopifyData/Shopifyproductdata.json', JSON.stringify(Shopifyproductdata, null, 2));
    return Shopifyproductdata;
};
