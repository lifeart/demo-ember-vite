import { module, test } from 'qunit';

function multiply(a: number, b: number) {
  return a * b;
}

module('Unit | Utility | multiply', function () {
  test('it works', function (assert) {
    const result = multiply(3, 2);
    assert.strictEqual(result, 6);
  });
});
