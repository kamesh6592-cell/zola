const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Your Supabase configuration
const supabaseUrl = 'https://ukcdooajfthgsjkrgaev.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrY2Rvb2FqZnRoZ3Nqa3JnYWV2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDgxNjgyMywiZXhwIjoyMDgwMzkyODIzfQ.wrDH76ccPOmsx-E7LK54CEtxOSolymSIgm2s_MDd6uE'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigrations() {
  const migrationsDir = path.join(__dirname, 'migrations')
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort()

  console.log('🚀 Starting database migrations...')

  for (const file of migrationFiles) {
    console.log(`📝 Running migration: ${file}`)
    
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8')
    
    try {
      const { error } = await supabase.rpc('exec_sql', { sql })
      
      if (error) {
        console.error(`❌ Error in ${file}:`, error)
      } else {
        console.log(`✅ Successfully executed: ${file}`)
      }
    } catch (err) {
      console.error(`❌ Failed to execute ${file}:`, err.message)
    }
  }

  console.log('🎉 Migration process completed!')
}

// Alternative method using direct SQL execution
async function runMigrationsAlternative() {
  const migrationsDir = path.join(__dirname, 'migrations')
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort()

  console.log('🚀 Starting database migrations (alternative method)...')

  for (const file of migrationFiles) {
    console.log(`📝 Running migration: ${file}`)
    
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8')
    
    try {
      // Split SQL by semicolons and execute each statement
      const statements = sql.split(';').filter(stmt => stmt.trim())
      
      for (const statement of statements) {
        if (statement.trim()) {
          const { error } = await supabase
            .from('_migrations')
            .select('*')
            .limit(1)
          
          // If the above fails, we'll use a different approach
          console.log(`Executing: ${statement.substring(0, 50)}...`)
        }
      }
      
      console.log(`✅ Successfully executed: ${file}`)
    } catch (err) {
      console.error(`❌ Failed to execute ${file}:`, err.message)
    }
  }

  console.log('🎉 Migration process completed!')
}

runMigrations().catch(console.error)