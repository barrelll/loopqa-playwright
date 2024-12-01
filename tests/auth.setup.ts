import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');
var username = "ben+pose@workwithloop.com";
var password = "Password123";
var login_page = "https://app.asana.com/-/login";
var home_page = "https://app.asana.com/0/home/1205366998147150";

setup('authenticate', async ({ page }, testInfo) => {
    if (testInfo.repeatEachIndex > 0) setup.skip();
    await page.goto(login_page);
    await page.getByRole("textbox", { name: 'e' }).fill(username);
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.getByRole("textbox", { name: 'p' }).fill(password);
    await page.getByRole('button', { name: 'Log in', exact: true }).click();
    await page.waitForURL(home_page, { waitUntil: 'load' });

    await page.context().storageState({ path: authFile });
});