import { test } from '@playwright/test';
import { createShopifyProduct } from '../ShopifyPages/ShopifyProduct';
import { verifySalesforceProductSync } from '../SalesforcePages/SalesforceProduct';

test('Sync product from Shopify to Salesforce', async ({ browser }) => {
  await createShopifyProduct(browser);
  await verifySalesforceProductSync(browser);
});
