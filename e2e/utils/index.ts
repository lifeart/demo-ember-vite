import v8toIstanbul from 'v8-to-istanbul';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { test, BrowserContext, Browser, Page } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '../..');
const coverageResultsTempDir = path.join(ROOT, '.nyc_output');

function shouldCaptureCoverageForFile(url: string) {
  return url.includes('/src/');
}
function filePathFromUrl(url: string) {
  //  handle cases like http://Users/components/HelloWorld/sample.gts?import

  return path.join(
    ROOT,
    'src',
    (url.split('/src/')[1] as string).split('?')[0] as string
  );
}

function UUID() {
  return crypto.randomBytes(16).toString('hex');
}

function saveCoverage(result: string) {
  if (!fs.existsSync(coverageResultsTempDir)) {
    fs.mkdirSync(coverageResultsTempDir);
  }
  fs.writeFileSync(
    path.join(coverageResultsTempDir, `playwright-${UUID()}-coverage.json`),
    result
  );
}

const knownContexts = new WeakSet();
const knownBrowsers = new WeakSet();
const knownPages = new WeakSet();
const pagesWithEnabledCoverage = new WeakSet();

export function captureCoverage(
  testConstructor: typeof test,
  options = {
    reportAnonymousScripts: false,
    resetOnNavigation: false,
  }
) {
  // console.log('process.env.CI', process.env.CI);

  async function stopCodeCoverage(page: Page) {
    if (!pagesWithEnabledCoverage.has(page)) return;
    const jsCoverage = await page.coverage.stopJSCoverage();
    for (const entry of jsCoverage) {
      try {
        const source = entry.source;
        if (!source) {
          continue;
        }
        if (!shouldCaptureCoverageForFile(entry.url)) {
          continue;
        }
        const fName = filePathFromUrl(entry.url);
        // here we need to replace sourceMappingURL with new one if needed
        // const source = entry.source?.replace('sourceMappingURL=', `sourceMappingURL=${newRef}/`);
        const converter = v8toIstanbul(fName, 0, {
          source,
        });
        await converter.load();
        converter.applyCoverage(entry.functions);
        const result = converter.toIstanbul();
        const keys = Object.keys(result);
        if (keys.length) {
          saveCoverage(JSON.stringify(result));
        }
      } catch (e) {
        console.error(
          `Unable to process coverage for ${entry.scriptId}:${entry.url}`
        );
      }
    }

    pagesWithEnabledCoverage.delete(page);
  }
  async function startCodeCoverage(page: Page) {
    if (pagesWithEnabledCoverage.has(page)) return;
    pagesWithEnabledCoverage.add(page);
    // https://playwright.dev/docs/api/class-coverage#coverage-start-js-coverage-option-reset-on-navigation
    // we assume that we testing our SPA, and there is no needs to reset coverage between page navigations
    await page.coverage.startJSCoverage(options);
  }

  function patchPageClose(page: Page) {
    if (knownPages.has(page)) return page;
    const originalClose = page.close.bind(page);
    page.close = async function () {
      await stopCodeCoverage(page);
      return await originalClose();
    };
    knownPages.add(page);
    return page;
  }

  function patchNewPage(context: BrowserContext) {
    if (knownContexts.has(context)) return;
    const originalCreatePage = context.newPage.bind(context);
    context.newPage = async function () {
      const page = await originalCreatePage();
      knownContexts.add(page.context());
      page.on('load', async () => {
        await startCodeCoverage(page);
      });
      return patchPageClose(page);
    };
    knownContexts.add(context);
  }

  function patchNewContext(browser: Browser) {
    if (knownBrowsers.has(browser)) return;
    const originalCreateContext = browser.newContext.bind(browser);
    browser.newContext = async function () {
      const context = await originalCreateContext();
      patchNewPage(context);
      knownContexts.add(context);
      return context;
    };
    knownBrowsers.add(browser);
  }

  testConstructor.beforeEach(async ({ browser }) => {
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
