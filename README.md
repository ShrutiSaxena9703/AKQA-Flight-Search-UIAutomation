# AKQA – Flight Search Automation
Test automation for the AKQA technical challenge (part 2, Case 1).

Requirement from the PO: users should be able to get the flights for a given route on a given date. I automated this on Agoda's flight search using Playwright with TypeScript.

## Used Agoda

The assignment allows Booking or Agoda, so I used https://flights.agoda.com. 

## How to run

You need Node.js 18 or newer.

npm install
npx playwright install
npm test

Other commands:

npm run test:headed            # run with the browser visible
npx playwright test -g "TC02"  # run one test
npm run report                 # open the HTML report

## Tests

ID | What it checks

TC01 | One-way search DEL to BOM for today. Results page shows the route and today's date, URL contains route + date, flights are listed.
TC02 | Same as TC01 but for tomorrow.
TC03 | past date is disabled in the calendar and can't be picked as departure date.
TC04 | Same airport as origin and destination: search is blocked with the "Please enter unique 'From' and 'To' airports" error.

TC01 and TC02 are what the assignment asked for. TC03 and TC04 are negative tests I added. The IDs are the same as in my Google Sheet.

## Project structure

fixtures/pageFixtures.ts    fixture that gives the tests the page objects
locators/selectors.ts       all locators in one file, grouped per page
pages/BasePage.ts           common stuff: open page, cookies, date helper, date picker
pages/FlightSearchPage.ts   search form actions and checks
pages/FlightResultsPage.ts  results page checks
test-data/routes.json       dynamic value of routes to test
tests/flightSearch.spec.ts  the test cases
sample-run/                 report and screenshots from a passing run

Reports go to `reports/` (not committed): `html-report/`, `screenshots/` with a screenshot of the end state of every test, and `test-results/` with traces when something fails.

## Some decisions

- Page Object Model, with locators kept separately in 'selectors.ts' so a UI change is a one-line fix. I used playwright imnternal locators where possible instead of CSS or XPath.
- Routes come from 'routes.json'. Adding a route there creates the tests for it, no code change needed.
- No hardcoded dates. Tests say 0 for today or 1 for tomorrow and the date is calculated when the test runs.
- The date is calculated in Indian time. I found out Agoda's calendar uses the date at the departure airport.
- Tests are written as Given / When / Then steps ('test.step'), so the HTML report is readable without looking at the code.
- Every test gets a fresh browser and starts on the search page ('beforeEach'), so tests don't depend on each other.
- In TC04 everything else is valid (one-way, valid date), so the only thing wrong is the duplicate airport. Otherwise Agoda shows three errors at once and the test doesn't prove much.

## Known issues

- Agoda sometimes shows a "we think you are a bot" page after many runs in a short time. When that happens the test is skipped with a message instead of failing. In a real project I'd run this against a test environment where automation is allowed.
- Timezone is set to India, which is fine for routes from India. Other departure countries would need their own timezone.
- TC01 can fail late in the evening (India time) if there are no flights left that day.
- TC03 might not work on the 1st of a month, because yesterday is then in the previous month's calendar.

  ## Sample run

  'reports/screenshots' has the end-state screenshot of each test from a passing run. The full HTML report is in 'reports/html-report/index.html' (download the repo and open it in a browser).