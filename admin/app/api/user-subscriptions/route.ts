import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/client';

// CORS headers helper
function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(),
  });
}

// GET /api/user-subscriptions - Get user subscriptions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const status = searchParams.get('status'); // active, expired, cancelled

    if (!userId) {
      const errorResponse = NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
      Object.entries(getCorsHeaders()).forEach(([key, value]) => {
        errorResponse.headers.set(key, value);
      });
      return errorResponse;
    }

    const supabase = createServerClient();

    let query = supabase
      .from('user_subscriptions')
      .select(`
        *,
        subscription_type:subscription_types(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: subscriptions, error } = await query;

    if (error) {
      console.error('Error fetching user subscriptions:', error);
      const errorResponse = NextResponse.json(
        { error: 'Failed to fetch subscriptions', details: error.message },
        { status: 500 }
      );
      Object.entries(getCorsHeaders()).forEach(([key, value]) => {
        errorResponse.headers.set(key, value);
      });
      return errorResponse;
    }

    const response = NextResponse.json({
      subscriptions: subscriptions || [],
    });

    Object.entries(getCorsHeaders()).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error: any) {
    console.error('Error in GET /api/user-subscriptions:', error);
    const errorResponse = NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
    Object.entries(getCorsHeaders()).forEach(([key, value]) => {
      errorResponse.headers.set(key, value);
    });
    return errorResponse;
  }
}

// POST /api/user-subscriptions - Create/activate a user subscription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, subscription_type_id, payment_id, auto_renew } = body;

    if (!user_id || !subscription_type_id) {
      const errorResponse = NextResponse.json(
        { error: 'user_id and subscription_type_id are required' },
        { status: 400 }
      );
      Object.entries(getCorsHeaders()).forEach(([key, value]) => {
        errorResponse.headers.set(key, value);
      });
      return errorResponse;
    }

    const supabase = createServerClient();

    // Get subscription type details
    const { data: subscriptionType, error: typeError } = await supabase
      .from('subscription_types')
      .select('*')
      .eq('id', subscription_type_id)
      .single();

    if (typeError || !subscriptionType) {
      const errorResponse = NextResponse.json(
        { error: 'Subscription type not found' },
        { status: 404 }
      );
      Object.entries(getCorsHeaders()).forEach(([key, value]) => {
        errorResponse.headers.set(key, value);
      });
      return errorResponse;
    }

    // Calculate end date for monthly subscriptions
    let endDate: string | null = null;
    if (subscriptionType.type === 'monthly' && subscriptionType.duration_days) {
      const end = new Date();
      end.setDate(end.getDate() + subscriptionType.duration_days);
      endDate = end.toISOString();
    }

    // Deactivate any existing active subscriptions
    await supabase
      .from('user_subscriptions')
      .update({ status: 'cancelled' })
      .eq('user_id', user_id)
      .eq('status', 'active');

    // Create new subscription
    const { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id,
        subscription_type_id,
        status: 'active',
        end_date: endDate,
        auto_renew: auto_renew || false,
        payment_id: payment_id || null,
      })
      .select(`
        *,
        subscription_type:subscription_types(*)
      `)
      .single();

    if (error) {
      console.error('Error creating user subscription:', error);
      const errorResponse = NextResponse.json(
        { error: 'Failed to create subscription', details: error.message },
        { status: 500 }
      );
      Object.entries(getCorsHeaders()).forEach(([key, value]) => {
        errorResponse.headers.set(key, value);
      });
      return errorResponse;
    }

    // Update user's subscription_type_id
    await supabase
      .from('users')
      .update({ subscription_type_id })
      .eq('id', user_id);

    const response = NextResponse.json({
      success: true,
      subscription,
    });

    Object.entries(getCorsHeaders()).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error: any) {
    console.error('Error in POST /api/user-subscriptions:', error);
    const errorResponse = NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
    Object.entries(getCorsHeaders()).forEach(([key, value]) => {
      errorResponse.headers.set(key, value);
    });
    return errorResponse;
  }
}
