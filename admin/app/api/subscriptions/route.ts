import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/client';

// GET /api/subscriptions - Get all subscription types
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type'); // Filter by type: 'monthly' or 'per_book'

    const supabase = createServerClient();
    const offset = (page - 1) * limit;

    let query = supabase
      .from('subscription_types')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    const { data: subscriptionTypes, error, count } = await query
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching subscription types:', error);
      return NextResponse.json(
        { error: 'Failed to fetch subscription types', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      subscriptionTypes: subscriptionTypes || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error: any) {
    console.error('Error in GET /api/subscriptions:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/subscriptions - Create a new subscription type
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, description, price, duration_days, is_active, features } = body;

    if (!name || !type || price === undefined) {
      return NextResponse.json(
        { error: 'name, type, and price are required' },
        { status: 400 }
      );
    }

    if (type !== 'monthly' && type !== 'per_book') {
      return NextResponse.json(
        { error: 'type must be either "monthly" or "per_book"' },
        { status: 400 }
      );
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
      return NextResponse.json(
        { error: 'Failed to create subscription type', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      subscriptionType,
    });
  } catch (error: any) {
    console.error('Error in POST /api/subscriptions:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
