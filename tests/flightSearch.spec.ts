   import { test, expect } from '../fixtures/pageFixtures';
   import { CommonSelectors } from '../locators/selectors';
   import routes from '../test-data/routes.json';

test.beforeEach(async ({ searchPage }) => {
  await test.step('Given the user is on the flight search page', async () => {
    await searchPage.openFlightsPage();
    await searchPage.verifyPageIsLoaded();
  });
});

test.afterEach(async ({ page }, testInfo) => {
  const openTabs = page.context().pages();
  const currentTab = openTabs[openTabs.length - 1];

  const status = testInfo.status === testInfo.expectedStatus ? 'PASSED' : 'FAILED';
  const safeTitle = testInfo.title.replace(/[^a-zA-Z0-9]+/g, '-').slice(0, 60);
  const filePath = `reports/screenshots/${status}-${safeTitle}.png`;
  await currentTab.waitForLoadState('networkidle', { timeout: 5_000 }).catch(() => {});
  const image = await currentTab.screenshot({ path: filePath, fullPage: false });
  await testInfo.attach(`${status} - final state`, { body: image, contentType: 'image/png' });
});

for (const route of routes) {
  const routeName = `${route.originCode} to ${route.destinationCode}`;

test(`TC01 user searches one-way ${routeName} for today and sees the route and date`, async ({ searchPage }) => {
    const resultsPage = await test.step(`When the user searches a one-way flight ${routeName} for today`, async () => {
      await searchPage.selectTripType('One-way');
      await searchPage.selectOrigin(route.originCode, route.originCity);
      await searchPage.selectDestination(route.destinationCode, route.destinationCity);
      await searchPage.selectDepartureDate(0);
      return await searchPage.search();
    });

    await test.step(`Then the results show the route ${routeName}`, async () => {
      await resultsPage.verifyRouteIsShown(
        route.originCode, route.originCity,
        route.destinationCode, route.destinationCity
      );
    });

    await test.step('And the results show today\'s date', async () => {
      await resultsPage.verifyDateIsShown(0);
    });

    await test.step('And the search was sent for the correct route and date', async () => {
      await resultsPage.verifySearchRequest(route.originCode, route.destinationCode, 0);
    });
        await test.step('And flight results are listed', async () => {
      await resultsPage.verifyFlightsAreListed();
    });
  });

  test(`TC02 user searches one-way ${routeName} for tomorrow and sees the route and date`, async ({ searchPage }) => {
    const resultsPage = await test.step(`When the user searches a one-way flight ${routeName} for tomorrow`, async () => {
      await searchPage.selectTripType('One-way');
      await searchPage.selectOrigin(route.originCode, route.originCity);
      await searchPage.selectDestination(route.destinationCode, route.destinationCity);
      await searchPage.selectDepartureDate(1);
      return await searchPage.search();
    });

    await test.step(`Then the results show the route ${routeName}`, async () => {
      await resultsPage.verifyRouteIsShown(
        route.originCode, route.originCity,
        route.destinationCode, route.destinationCity
      );
    });

    await test.step('And the results show tomorrow\'s date', async () => {
      await resultsPage.verifyDateIsShown(1);
    });

    await test.step('And the search was sent for the correct route and date', async () => {
      await resultsPage.verifySearchRequest(route.originCode, route.destinationCode, 1);
    });
        await test.step('And flight results are listed', async () => {
      await resultsPage.verifyFlightsAreListed();
    });
  });

  test(`TC03 user cannot select a past departure date for ${routeName}`, async ({ searchPage }) => {
    await test.step(`When the user selects the route ${routeName} and opens the calendar`, async () => {
      await searchPage.selectOrigin(route.originCode, route.originCity);
      await searchPage.selectDestination(route.destinationCode, route.destinationCity);
      await searchPage.openDepartureCalendar();
    });

    await test.step('Then yesterday is shown as disabled', async () => {
      await searchPage.verifyDateIsDisabled(-1);
    });

    await test.step('When the user tries to select yesterday', async () => {
      await searchPage.tryToSelectDate(-1);
    });

    await test.step('Then yesterday is not set as the departure date', async () => {
      await searchPage.verifyDateIsNotSelected(-1);
    });
  });

  test(`TC04 user cannot search with ${route.originCode} as both origin and destination`, async ({ searchPage }) => {
    await test.step(`When the user searches a one-way flight from ${route.originCity} to ${route.originCity} for tomorrow`, async () => {
      await searchPage.selectTripType('One-way');
      await searchPage.selectOrigin(route.originCode, route.originCity);
      await searchPage.selectDestination(route.originCode, route.originCity);
      await searchPage.selectDepartureDate(1);
      await searchPage.clickSearch();
    });

    await test.step('Then an error says the airports must be different', async () => {
      await searchPage.verifySameAirportErrorIsShown();
    });

    await test.step('And the user stays on the search page', async () => {
      await searchPage.verifyStillOnSearchPage();
    });
  });
}