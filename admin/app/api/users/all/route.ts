import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/client';

// GET /api/users/all - Get all users (for selection in notifications)
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const searchParams = request.nextUrl.searchParams;
    
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role'); // Optional role filter
    const limit = parseInt(searchParams.get('limit') || '1000'); // Get all users by default
    
    let query = supabase
      .from('users')
      .select('id, name, email, mobile, role, avatar_url')
      .order('name', { ascending: true })
      .limit(limit);

    // Filter by role if provided
    if (role) {
      query = query.eq('role', role);
    }

    // Search by name, email, or mobile if search term provided
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,mobile.ilike.%${search}%`);
    }

    const { data: users, error } = await query;

    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      users: users || [],
    });
  } catch (error) {
    console.error('Error in GET /api/users/all:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
