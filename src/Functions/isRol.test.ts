import { isRol } from './isRol';

test('15062308 must be false', () => {
  expect(isRol('15962308')).toStrictEqual({ check: false, rol: undefined });
});
test('15.062.308-1 must be true', () => {
  expect(isRol('15.062.308-1')).toStrictEqual({ check: true, rol: '15062308-1' });
});
test('15062308-1 must be true', () => {
  expect(isRol('15062308-1')).toStrictEqual({ check: true, rol: '15062308-1' });
});
test('7276627-K must be true', () => {
  expect(isRol('7276627-K')).toStrictEqual({ check: true, rol: '7276627-K' });
});
test('7276627-0 must be true', () => {
  expect(isRol('7276627-0')).toStrictEqual({ check: true, rol: '7276627-K' });
});
