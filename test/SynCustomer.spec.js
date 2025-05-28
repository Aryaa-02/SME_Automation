import { test } from '@playwright/test';
import { createShopifyCustomer } from '../ShopifyPages/ShopifyCustomer.js';
import { verifySalesforceCustomerSync } from '../SalesforcePages/SalesforceCustomer.js';

test('Shopify to Salesforce Customer Sync End-to-End Test', async ({ browser }) => {
  await createShopifyCustomer(browser);
  await verifySalesforceCustomerSync(browser);
});
