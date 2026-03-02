import Database from 'better-sqlite3';
import path from 'path';

export interface MemoryEntry {
  id?: number;
  type: 'fact' | 'estimation' | 'math' | 'synthesis';
  content: string;
  embedding?: number[]; // Vector embedding represented as array of numbers
  createdAt?: string;
}

export class SQLiteMemoryDB {
  private db: Database.Database;

  constructor(dbPath: string = path.join(process.cwd(), 'memory.db')) {
    this.db = new Database(dbPath, { verbose: console.log });
    this.initSchema();
  }

  private initSchema() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS memories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        content TEXT NOT NULL,
        embedding TEXT, -- stored as JSON array string
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  public insertMemory(memory: MemoryEntry): number | bigint {
    const stmt = this.db.prepare(
      'INSERT INTO memories (type, content, embedding) VALUES (?, ?, ?)'
    );
    const embeddingStr = memory.embedding ? JSON.stringify(memory.embedding) : null;
    const info = stmt.run(memory.type, memory.content, embeddingStr);
    return info.lastInsertRowid;
  }

  public getAllMemories(): MemoryEntry[] {
    const stmt = this.db.prepare('SELECT * FROM memories');
    const rows = stmt.all() as any[];
    return rows.map((row) => ({
      id: row.id,
      type: row.type,
      content: row.content,
      embedding: row.embedding ? JSON.parse(row.embedding) : undefined,
      createdAt: row.created_at,
    }));
  }

  public getMemoriesByType(type: string): MemoryEntry[] {
    const stmt = this.db.prepare('SELECT * FROM memories WHERE type = ?');
    const rows = stmt.all(type) as any[];
    return rows.map((row) => ({
      id: row.id,
      type: row.type,
      content: row.content,
      embedding: row.embedding ? JSON.parse(row.embedding) : undefined,
      createdAt: row.created_at,
    }));
  }
}

export const defaultDB = new SQLiteMemoryDB();
