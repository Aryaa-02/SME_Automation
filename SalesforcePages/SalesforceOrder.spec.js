import {test,expect} from '@playwright/test';
import {SalesforceCreds} from '../Pages/SMEData';
import { SalesforceState } from '../Pages/Storage';

test('Salesforce Order Verfication', async({browser}) => {
const {SalesforcePage} = await SalesforceState(browser);
await SalesforcePage.goto(SalesforceCreds.url);
await SalesforcePage.locator("input[name='username']").fill(SalesforceCreds.username);
await SalesforcePage.locator("input[name='pw']").fill(SalesforceCreds.password);
await SalesforcePage.locator("input[name='Login']").click();
await SalesforcePage.locator('button[title="App Launcher"]').click();
const AppLauncher = await SalesforcePage.locator(".slds-size_medium")
await AppLauncher.locator(".slds-input").fill("HIC Sync Made easy");
await AppLauncher.locator(".slds-size_small").click();
await SalesforcePage.waitForLoadState("load");
await SalesforcePage.locator('button[aria-label= "Search"]').click();
});