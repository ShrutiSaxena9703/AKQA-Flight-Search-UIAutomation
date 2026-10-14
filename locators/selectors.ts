import { Page } from '@playwright/test';

export const CommonSelectors = {
  acceptCookiesButton: (page: Page) =>
    page.getByRole('button', { name: 'Accept', exact: true }),
};
export const FlightSearchSelectors = {
  tripTypeDropdown: (page: Page) =>
    page.getByRole('combobox', { name: /^Trip type (Round-trip|One-way)/ }),

  tripTypeOption: (page: Page, type: string) =>
    page.getByText(type, { exact: true }),

  originInput: (page: Page) =>
    page.getByRole('combobox', { name: 'Origin location' }),

  destinationInput: (page: Page) =>
    page.getByRole('combobox', { name: 'Destination location' }),

  removeValueButton: (page: Page) =>
    page.getByRole('button', { name: 'Remove value' }).first(),

  suggestionOption: (page: Page, text: string) =>
    page.getByRole('option', { name: new RegExp(text, 'i') }).first(),

  departureDateButton: (page: Page) =>
    page.getByRole('button', { name: 'Departure date' }),

    searchButton: (page: Page) =>
    page.getByRole('button', { name: 'Search' }),

        searchErrorDialog: (page: Page) =>
    page.getByText(/An error occurred while trying to perform your search/i),

  uniqueAirportsError: (page: Page) =>
    page.getByText(/enter unique .From. and .To. airports/i),
};

export const DatePickerSelectors = {
  dayButton: (page: Page, dateLabel: string) =>
    page.getByRole('button', { name: new RegExp(`^${dateLabel}`) }),
};

export const FlightResultsSelectors = {
  botBlockMessage: (page: Page) =>
    page.getByText(/thinks you are a .bot./i),

  flightResult: (page: Page) =>
    page
      .getByRole('group', { name: /^Result item \d+$/ })
      .getByRole('link', { name: 'Select', exact: true })
      .first(),
};