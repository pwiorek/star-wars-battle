import { IsInArrayPipe } from './is-in-array.pipe';

describe('IsInArrayPipe', () => {
  const pipe = new IsInArrayPipe();

  it('should find value in array', () => {
    expect(pipe.transform('mass', ['capacity', 'mass', 'height'])).toBeTrue();
  });

  it('should not find value in array', () => {
    expect(pipe.transform('length', ['capacity', 'mass', 'height'])).toBeFalse();
  });
});
