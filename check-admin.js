const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

const envPath = path.join(__dirname, 'admin', '.env.local');
console.log('Checking env file at:', envPath);

if (!fs.existsSync(envPath)) {
    console.error('Env file not found at:', envPath);
    process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');
const env = {};
lines.forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        env[match[1].trim()] = match[2].trim();
    }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in env file');
    console.log('Env keys found:', Object.keys(env));
    process.exit(1);
}

console.log('Connecting to Supabase:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAdminUser() {
    try {
        console.log('Querying users table for admin@agribook.com...');
        const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', 'admin@agribook.com');

        if (error) {
            console.error('Supabase error:', error);
            return;
        }

        if (!users || users.length === 0) {
            console.log('No user found with email admin@agribook.com');

            console.log('Fetching first 5 users to see schema and data...');
            const { data: allUsers, error: allUsersError } = await supabase
                .from('users')
                .select('*')
                .limit(5);

            if (allUsersError) {
                console.error('Error fetching all users:', allUsersError);
            } else {
                console.log('Available users:', JSON.stringify(allUsers, null, 2));
            }
        } else {
            console.log('Found user:', JSON.stringify(users[0], null, 2));
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

checkAdminUser().then(() => console.log('Done'));
