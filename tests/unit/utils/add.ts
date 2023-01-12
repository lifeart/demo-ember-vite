import { module, test } from 'qunit';

function add(a: number, b: number) {
    return a + b;
  }

module('Unit | Utility | add', function () {
  test('it works', function (assert) {
    let result = add(3, 2);
    assert.equal(result, 5);
  });
});