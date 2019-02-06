import { range, typeOf } from '../index';

test('typOf', () => {
    expect(typeOf('string')).toBe('string');
});

test('range', () => {
    expect(range(0)).toEqual([]);
});
