import { defaultDB, MemoryEntry } from './db/sqlite';
import { defaultCache } from './cache/fastCache';
import { categorizeQuery } from './router';
import { generateEmbedding, cosineSimilarity } from './embeddings/ollama';

// OpenClaw AgentSkill Interface Mock
// In a real OpenClaw skill, this would match their specific SDK types.
export interface AgentSkill {
  name: string;
  description: string;
  execute: (input: string) => Promise<string>;
}

export class HierarchicalMemorySkill implements AgentSkill {
  name = 'hierarchical_memory';
  description = 'A hierarchical memory system that stores and retrieves facts, estimations, math, and syntheses.';

  async execute(input: string): Promise<string> {
    try {
      // 1. Check Fast Cache for exact query match
      const cachedResult = defaultCache.get(input);
      if (cachedResult) {
        return `[Cache Hit] ${cachedResult}`;
      }

      // 2. Determine Data Type
      const category = categorizeQuery(input);

      // If it's a store command (naive check for prototype)
      if (input.toLowerCase().startsWith('remember:') || input.toLowerCase().startsWith('store:')) {
        const content = input.split(':').slice(1).join(':').trim();
        const embedding = await generateEmbedding(content);
        
        defaultDB.insertMemory({
          type: category,
          content: content,
          embedding: embedding
        });
        
        return `Stored as ${category} memory successfully.`;
      }

      // 3. Retrieval Logic
      // Generate embedding for the query
      const queryEmbedding = await generateEmbedding(input);
      
      // Fetch memories of the appropriate category
      const memories = defaultDB.getMemoriesByType(category);
      
      if (memories.length === 0) {
        return `No relevant ${category} memory found.`;
      }

      // Find the most similar memory
      let bestMatch: MemoryEntry | null = null;
      let highestSimilarity = -1;

      for (const memory of memories) {
        if (memory.embedding) {
          const sim = cosineSimilarity(queryEmbedding, memory.embedding);
          if (sim > highestSimilarity) {
            highestSimilarity = sim;
            bestMatch = memory;
          }
        }
      }

      // Threshold for relevance
      if (bestMatch && highestSimilarity > 0.6) {
        // Cache the result for future identical queries
        defaultCache.set(input, bestMatch.content);
        return `[Retrieved ${category}] ${bestMatch.content} (Confidence: ${(highestSimilarity * 100).toFixed(1)}%)`;
      }

      return `No highly relevant ${category} memory found.`;

    } catch (error) {
      console.error('Error in HierarchicalMemorySkill:', error);
      return 'Failed to execute memory operation.';
    }
  }
}

// Export a default instance for OpenClaw to consume
const memorySkill = new HierarchicalMemorySkill();
export default memorySkill;
