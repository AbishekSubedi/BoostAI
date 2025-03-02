const sqlite3 = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure the data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Connect to SQLite database
const dbPath = path.join(dataDir, 'business.db');
const db = sqlite3(dbPath);

// Initialize database with tables
const initDatabase = () => {
  // Create businesses table
  db.exec(`
    CREATE TABLE IF NOT EXISTS businesses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      location TEXT NOT NULL,
      contact_number TEXT NOT NULL,
      additional_info TEXT,
      target_audience TEXT,
      years_in_business INTEGER,
      employee_count INTEGER,
      website TEXT,
      social_media_facebook TEXT,
      social_media_instagram TEXT,
      social_media_twitter TEXT,
      social_media_linkedin TEXT,
      enhanced_description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create strengths table
  db.exec(`
    CREATE TABLE IF NOT EXISTS strengths (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business_id INTEGER NOT NULL,
      strength TEXT NOT NULL,
      FOREIGN KEY (business_id) REFERENCES businesses (id) ON DELETE CASCADE
    )
  `);

  // Create target segments table
  db.exec(`
    CREATE TABLE IF NOT EXISTS target_segments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business_id INTEGER NOT NULL,
      segment TEXT NOT NULL,
      FOREIGN KEY (business_id) REFERENCES businesses (id) ON DELETE CASCADE
    )
  `);

  // Create marketing suggestions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS marketing_suggestions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business_id INTEGER NOT NULL,
      suggestion TEXT NOT NULL,
      FOREIGN KEY (business_id) REFERENCES businesses (id) ON DELETE CASCADE
    )
  `);

  console.log('SQLite database initialized');
};

// Initialize the database
initDatabase();

// Business CRUD operations
const businessService = {
  // Create a new business
  createBusiness: (businessData) => {
    try {
      // Start a transaction
      const transaction = db.transaction(() => {
        // Insert business data
        const insertBusiness = db.prepare(`
          INSERT INTO businesses (
            user_id, name, category, description, location, contact_number,
            additional_info, target_audience, years_in_business, employee_count,
            website, social_media_facebook, social_media_instagram,
            social_media_twitter, social_media_linkedin, enhanced_description
          ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
          )
        `);

        const result = insertBusiness.run(
          businessData.user,
          businessData.name,
          businessData.category,
          businessData.description,
          businessData.location,
          businessData.contactNumber,
          businessData.additionalInfo || null,
          businessData.targetAudience || null,
          businessData.yearsInBusiness || null,
          businessData.employeeCount || null,
          businessData.website || null,
          businessData.socialMedia?.facebook || null,
          businessData.socialMedia?.instagram || null,
          businessData.socialMedia?.twitter || null,
          businessData.socialMedia?.linkedin || null,
          businessData.enhancedProfile?.enhancedDescription || null
        );

        const businessId = result.lastInsertRowid;

        // Insert strengths
        if (businessData.enhancedProfile?.strengths && businessData.enhancedProfile.strengths.length > 0) {
          const insertStrength = db.prepare('INSERT INTO strengths (business_id, strength) VALUES (?, ?)');
          for (const strength of businessData.enhancedProfile.strengths) {
            insertStrength.run(businessId, strength);
          }
        }

        // Insert target segments
        if (businessData.enhancedProfile?.targetSegments && businessData.enhancedProfile.targetSegments.length > 0) {
          const insertSegment = db.prepare('INSERT INTO target_segments (business_id, segment) VALUES (?, ?)');
          for (const segment of businessData.enhancedProfile.targetSegments) {
            insertSegment.run(businessId, segment);
          }
        }

        // Insert marketing suggestions
        if (businessData.enhancedProfile?.marketingSuggestions && businessData.enhancedProfile.marketingSuggestions.length > 0) {
          const insertSuggestion = db.prepare('INSERT INTO marketing_suggestions (business_id, suggestion) VALUES (?, ?)');
          for (const suggestion of businessData.enhancedProfile.marketingSuggestions) {
            insertSuggestion.run(businessId, suggestion);
          }
        }

        return businessId;
      });

      // Execute the transaction
      const businessId = transaction();

      // Return the created business
      return this.getBusinessById(businessId);
    } catch (error) {
      console.error('Error creating business in SQLite:', error);
      throw error;
    }
  },

  // Get business by ID
  getBusinessById: (id) => {
    try {
      // Get business data
      const business = db.prepare('SELECT * FROM businesses WHERE id = ?').get(id);

      if (!business) {
        return null;
      }

      // Get strengths
      const strengths = db.prepare('SELECT strength FROM strengths WHERE business_id = ?').all(id);

      // Get target segments
      const targetSegments = db.prepare('SELECT segment FROM target_segments WHERE business_id = ?').all(id);

      // Get marketing suggestions
      const marketingSuggestions = db.prepare('SELECT suggestion FROM marketing_suggestions WHERE business_id = ?').all(id);

      // Format the business data
      return formatBusinessData(business, strengths, targetSegments, marketingSuggestions);
    } catch (error) {
      console.error('Error getting business by ID from SQLite:', error);
      throw error;
    }
  },

  // Get business by user ID
  getBusinessByUserId: (userId) => {
    try {
      // Get business data
      const business = db.prepare('SELECT * FROM businesses WHERE user_id = ?').get(userId);

      if (!business) {
        return null;
      }

      // Get strengths
      const strengths = db.prepare('SELECT strength FROM strengths WHERE business_id = ?').all(business.id);

      // Get target segments
      const targetSegments = db.prepare('SELECT segment FROM target_segments WHERE business_id = ?').all(business.id);

      // Get marketing suggestions
      const marketingSuggestions = db.prepare('SELECT suggestion FROM marketing_suggestions WHERE business_id = ?').all(business.id);

      // Format the business data
      return formatBusinessData(business, strengths, targetSegments, marketingSuggestions);
    } catch (error) {
      console.error('Error getting business by user ID from SQLite:', error);
      throw error;
    }
  },

  // Update business
  updateBusiness: (userId, businessData) => {
    try {
      // Start a transaction
      const transaction = db.transaction(() => {
        // Get the business ID
        const business = db.prepare('SELECT id FROM businesses WHERE user_id = ?').get(userId);

        if (!business) {
          throw new Error('Business not found');
        }

        const businessId = business.id;

        // Update business data
        const updateBusiness = db.prepare(`
          UPDATE businesses SET
            name = ?,
            category = ?,
            description = ?,
            location = ?,
            contact_number = ?,
            additional_info = ?,
            target_audience = ?,
            years_in_business = ?,
            employee_count = ?,
            website = ?,
            social_media_facebook = ?,
            social_media_instagram = ?,
            social_media_twitter = ?,
            social_media_linkedin = ?,
            enhanced_description = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `);

        updateBusiness.run(
          businessData.name,
          businessData.category,
          businessData.description,
          businessData.location,
          businessData.contactNumber,
          businessData.additionalInfo || null,
          businessData.targetAudience || null,
          businessData.yearsInBusiness || null,
          businessData.employeeCount || null,
          businessData.website || null,
          businessData.socialMedia?.facebook || null,
          businessData.socialMedia?.instagram || null,
          businessData.socialMedia?.twitter || null,
          businessData.socialMedia?.linkedin || null,
          businessData.enhancedProfile?.enhancedDescription || null,
          businessId
        );

        // Delete existing related data
        db.prepare('DELETE FROM strengths WHERE business_id = ?').run(businessId);
        db.prepare('DELETE FROM target_segments WHERE business_id = ?').run(businessId);
        db.prepare('DELETE FROM marketing_suggestions WHERE business_id = ?').run(businessId);

        // Insert strengths
        if (businessData.enhancedProfile?.strengths && businessData.enhancedProfile.strengths.length > 0) {
          const insertStrength = db.prepare('INSERT INTO strengths (business_id, strength) VALUES (?, ?)');
          for (const strength of businessData.enhancedProfile.strengths) {
            insertStrength.run(businessId, strength);
          }
        }

        // Insert target segments
        if (businessData.enhancedProfile?.targetSegments && businessData.enhancedProfile.targetSegments.length > 0) {
          const insertSegment = db.prepare('INSERT INTO target_segments (business_id, segment) VALUES (?, ?)');
          for (const segment of businessData.enhancedProfile.targetSegments) {
            insertSegment.run(businessId, segment);
          }
        }

        // Insert marketing suggestions
        if (businessData.enhancedProfile?.marketingSuggestions && businessData.enhancedProfile.marketingSuggestions.length > 0) {
          const insertSuggestion = db.prepare('INSERT INTO marketing_suggestions (business_id, suggestion) VALUES (?, ?)');
          for (const suggestion of businessData.enhancedProfile.marketingSuggestions) {
            insertSuggestion.run(businessId, suggestion);
          }
        }

        return businessId;
      });

      // Execute the transaction
      const businessId = transaction();

      // Return the updated business
      return this.getBusinessById(businessId);
    } catch (error) {
      console.error('Error updating business in SQLite:', error);
      throw error;
    }
  },

  // Delete business
  deleteBusiness: (userId) => {
    try {
      // Get the business ID
      const business = db.prepare('SELECT id FROM businesses WHERE user_id = ?').get(userId);

      if (!business) {
        return false;
      }

      // Delete the business (cascade will delete related data)
      db.prepare('DELETE FROM businesses WHERE id = ?').run(business.id);

      return true;
    } catch (error) {
      console.error('Error deleting business from SQLite:', error);
      throw error;
    }
  }
};

// Helper function to format business data
function formatBusinessData(business, strengths, targetSegments, marketingSuggestions) {
  return {
    _id: business.id.toString(),
    user: business.user_id,
    name: business.name,
    category: business.category,
    description: business.description,
    location: business.location,
    contactNumber: business.contact_number,
    additionalInfo: business.additional_info,
    targetAudience: business.target_audience,
    yearsInBusiness: business.years_in_business,
    employeeCount: business.employee_count,
    website: business.website,
    socialMedia: {
      facebook: business.social_media_facebook,
      instagram: business.social_media_instagram,
      twitter: business.social_media_twitter,
      linkedin: business.social_media_linkedin
    },
    enhancedProfile: {
      enhancedDescription: business.enhanced_description,
      strengths: strengths.map(s => s.strength),
      targetSegments: targetSegments.map(s => s.segment),
      marketingSuggestions: marketingSuggestions.map(s => s.suggestion)
    },
    createdAt: business.created_at,
    updatedAt: business.updated_at
  };
}

module.exports = businessService; 