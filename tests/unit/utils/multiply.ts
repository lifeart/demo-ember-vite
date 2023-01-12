import { module, test } from 'qunit';

function multiply(a: number, b: number) {
    return a * b;
  }

module('Unit | Utility | multiply', function () {
  test('it works', function (assert) {
    let result = multiply(3, 2);
    assert.equal(result, 6);
  });
});