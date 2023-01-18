export function gte(value: string) {
  if (value === '3.16.0') {
    return true;
  }
  if (value === '3.10.0') {
    return true;
  }
  console.info('gte', value, new Error().stack);
  return true;
}
