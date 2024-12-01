import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import path from 'path';

const dir_path = './test_data';
var json_arr = <any>[];

try {
  let files = fs.readdirSync(dir_path, { withFileTypes: true });
  files.forEach(file => {
    let file_path = path.join(dir_path, file.name);
    let content = fs.readFileSync(file_path, 'utf-8');
    let json = JSON.parse(content);
    json_arr.push(json);
  });
} catch (err) {
  if (err instanceof Error) console.log(err.message);
}

json_arr.forEach(({ test_case, plan_page, task_name, column_name, fields }) => {
  test(`${test_case}`, async ({ page }) => {
    await page.goto(plan_page);
    let column = page.locator(`h3:text("${column_name}")`).locator(`../..`);
    let task = column.locator(`span:text-is("${task_name}"):below(h3:text("${column_name}"))`);
    await task.click();
    var fields_locator = page.locator(`div:right-of(span:has-text("Fields"))`).first();
    await Promise.all(fields.map(async (element) => {
      var priority = fields_locator.locator(page.getByText(element.name, { exact: true })).locator(`../../../../div[2]`).locator(`//span`);
      await expect(priority).toHaveText(element.value);
    }));
  });
});