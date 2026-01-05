import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/client';

// GET /api/curriculum - Get curriculum list with optional state filter
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');
    const status = searchParams.get('status') || 'active';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('curriculum')
      .select('*', { count: 'exact' })
      .eq('status', status)
      .order('published_date', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });

    // Filter by state if provided
    if (state) {
      query = query.eq('state', state);
    }

    const { data: curriculums, error, count } = await query
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching curriculum:', error);
      return NextResponse.json(
        { error: 'Failed to fetch curriculum' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      curriculums: curriculums || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Error in GET /api/curriculum:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/curriculum - Create new curriculum entry
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await request.json();

    const {
      title,
      description,
      state,
      state_name,
      language,
      banner_url,
      pdf_url,
      cover_image_url,
      published_date,
      scheme_name,
      grade,
      subject,
      status = 'active',
    } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const { data: curriculum, error } = await supabase
      .from('curriculum')
      .insert({
        title,
        description,
        state,
        state_name,
        language: language || 'English',
        banner_url,
        pdf_url,
        cover_image_url,
        published_date,
        scheme_name,
        grade,
        subject,
        status,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating curriculum:', error);
      return NextResponse.json(
        { error: 'Failed to create curriculum' },
        { status: 500 }
      );
    }

    return NextResponse.json({ curriculum }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/curriculum:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

