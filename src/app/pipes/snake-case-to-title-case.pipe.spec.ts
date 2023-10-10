import { SnakeCaseToTitleCasePipe } from './snake-case-to-title-case.pipe';

describe('SnakeCaseToTitleCasePipe', () => {
  const pipe = new SnakeCaseToTitleCasePipe();

  it('should map snake case to title case', () => {
    expect(pipe.transform('long_snake_case_it_is')).toBe('Long Snake Case It Is');
  });

  it('should map snake case to title case', () => {
    expect(pipe.transform('testTEXT')).toBe('TestTEXT');
  });

  it('should not map null', () => {
    expect(pipe.transform(null!)).toBeNull()
  });
});
