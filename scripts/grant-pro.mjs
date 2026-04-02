import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars. URL:', !!supabaseUrl, 'KEY:', !!supabaseKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Find user by email
const { data: users, error: userError } = await supabase.auth.admin.listUsers();
if (userError) {
  console.error('Error listing users:', userError);
  process.exit(1);
}

const user = users.users.find(u => u.email === 'davidthevos@gmail.com');
if (!user) {
  console.error('User not found');
  process.exit(1);
}

console.log('Found user:', user.id, user.email);

// Check existing subscription
const { data: existing } = await supabase
  .from('subscriptions')
  .select('*')
  .eq('user_id', user.id)
  .single();

console.log('Existing subscription:', existing);

// Grant lifetime access
const { data, error } = await supabase
  .from('subscriptions')
  .upsert({
    user_id: user.id,
    status: 'active',
    price_id: 'lifetime',
    stripe_customer_id: existing?.stripe_customer_id || null,
    stripe_subscription_id: 'manual_lifetime_grant',
    current_period_start: new Date().toISOString(),
    current_period_end: null,
    cancel_at_period_end: false,
    updated_at: new Date().toISOString(),
  })
  .select();

if (error) {
  console.error('Error granting access:', error);
  process.exit(1);
}

console.log('Granted lifetime Pro access:', data);
