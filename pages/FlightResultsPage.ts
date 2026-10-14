import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { FlightSearchSelectors, FlightResultsSelectors } from '../locators/selectors';

export class FlightResultsPage extends BasePage {
    async verifyRouteIsShown(
    originCode: string, originCity: string,
    destinationCode: string, destinationCity: string
  ) {
    await expect(FlightSearchSelectors.originInput(this.page))
      .toHaveAttribute('data-test-origin', originCode);
    await expect(FlightSearchSelectors.destinationInput(this.page))
      .toHaveAttribute('data-test-destination', destinationCode);

    await expect(this.page.getByText(new RegExp(originCity, 'i')).first()).toBeVisible();
    await expect(this.page.getByText(new RegExp(destinationCity, 'i')).first()).toBeVisible();
  }

  async verifyDateIsShown(daysFromToday: number) {
    const expectedDate = this.formatShortDate(this.getDate(daysFromToday));
    await expect(this.page.getByText(expectedDate).first()).toBeVisible();
  }

  async verifySearchRequest(originCode: string, destinationCode: string, daysFromToday: number) {
    const isoDate = this.formatIsoDate(this.getDate(daysFromToday));
    await expect(this.page).toHaveURL(new RegExp(`${originCode}.*${destinationCode}.*${isoDate}`, 'i'));
  }

    async verifyFlightsAreListed() {
    await expect(FlightResultsSelectors.flightResult(this.page)).toBeVisible({ timeout: 15_000 });
  }
}