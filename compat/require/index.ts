function require(id: string): void {
  console.log('require', id);
  return;
}

export function has(id: string): boolean {
  // @ember+test-helpers+2.9.3.patch
  if (id === 'ember-data/setup-container') {
    return false;
  }
  console.log('require.has', id);
  return false;
}

require.has = has;

export default require;
