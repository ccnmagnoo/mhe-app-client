import { isRol } from './isRol';

test('15062308 must be false', () => {
  expect(isRol('15962308')).toBe(false);
});
test('15.062.308-1 must be true', () => {
  expect(isRol('15.062.308-1')).toBe(true);
});
test('15062308-1 must be true', () => {
  expect(isRol('15062308-1')).toBe(true);
});
test('7276627-K must be true', () => {
  expect(isRol('7276627-K')).toBe(true);
});
test('7276627-0 must be true', () => {
  expect(isRol('7276627-0')).toBe(true);
});
