const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Supabase URL or service key not found in environment variables');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration() {
  try {
    console.log('Reading migration file...');
    const migrationFilePath = path.join(__dirname, '../migrations/create_user_profiles_table.sql');
    const sqlContent = fs.readFileSync(migrationFilePath, 'utf8');
    
    console.log('Running SQL migration...');
    const { error } = await supabase.rpc('pgfunction', { query: sqlContent });
    
    if (error) {
      throw error;
    }
    
    console.log('Migration completed successfully!');
    
    // Create profiles for existing users
    console.log('Creating profiles for existing users...');
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      throw usersError;
    }
    
    // Process in batches
    const batchSize = 20;
    const userBatches = [];
    
    for (let i = 0; i < users.length; i += batchSize) {
      userBatches.push(users.slice(i, i + batchSize));
    }
    
    for (const batch of userBatches) {
      const profileInserts = batch.map(user => ({
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      
      const { error: insertError } = await supabase
        .from('user_profiles')
        .upsert(profileInserts, { onConflict: 'user_id' });
      
      if (insertError) {
        console.warn('Error inserting profiles:', insertError);
      }
    }
    
    console.log('User profiles created successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration(); 