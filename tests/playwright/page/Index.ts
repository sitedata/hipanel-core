import { expect, Page } from "@playwright/test";

export default class Index {
  constructor(private page: Page) {
  }

  async hasAdvancedSearchInputs(names: Array<string>) {
    for (const name of names) {
      await expect(this.page.locator(`div.advanced-search *[name='${name}']`)).toBeVisible();
    }
  }

  async hasBulkButtons(names: Array<string>) {
    for (const name of names) {
      await expect(this.page.locator(`div.box-bulk-actions :has-text("${name}")`).first()).toBeVisible();
    }
  }

  async hasColumns(names: Array<string>) {
    for (const name of names) {
      await expect(this.page.locator(`[role=grid] th:has-text("${name}")`).first()).toBeVisible();
    }
  }

  async hasRowsOnTable(count: number) {
    await expect(this.page.locator('input[name="selection[]"]')).toHaveCount(count);
  }

  async chooseNumberRowOnTable(number: number) {
    await this.page.locator('input[name="selection[]"]').nth(number - 1).highlight();
    await this.page.locator('input[name="selection[]"]').nth(number - 1).click();
  }

  async chooseRangeOfRowsOnTable(start: number, end: number) {
    for (let i = start; i <= end; i++) {
      await this.chooseNumberRowOnTable(i);
    }
  }

  async clickBulkButton(name: string) {
    await this.page.locator(`fieldset button:has-text("${name}")`).click();
  }

  async clickDropdownBulkButton(buttonName: string, selectName: string) {
    await this.page.locator(`fieldset button:has-text("${buttonName}")`).click();
    await this.page.locator(`fieldset a:has-text("${selectName}")`).highlight();
    await this.page.locator(`fieldset a:has-text("${selectName}")`).click();
  }

  async clickColumnOnTable(columnName: string, row: number) {
    const column = await this.getColumnNumberByName(columnName);
    await this.page.locator(`//tr[${row}]//td[${column}]//a`).click();
  }

  async getColumnNumberByName(columnName: string) {
    const allColumns = await this.page.locator('//th[not(./input)]').allInnerTexts();
    return this.getColumnNumber(allColumns, columnName);
  }

  private getColumnNumber(columns: Array<string>, columnName: string){
    let columnNumber = 0;
    columns.forEach((column, index) => {
      if (columnName === column) {
        columnNumber = index + 2;
      }
    });
    if (columnNumber === 0) {
      expect(false, `column by name "${columnName}" does not exist`).toBeTruthy();
    }
    
    return columnNumber;
  }

  private getRowNumber(rows: Array<string>, value: string) {
    let rowNumber = 0;
    rows.forEach((rowValue, index) => {
      if (rowValue === value) {
        rowNumber = index + 1;
      }
    });
    if (rowNumber === 0) {
      expect(false, `column by name "${value}" does not exist`).toBeTruthy();
    }

    return rowNumber;
  }

  async getRowNumberInColumnByValue(columnName: string, value: string) {
    const column = await this.getColumnNumberByName(columnName);
    const allRows = await this.page.locator(`//section[@class='content container-fluid']//tbody//td[${column}]`).allInnerTexts();

    return this.getRowNumber(allRows, value);
  }

  async getValueInColumnByNumberRow(columnName: string, numberRow: number) {
    const column = await this.getColumnNumberByName(columnName);
    let value = await this.page.locator(`//section[@class='content container-fluid']//tbody//tr[${numberRow}]//td[${column}]`).innerText();

    return value.trim();
  }

  async getAuthenticatedUserId() {
    await this.page.goto('/site/healthcheck');

    return await this.page.locator('userid').innerText();
  }
}
