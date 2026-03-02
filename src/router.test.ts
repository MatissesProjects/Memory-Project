import { categorizeQuery } from './router';

describe('categorizeQuery', () => {
  it('should categorize math queries correctly', () => {
    expect(categorizeQuery('What is 5 plus 5?')).toBe('math');
    expect(categorizeQuery('10 / 2')).toBe('math');
  });

  it('should categorize estimation queries correctly', () => {
    expect(categorizeQuery('about how many people live in paris?')).toBe('estimation');
    expect(categorizeQuery('estimate the time to travel to mars')).toBe('estimation');
  });

  it('should categorize synthesis queries correctly', () => {
    expect(categorizeQuery('summarize the key points of the article')).toBe('synthesis');
    expect(categorizeQuery('what is the difference between cats and dogs')).toBe('synthesis');
  });

  it('should default to fact for general lookups', () => {
    expect(categorizeQuery('what is the capital of France?')).toBe('fact');
    expect(categorizeQuery('who wrote the great gatsby?')).toBe('fact');
  });
});
