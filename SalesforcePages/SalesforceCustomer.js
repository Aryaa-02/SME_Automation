import {expect} from '@playwright/test';
import { SalesforceCreds } from '../Pages/SalesforceCreds';
import { SalesforceState } from '../Pages/Storage';
import customerdata from '../ShopifyData/customerdata.json' assert { type: 'json' }; 

  export async function verifySalesforceCustomerSync(browser){
const { SalesforcePage } = await SalesforceState(browser);
await SalesforcePage.goto("https://login.salesforce.com/?locale=in");
await SalesforcePage.locator("input[name='username']").fill(SalesforceCreds.username);
await SalesforcePage.locator("input[name='pw']").fill(SalesforceCreds.password);
await SalesforcePage.locator("input[name='Login']").click();  
await SalesforcePage.locator('button[title="App Launcher"]').click();
const AppLauncher = await SalesforcePage.locator(".slds-size_medium")
await AppLauncher.locator(".slds-input").fill("HIC Sync Made easy");
await AppLauncher.locator(".slds-size_small").click();
await SalesforcePage.waitForLoadState("load");
await SalesforcePage.locator('button[aria-label= "Search"]').click();
await SalesforcePage.locator('input[placeholder="Search..."]').fill(customerdata.customerShopifyID);
await SalesforcePage.keyboard.press('Enter');

//Using timeout as it's always take 10-15 to sync so as per me it best to wait or refreshing continusly for 10-15 sec
  await SalesforcePage.waitForTimeout(10000);

//Waiting for Shopify Customer to be Synced as Acccount & Contact
const searchAccount = SalesforcePage.locator(`a[title='${customerdata.customerCompany}']`).first();
for (let i = 1; i <= 10; i++) {
    try {
      await searchAccount.waitFor({ state: 'visible'});
      await searchAccount.click();
      break;
    } catch (e) {
      await SalesforcePage.locator(`button[aria-label$="Search:"${customerdata.ShopifyCustomerID}]`).click();
      await SalesforcePage.keyboard.press('Enter');
    }
}

//Matching the Shopify ID from both Platform
await SalesforcePage.locator('#detailTab__item').click();
const shopifyField = await SalesforcePage.locator('records-record-layout-item[field-label="Shopify Id"]');
const getShopifyID = await shopifyField.locator('lightning-formatted-text[slot="outputField"]');
const customerShopifyID = await getShopifyID.textContent();
const accountId = customerShopifyID.split(" ")[1];
await expect((accountId)).toBe(customerdata.customerShopifyID);

//Matching the company name of both platform
const salesforceAccount = await SalesforcePage.locator('records-record-layout-item[field-label="Account Name"]');
const salesforceAccountName = await salesforceAccount.locator('lightning-formatted-text[slot="outputField"]').textContent();
await expect(salesforceAccountName).toBe(customerdata.customerCompany);

//Matching the address of both platform
const salesforceAccountAddress = await SalesforcePage.locator('records-record-layout-item[field-label="Billing Address"]');
const editAccountAddress = await salesforceAccountAddress.locator('.slds-assistive-text').click();
const accountBillingAddress =  await SalesforcePage.locator('div[data-target-selection-name="sfdc:RecordField.Account.BillingAddress"]');
const accountBillingStreet = await accountBillingAddress.locator('textarea[name="street"]').inputValue();
await expect(accountBillingStreet).toBe(customerdata.customerAddress1);
console.log("Street: " + accountBillingStreet);

const accountBillingCity  = await accountBillingAddress.locator('input[name="city"]').inputValue();
console.log("City: "+accountBillingCity);
await expect(accountBillingCity).toBe(customerdata.customerCity);
const accountPostalCode  = await accountBillingAddress.locator('input[name="postalCode"]').inputValue();
await expect(accountPostalCode).toBe(customerdata.customerPincode);
console.log("PostalCode: "+accountPostalCode);
const accountprovince  = await accountBillingAddress.locator('input[name="province"]').inputValue();
await expect(accountprovince).toBe(customerdata.customerProvince);
console.log("Zip: "+accountprovince);
await SalesforcePage.keyboard.press('Control+S');

//Getting the contact details of Contact under the account
await SalesforcePage.locator('#relatedListsTab__item').click();
const contact = await SalesforcePage.locator(`article[aria-label='${customerdata.customerFullName}']`);
await contact.locator('.slds-truncate').first().click();
const detailTab = SalesforcePage.locator('#detailTab__item');
await SalesforcePage.locator('(//li[@title="Details"]/a[@id="detailTab__item"])[2]').click();

const contactName = await SalesforcePage.locator('records-record-layout-item[field-label="Name"]');
const editContactName = await contactName.locator('button[title="Edit Name"]').click();
const fullContactName = await SalesforcePage.locator("div[data-target-selection-name='sfdc:RecordField.Contact.Name']");
const contactFirstName = await fullContactName.locator("input[name='firstName']").inputValue();
await expect(contactFirstName).toBe(customerdata.customerFirstName)
console.log("Contact First Name: "+ contactFirstName);
const contactLastName = await fullContactName.locator("input[name='lastName']").inputValue();
await expect(contactLastName).toBe(customerdata.customerLastName);
console.log("Contact Last Name: "+contactLastName);
await SalesforcePage.keyboard.press("Control+S");

//Getting the EmailID and Mobile Phone
const conPhone = await SalesforcePage.locator("records-record-layout-item[field-label='Phone']");
const contactPhone =await conPhone.locator("slot[name='outputField']").textContent();
console.log("Contact Phone Number: " +contactPhone)
const conemail = await SalesforcePage.locator("records-record-layout-item[field-label='Email']");
  let contactEmailWithSpace =await conemail.locator("slot[name='outputField']").textContent();
  const contactEmail = contactEmailWithSpace.trim();
await expect(contactEmail).toBe(customerdata.customerEmail.toLowerCase());
console.log("Contact Email: "+contactEmail);
}