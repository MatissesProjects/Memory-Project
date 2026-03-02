// A simple categorizer for queries to determine the type of memory recall needed.

export type MemoryCategory = 'fact' | 'estimation' | 'math' | 'synthesis';

export function categorizeQuery(query: string): MemoryCategory {
  const lowerQuery = query.toLowerCase();

  // Basic math indicators
  if (
    lowerQuery.includes('plus') ||
    lowerQuery.includes('minus') ||
    lowerQuery.includes('times') ||
    lowerQuery.includes('divided by') ||
    lowerQuery.match(/\d+\s*[\+\-\*\/]\s*\d+/)
  ) {
    return 'math';
  }

  // Estimation indicators
  if (
    lowerQuery.includes('about how many') ||
    lowerQuery.includes('estimate') ||
    lowerQuery.includes('roughly') ||
    lowerQuery.includes('approximately') ||
    lowerQuery.includes('how long would it take')
  ) {
    return 'estimation';
  }

  // Synthesis indicators
  if (
    lowerQuery.includes('summarize') ||
    lowerQuery.includes('compare') ||
    lowerQuery.includes('difference between') ||
    lowerQuery.includes('how do these relate') ||
    lowerQuery.includes('synthesis') ||
    lowerQuery.includes('overall')
  ) {
    return 'synthesis';
  }

  // Default to fact for specific lookups
  return 'fact';
}
