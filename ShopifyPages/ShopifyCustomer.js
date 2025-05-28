import { test, expect } from '@playwright/test';
import { ShopifyState } from '../Pages/Storage.js';
import { ShopifyCustomer, ShopifyData } from '../Pages/SMEData.js';
import { promises as fs } from 'fs';


// export async function ShopifyCustomerID () {
// test('Shopify Customer', async({browser}) => {
  export async function createShopifyCustomer(browser){
   const { ShopifyPage } = await ShopifyState(browser);
    await ShopifyPage.goto(ShopifyData.ShopifyURL);
    await ShopifyPage.getByText("Log in").first().click();
    await ShopifyPage.locator(".user-card__name").click();
    await ShopifyPage.getByText("Customers").first().click();
    await ShopifyPage.getByText("Add customer").click();
    await ShopifyPage.locator("input[name='firstName']").fill(ShopifyCustomer.FirstName);
    await ShopifyPage.locator("input[name='lastName']").fill(ShopifyCustomer.LastName);
    await ShopifyPage.locator("input[name='email']").fill(ShopifyCustomer.CustomerEmail);
    await ShopifyPage.locator("input[name='phone']").fill(ShopifyCustomer.CustomerPhone);

    //Storing the Values of the customerData
    const customerFirstName = await ShopifyPage.locator("input[name='firstName']").inputValue();
    const customerLastName = await ShopifyPage.locator("input[name='lastName']").inputValue();
    const customerEmail =  await ShopifyPage.locator("input[name='email']").inputValue();
    const customerPhone = ShopifyPage.locator("input[name='phone']").inputValue();
    await ShopifyPage.locator('text=Add address').click();
    const customerFullName = (customerFirstName + " " + customerLastName);
     
    //Adding a new Company under customer.
    const CustomerAddress = await ShopifyPage.locator(".Polaris-Modal-Section");
    await CustomerAddress.locator("input[name='company']").fill(ShopifyCustomer.CustomerCompany);
    const customerCompany =  await CustomerAddress.locator("input[name='company']").inputValue();
    await CustomerAddress.locator("input[name='address1']").fill("Hello");
    const CustomerCompanyAddress = await ShopifyPage.locator(".Polaris-Listbox");
    await CustomerCompanyAddress.locator(".Polaris-Listbox-TextOption").first().click();
      
    //Adding asserations here to wait for the data.
    await expect(CustomerAddress.locator("input[name='address1']")).toHaveValue("Hello INN By VYDA AECS Layout Brookefield");

     //Saving the data to merge and match with Salesforce
    const customerAddress1 = await ShopifyPage.locator("input[name='address1']").inputValue();
    const customerCity = await ShopifyPage.locator("input[name='city']").inputValue();
    const customerProvince = await ShopifyPage.locator("select[name='province'] >> option:checked").textContent();
    const customerPincode = await ShopifyPage.locator("input[name='zip']").inputValue();

    await ShopifyPage.locator('button.Polaris-Button span.Polaris-Text--semibold').click();
    await ShopifyPage.getByRole('button', {name:'Save'}).first().click();
    const customerSave = await ShopifyPage.locator("text=Customer Created");
    await customerSave.waitFor({ state: 'visible' });
    await customerSave.waitFor({ state: 'hidden' });

    const CurrentPageURL = ShopifyPage.url();
    const customerShopifyID = CurrentPageURL.split('/customers/')[1];
    console.log(customerShopifyID);

    const customerData = {
        customerShopifyID,
        customerFirstName,
        customerLastName,
        customerFullName,
        customerEmail,
        customerPhone,
        customerCompany,
        customerAddress1,
        customerCity,
        customerProvince,
        customerPincode
      };

    await fs.writeFile('../SME_Easy/ShopifyData/customerdata.json', JSON.stringify(customerData, null, 2));
    return customerData;
}
