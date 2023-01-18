import { module, test } from 'qunit';

function add(a: number, b: number) {
  return a + b;
}

module('Unit | Utility | add', function () {
  test('it works', function (assert) {
    const result = add(3, 2);
    assert.strictEqual(result, 5);
  });
});
