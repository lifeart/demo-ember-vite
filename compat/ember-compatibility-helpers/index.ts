export function gte(value: string) {
  if (value === '3.16.0') {
    return true;
  }
  if (value === '3.10.0') {
    return true;
  }
  if (value === '3.13.0-beta.1') {
    return true;
  }
  if (value === '3.20.0-beta.4') {
    return true;
  }
  if (value === '3.22.0-beta') {
    return true;
  }
  console.info('gte', value, new Error().stack);
  return true;
}
