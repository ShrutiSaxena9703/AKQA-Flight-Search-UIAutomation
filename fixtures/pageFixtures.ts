import { test as base, Page } from '@playwright/test';
import { FlightSearchPage } from '../pages/FlightSearchPage';

type MyFixtures = {
  searchPage: FlightSearchPage;
};

export const test = base.extend<MyFixtures>({
  searchPage: async (
    { page }: { page: Page },
    use: (fixture: FlightSearchPage) => Promise<void>
  ) => {
    await use(new FlightSearchPage(page));
  },
});

export { expect } from '@playwright/test';