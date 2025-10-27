// Simple database abstraction for demo
// In production, use proper database client (pg, Prisma, etc.)

interface MockDbQueryResult {
  rows: any[];
  rowCount?: number;
}

class MockDatabase {
  private data: Map<string, any[]> = new Map();

  async connect() {
    return this;
  }

  async query(sql: string, params?: any[]): Promise<MockDbQueryResult> {
    // Mock implementation - returns empty result
    console.log('Mock DB Query:', sql, params);
    return { rows: [], rowCount: 0 };
  }

  async release() {
    // Mock implementation
  }
}

export const db = new MockDatabase();

