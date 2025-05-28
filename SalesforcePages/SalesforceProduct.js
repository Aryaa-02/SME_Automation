import { expect } from '@playwright/test';
import { SalesforceState } from '../Pages/Storage';
import { SalesforceCreds } from '../Pages/SalesforceCreds';
import { readFile } from 'fs/promises';

export async function verifySalesforceProductSync(browser) {
  const rawData = await readFile('./ShopifyData/Shopifyproductdata.json', 'utf-8');
  const Shopifyproductdata = JSON.parse(rawData);

  const { SalesforcePage } = await SalesforceState(browser);
  await SalesforcePage.goto(SalesforceCreds.url);
  await SalesforcePage.locator("input[name='username']").fill(SalesforceCreds.username);
  await SalesforcePage.locator("input[name='pw']").fill(SalesforceCreds.password);
  await SalesforcePage.locator("input[name='Login']").click();
  await SalesforcePage.locator('button[title="App Launcher"]').waitFor({ state: 'visible' });
  await SalesforcePage.locator('button[title="App Launcher"]').click();
  const AppLauncher = await SalesforcePage.locator(".slds-size_medium");
  await AppLauncher.locator(".slds-input").fill("HIC Sync Made easy");
  await AppLauncher.locator(".slds-size_small").click();
  await SalesforcePage.waitForLoadState("load");
  await SalesforcePage.locator('button[aria-label= "Search"]').click();
  await SalesforcePage.locator('input[placeholder="Search..."]').fill(Shopifyproductdata.productID);
  // fill(Shopifyproductdata.productID);
  await SalesforcePage.keyboard.press('Enter');

  //Using timeout as it's always take 10-15 to sync so as per me it best to wait or refreshing continusly for 10-15 sec
  await SalesforcePage.waitForTimeout(10000);

  //Waiting for Shopify Product to sync in Salesforce
  const searchProduct = await SalesforcePage.locator(`a[title="${Shopifyproductdata.productName}"]`);

  for (let i = 1; i <= 10; i++) {
    try {
      await searchProduct.waitFor({ state: 'visible' });
      await searchProduct.click();
      break;
    } catch (e) {
      await SalesforcePage.locator(`button[aria-label*="${Shopifyproductdata.productID}"]`).click();
      // await SalesforcePage.locator(`button[aria-label="Search:${Shopifyproductdata.productID}"]`).click();
      await SalesforcePage.keyboard.press('Enter');
    }
  }

  await SalesforcePage.locator("#detailTab__item").click();
  //Matchingt the Product Name
  const salesforceProductName = await SalesforcePage.locator("div[data-target-selection-name='sfdc:RecordField.Product2.Name'] .slds-form-element__control").textContent();
  await expect(salesforceProductName).toBe(Shopifyproductdata.productName);

  //Matching the Store Name
  const salesforceStoreName = await SalesforcePage.locator("div[data-target-selection-name='sfdc:RecordField.Product2.HIC_ShopifySync__Store__c'] .slds-form-element__control").textContent();
  // expect(salesforceStoreName).toBe();

  //Matching the Product ID
  const salesforceProductID = await SalesforcePage.locator("div[data-target-selection-name='sfdc:RecordField.Product2.HIC_ShopifySync__Shopify_Id__c'] .slds-form-element__control").textContent();
  expect(salesforceProductID).toBe(Shopifyproductdata.productID);

  //Matching the Salesforce Tags
  const salesforceTags = await SalesforcePage.locator("div[data-target-selection-name='sfdc:RecordField.Product2.HIC_ShopifySync__Tags__c'] .slds-form-element__control").textContent();
  // expect(salesforceTags).toBe

  //Matching the Salesforce Tags
  const salesforceProductDescription = await SalesforcePage.locator("div[data-target-selection-name='sfdc:RecordField.Product2.Description'] .slds-form-element__control").textContent();
  expect(salesforceProductDescription).toBe(Shopifyproductdata.productDescriptionwithTags);

  //Checking the variant deatils
  await SalesforcePage.locator('#relatedListsTab__item').click();
  await SalesforcePage.locator('article[aria-label="Variants"] .view-all-label').click();
  await SalesforcePage.waitForLoadState('load');
  const variants = await SalesforcePage.locator('tbody[style="counter-reset: row-number 0;"] tr');
  const variantCount = await variants.count();
  console.log("Variant Count :" + variantCount);
  for (let a = 0; a < variantCount; a++) {
    const variantdata = Shopifyproductdata.variantData[a];
    const fetchVariantName = await variants.nth(a).locator('th[data-label="Variant Name"]').textContent();
    //GreenOpen Green PreviewOpen Green Preview
    const variantName = fetchVariantName.split('Open')[0];
    console.log(variantName);
    const variantPrice = await variants.nth(a).locator('td[data-label="Price"]').textContent();
    console.log(variantPrice);
    const variantQuantity = await variants.nth(a).locator('td[data-label="Quantity"]').textContent();
    console.log(variantQuantity);
    const variantStore = await variants.nth(a).locator('td[data-label="Store"]').textContent();
    const variantShopifyID = await variants.nth(a).locator('td[data-label="Shopify id"]').textContent();
    console.log(variantShopifyID);


    expect(variantName).toBe(variantdata.name);
    expect(variantPrice).toBe(variantdata.price);
    expect(variantQuantity).toBe(variantdata.quantity);
    // await expect(variantStore).toBe(Shopifyproductdata.variantData.name);
    expect(variantShopifyID).toBe(variantdata.ID);
  }
};