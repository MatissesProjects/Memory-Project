import { Ollama } from 'ollama';

// We will use a local instance of Ollama to generate embeddings.
// Ensure you have Ollama running locally, e.g., with `ollama serve`.
// You may need to pull an embedding model first: `ollama pull nomic-embed-text`

const ollama = new Ollama({ host: 'http://127.0.0.1:11434' });
const DEFAULT_MODEL = 'nomic-embed-text';

export async function generateEmbedding(text: string, model: string = DEFAULT_MODEL): Promise<number[]> {
  try {
    const response = await ollama.embeddings({
      model: model,
      prompt: text,
    });
    return response.embedding;
  } catch (error) {
    console.error('Failed to generate embedding with Ollama:', error);
    throw error;
  }
}

// Simple cosine similarity for comparing embeddings
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length');
  }
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
