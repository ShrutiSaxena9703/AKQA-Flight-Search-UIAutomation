import { Locator, expect, test } from '@playwright/test';
import { BasePage } from './BasePage';
import { CommonSelectors, FlightSearchSelectors, FlightResultsSelectors } from '../locators/selectors';
import { FlightResultsPage } from './FlightResultsPage';


export class FlightSearchPage extends BasePage {
  readonly path = '/';

  async openFlightsPage() {
    await this.open(this.path);
  }
    async verifyPageIsLoaded() {
    await expect(this.page).toHaveURL(this.path);
    await expect(CommonSelectors.acceptCookiesButton(this.page)).toBeHidden();
  }

  async selectTripType(type: string) {
    await FlightSearchSelectors.tripTypeDropdown(this.page).click();
    await FlightSearchSelectors.tripTypeOption(this.page, type).click();
  }

    async openDepartureCalendar() {
    await FlightSearchSelectors.departureDateButton(this.page).click();
  }

  async selectDepartureDate(daysFromToday: number): Promise<string> {
    await this.openDepartureCalendar();
    return this.selectDate(daysFromToday);
  }
   async search(): Promise<FlightResultsPage> {
    const searchPageUrl = this.page.url();
    await this.clickSearch();
    await this.page.waitForURL((url) => url.toString() !== searchPageUrl);
    await this.page.waitForLoadState('domcontentloaded');

    const blocked = await FlightResultsSelectors.botBlockMessage(this.page).isVisible();
    test.skip(blocked, 'Results blocked by Agoda bot protection');

    console.log(`Results page opened: ${this.page.url()}`);
    return new FlightResultsPage(this.page);
  }

  async selectOrigin(code: string, city: string) {
     console.log(`Selecting origin: ${code} (${city})`);
    await this.clearPrefilledOrigin();
    await this.typeAndSelect(FlightSearchSelectors.originInput(this.page), code, city);
  }

  async selectDestination(code: string, city: string) {
    console.log(`Selecting destination: ${code} (${city})`);
    await this.typeAndSelect(FlightSearchSelectors.destinationInput(this.page), code, city);
  }

  private async clearPrefilledOrigin() {
    const removeButton = FlightSearchSelectors.removeValueButton(this.page);
    try {
      await removeButton.waitFor({ state: 'visible', timeout: 3_000 });
      await removeButton.click();
    } catch {
      
    }
  }

  private async typeAndSelect(field: Locator, code: string, city: string) {
    await field.click();
    await field.pressSequentially(code, { delay: 100 });
    await FlightSearchSelectors.suggestionOption(this.page, city).click();
  }

    async clickSearch() {
    await FlightSearchSelectors.searchButton(this.page).click();
  }

   async verifySameAirportErrorIsShown() {
    await expect(FlightSearchSelectors.searchErrorDialog(this.page)).toBeVisible();
    await expect(FlightSearchSelectors.uniqueAirportsError(this.page)).toBeVisible();
  }

  async verifyStillOnSearchPage() {
    await expect(this.page).toHaveURL(this.path);
  }

   async verifyDateIsDisabled(daysFromToday: number) {
    await expect(this.dayButton(daysFromToday)).toBeDisabled();
  }

  async verifyDateIsEnabled(daysFromToday: number) {
    await expect(this.dayButton(daysFromToday)).toBeEnabled();
  }

    async tryToSelectDate(daysFromToday: number) {
    await this.dayButton(daysFromToday).click({ force: true });
  }

  async verifyDateIsNotSelected(daysFromToday: number) {
    const dateText = this.formatShortDate(this.getDate(daysFromToday));
    await expect(FlightSearchSelectors.departureDateButton(this.page)).not.toContainText(dateText);
  }
}
