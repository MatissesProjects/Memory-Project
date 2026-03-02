// Fast in-memory cache for expected data (e.g., frequently accessed facts or recent calculations)
export class FastCache {
  private cache: Map<string, { data: any; expiry: number }>;
  private ttl: number;

  constructor(ttlInSeconds: number = 300) {
    this.cache = new Map();
    this.ttl = ttlInSeconds * 1000;
  }

  public set(key: string, data: any) {
    const expiry = Date.now() + this.ttl;
    this.cache.set(key, { data, expiry });
  }

  public get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  public clear() {
    this.cache.clear();
  }
}

export const defaultCache = new FastCache();
