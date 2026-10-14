import { Page } from '@playwright/test';
import { CommonSelectors, DatePickerSelectors } from '../locators/selectors';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open(path: string) {
    await this.page.goto(path);
    await this.acceptCookies();
  }

  async acceptCookies() {
    const acceptButton = CommonSelectors.acceptCookiesButton(this.page);
    try {
      await acceptButton.waitFor({ state: 'visible', timeout: 2_000 });
      await acceptButton.click();
    } catch {
      // Banner not shown: nothing to accept, continue the test
    }
  }

  getDate(daysFromToday: number, timeZone: string = 'Asia/Kolkata'): Date {
    const nowInZone = new Date(new Date().toLocaleString('en-US', { timeZone }));
    nowInZone.setDate(nowInZone.getDate() + daysFromToday);
    return nowInZone;
  }

  formatDateLabel(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

    formatIsoDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
    formatShortDate(date: Date): string {
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
    return `${weekday} ${date.getMonth() + 1}/${date.getDate()}`;
  }

  async selectDate(daysFromToday: number): Promise<string> {
    const dateLabel = this.formatDateLabel(this.getDate(daysFromToday));
     console.log(`Selecting departure date: ${dateLabel}`);
    await DatePickerSelectors.dayButton(this.page, dateLabel).click();
    return dateLabel;
  }
    dayButton(daysFromToday: number) {
    const dateLabel = this.formatDateLabel(this.getDate(daysFromToday));
    return DatePickerSelectors.dayButton(this.page, dateLabel);
  }
}