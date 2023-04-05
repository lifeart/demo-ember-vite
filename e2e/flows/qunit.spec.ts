import { test, expect } from '@playwright/test';

import { captureCoverage } from './../utils/index.ts';

captureCoverage(test);

type QUnitTestResults = {
  failed: number;
  passed: number;
  runtime: number;
  total: number;
};

type QUnitTestDone = {
  name: string;
  module: string;
  skipped: boolean;
  todo: boolean;
  failed: number;
  passed: number;
  total: number;
  runtime: number;
  assertions: { result: boolean; message?: string }[];
  testId: string;
  // generating stack trace is expensive, so using a getter will help defer this until we need it
  source: string;
};

test('QUnit', async ({ page }) => {
  const maxQunitTestTime = 1000 * 60 * 5;

  test.setTimeout(maxQunitTestTime);

  let resolveTestResults: (value: unknown) => void;
  const testDonePromise = new Promise((resolve) => {
    resolveTestResults = resolve;
  });
  const testsDoneResults: QUnitTestDone[] = [];

  page.addInitScript(() => {
    let qunit = null;
    Object.defineProperty(window, 'QUnit', {
      get() {
        return qunit;
      },
      set(value) {
        if (qunit !== null) {
          throw new Error('QUnit is already defined');
        }
        qunit = value;

        value.done(function (results) {
          window['onQunitDone'](results);
        });
        value.testDone(function (results) {
          window['onQunitTestDone'](results);
        });
      },
    });
  });

  await Promise.all([
    page.exposeBinding(
      'onQunitDone',
      (_, values: QUnitTestResults) => {
        resolveTestResults(values);
      },
      { handle: false }
    ),
    page.exposeBinding(
      'onQunitTestDone',
      (_, values: QUnitTestDone) => {
        testsDoneResults.push(values);
      },
      { handle: false }
    ),
  ]);

  await page.goto('http://localhost:4200/tests/', {
    waitUntil: 'domcontentloaded',
  });

  const testResults: QUnitTestResults =
    await (testDonePromise as Promise<QUnitTestResults>);

  const failedTests = testsDoneResults.filter((tInfo) => tInfo.failed > 0);

  failedTests.forEach((tInfo) => {
    expect(() => {
      const error = new Error(`${tInfo.module} | ${tInfo.name}`);
      error.stack = tInfo.source;
      error.message =
        tInfo.assertions.find((a) => !a.result)?.message ?? tInfo.source;
      throw error;
    }, `${tInfo.module} >> ${tInfo.name}`).not.toThrowError();
  });

  testsDoneResults.forEach((tInfo) => {
    test.info().annotations.push({
      type: 'test',
      description: `${tInfo.module} >> ${tInfo.name}`,
    });
  });

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
  });

  await test
    .info()
    .attach('qUnit report', { body: pdf, contentType: 'application/pdf' });

  await expect(testResults.failed, 'No failed tests').toBe(0);
  await expect(testResults.passed, 'All tests passed').toBe(testResults.passed);
});
