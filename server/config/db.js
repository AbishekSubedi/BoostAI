const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// SQLite database file path
const dbPath = path.join(dataDir, 'fallback.db');

// Initialize SQLite database
exports.init = () => {
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening SQLite database:', err.message);
      return;
    }
    
    console.log('SQLite database initialized');
    
    // Create necessary tables
    db.serialize(() => {
      // Users table
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);
      
      // Businesses table
      db.run(`CREATE TABLE IF NOT EXISTS businesses (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        name TEXT,
        description TEXT,
        category TEXT,
        location TEXT,
        additional_info TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`);
      
      // Ad responses table
      db.run(`CREATE TABLE IF NOT EXISTS ad_responses (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        business_id TEXT,
        ad_type TEXT,
        description TEXT,
        ad_purpose TEXT,
        target_audience TEXT,
        result TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (business_id) REFERENCES businesses (id)
      )`);
    });
  });
  
  return db;
};

// Get SQLite database instance
exports.getDb = () => {
  return new sqlite3.Database(dbPath);
}; 