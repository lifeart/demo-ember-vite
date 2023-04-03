import type { test, BrowserContext, Browser, Page } from '@playwright/test';

export function captureCoverage(
  testConstructor: typeof test,
  options = {
    reportAnonymousScripts: false,
    resetOnNavigation: false,
  }
) {
  const knownContexts = new WeakSet();
  const knownBrowsers = new WeakSet();
  const knownPages = new WeakSet();
  const pagesWithEnabledCoverage = new WeakSet();

  // console.log('process.env.CI', process.env.CI);

  async function stopCodeCoverage(page: Page) {
    if (!pagesWithEnabledCoverage.has(page)) return;
    console.log('stopCodeCoverage');
    const jsCoverage = await page.coverage.stopJSCoverage();
    console.log(jsCoverage.map((entry) => entry.url));
    pagesWithEnabledCoverage.delete(page);
  }
  async function startCodeCoverage(page: Page) {
    if (pagesWithEnabledCoverage.has(page)) return;
    pagesWithEnabledCoverage.add(page);
    console.log('startCodeCoverage');
    // https://playwright.dev/docs/api/class-coverage#coverage-start-js-coverage-option-reset-on-navigation
    // we assume that we testing our SPA, and there is no needs to reset coverage between page navigations
    await page.coverage.startJSCoverage(options);
  }

  function patchPageClose(page: Page) {
    console.log('patchPageClose');

    if (knownPages.has(page)) return page;
    const originalClose = page.close.bind(page);
    page.close = async function () {
      console.log('page.close');
      await stopCodeCoverage(page);
      return await originalClose();
    };
    knownPages.add(page);
    return page;
  }

  function patchNewPage(context: BrowserContext) {
    console.log('patchNewPage');
    if (knownContexts.has(context)) return;
    const originalCreatePage = context.newPage.bind(context);
    context.newPage = async function () {
      console.log('context.newPage');

      const page = await originalCreatePage();
      knownContexts.add(page.context());
      page.on('load', async () => {
        await startCodeCoverage(page);
        console.log('page.load');
      });
      return patchPageClose(page);
    };
    knownContexts.add(context);
  }

  function patchNewContext(browser: Browser) {
    console.log('patchNewContext');
    if (knownBrowsers.has(browser)) return;
    const originalCreateContext = browser.newContext.bind(browser);
    browser.newContext = async function () {
      console.log('browser.newContext');
      const context = await originalCreateContext();
      patchNewPage(context);
      knownContexts.add(context);
      return context;
    };
    knownBrowsers.add(browser);
  }

  testConstructor.beforeEach(async ({ browser }) => {
    console.log('beforeEach');
    patchNewContext(browser);
    browser.contexts().forEach((context) => {
      patchNewPage(context);
      context.pages().forEach((page) => {
        patchPageClose(page);
      });
    });
  });

  testConstructor.afterEach(async ({ context }) => {
    for (const page of context.pages()) {
      await stopCodeCoverage(page);
    }
  });
}

// things we try to avoid here:
// * side effects in case if coverage is disabled
