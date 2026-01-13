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

// GET /api/subscriptions - Get all subscription types
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type'); // Filter by type: 'monthly' or 'per_book'
    const isActive = searchParams.get('is_active'); // Filter by active status

    const supabase = createServerClient();
    const offset = (page - 1) * limit;

    let query = supabase
      .from('subscription_types')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    if (isActive !== null && isActive !== undefined) {
      const isActiveBool = isActive === 'true' || isActive === '1';
      query = query.eq('is_active', isActiveBool);
    }

    const { data: subscriptionTypes, error, count } = await query
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching subscription types:', error);
      const errorResponse = NextResponse.json(
        { error: 'Failed to fetch subscription types', details: error.message },
        { status: 500 }
      );
      Object.entries(getCorsHeaders()).forEach(([key, value]) => {
        errorResponse.headers.set(key, value);
      });
      return errorResponse;
    }

    const response = NextResponse.json({
      subscriptionTypes: subscriptionTypes || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });

    Object.entries(getCorsHeaders()).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error: any) {
    console.error('Error in GET /api/subscriptions:', error);
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

// POST /api/subscriptions - Create a new subscription type
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, description, price, duration_days, is_active, features } = body;

    if (!name || !type || price === undefined) {
      const errorResponse = NextResponse.json(
        { error: 'name, type, and price are required' },
        { status: 400 }
      );
      Object.entries(getCorsHeaders()).forEach(([key, value]) => {
        errorResponse.headers.set(key, value);
      });
      return errorResponse;
    }

    if (type !== 'monthly') {
      const errorResponse = NextResponse.json(
        { error: 'type must be "monthly" (Per Book Pay is the default, no subscription needed)' },
        { status: 400 }
      );
      Object.entries(getCorsHeaders()).forEach(([key, value]) => {
        errorResponse.headers.set(key, value);
      });
      return errorResponse;
    }

    const supabase = createServerClient();

    const { data: subscriptionType, error } = await supabase
      .from('subscription_types')
      .insert({
        name,
        type,
        description: description || null,
        price: parseFloat(price),
        duration_days: type === 'monthly' ? (duration_days ? parseInt(duration_days) : 30) : null,
        features: features || null,
        is_active: is_active !== undefined ? is_active : true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating subscription type:', error);
      const errorResponse = NextResponse.json(
        { error: 'Failed to create subscription type', details: error.message },
        { status: 500 }
      );
      Object.entries(getCorsHeaders()).forEach(([key, value]) => {
        errorResponse.headers.set(key, value);
      });
      return errorResponse;
    }

    const response = NextResponse.json({
      success: true,
      subscriptionType,
    });

    Object.entries(getCorsHeaders()).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error: any) {
    console.error('Error in POST /api/subscriptions:', error);
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
