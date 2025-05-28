// import {test} from '@playwright/test';

// const {test} = require('@playwright/test');

export async function ShopifyState(browser) {
 const context = await browser.newContext({storageState: 'state.json'});
 const ShopifyPage = await context.newPage();
 return{context,ShopifyPage};
}

export async function SalesforceState(browser){
 const context = await browser.newContext({storageState:'Salesforcestate.json'});
 const SalesforcePage =  await context.newPage();
 return{context,SalesforcePage};    
}