// Simple cache implementation
// In production, use Redis or similar

const cache = new Map<string, { value: any; expiry: number }>();

export async function cacheGet(key: string) {
  const entry = cache.get(key);
  
  if (!entry) return null;
  
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }
  
  return entry.value;
}

export async function cacheSet(key: string, value: any, ttlSeconds: number) {
  const expiry = Date.now() + (ttlSeconds * 1000);
  cache.set(key, { value, expiry });
}

