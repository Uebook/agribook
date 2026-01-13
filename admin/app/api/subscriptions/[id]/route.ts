import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/client';

// GET /api/subscriptions/[id] - Get a single subscription type
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerClient();

    const { data: subscriptionType, error } = await supabase
      .from('subscription_types')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching subscription type:', error);
      return NextResponse.json(
        { error: 'Subscription type not found', details: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json({ subscriptionType });
  } catch (error: any) {
    console.error('Error in GET /api/subscriptions/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/subscriptions/[id] - Update a subscription type
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, type, description, price, duration_days, is_active, features } = body;

    const supabase = createServerClient();

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) updateData.name = name;
    if (type !== undefined) {
      if (type !== 'monthly' && type !== 'per_book') {
        return NextResponse.json(
          { error: 'type must be either "monthly" or "per_book"' },
          { status: 400 }
        );
      }
      updateData.type = type;
    }
    if (description !== undefined) updateData.description = description || null;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (duration_days !== undefined) {
      updateData.duration_days = type === 'monthly' ? (duration_days ? parseInt(duration_days) : 30) : null;
    }
    if (is_active !== undefined) updateData.is_active = is_active;
    if (features !== undefined) updateData.features = features;

    const { data: subscriptionType, error } = await supabase
      .from('subscription_types')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating subscription type:', error);
      return NextResponse.json(
        { error: 'Failed to update subscription type', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      subscriptionType,
    });
  } catch (error: any) {
    console.error('Error in PUT /api/subscriptions/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/subscriptions/[id] - Delete a subscription type
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerClient();

    const { error } = await supabase
      .from('subscription_types')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting subscription type:', error);
      return NextResponse.json(
        { error: 'Failed to delete subscription type', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription type deleted successfully',
    });
  } catch (error: any) {
    console.error('Error in DELETE /api/subscriptions/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
