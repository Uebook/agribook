import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/client';

function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(),
  });
}

// GET /api/categories - List categories with pagination
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const searchParams = request.nextUrl.searchParams;
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '15');
    const offset = (page - 1) * limit;
    
    // Build query with pagination
    const { data: categories, error, count } = await supabase
      .from('categories')
      .select('*', { count: 'exact' })
      .order('name', { ascending: true })
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error('Error fetching categories:', error);
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500, headers: getCorsHeaders() }
      );
    }
    
    const response = NextResponse.json({
      categories: categories || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    }, { headers: getCorsHeaders() });
    return response;
  } catch (error) {
    console.error('Error in GET /api/categories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: getCorsHeaders() }
    );
  }
}

// POST /api/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await request.json();
    
    const { name, description, icon, status } = body;
    
    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400, headers: getCorsHeaders() }
      );
    }
    
    // Check if category with same name already exists
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('name', name)
      .single();
    
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 400, headers: getCorsHeaders() }
      );
    }
    
    // Insert category - build data object conditionally
    const insertData: any = {
      name,
      icon: icon || '📚',
    };
    
    // Only add optional fields if they exist in schema
    // Try to insert with all fields first, if it fails, try without optional ones
    try {
      if (description !== undefined && description !== null && description !== '') {
        insertData.description = description;
      }
      if (status) {
        insertData.status = status;
      }
    } catch (e) {
      // Ignore - columns may not exist
    }
    
    const { data: category, error } = await supabase
      .from('categories')
      .insert(insertData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating category:', error);
      console.error('Supabase error details:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: 'Failed to create category', details: error.message },
        { status: 500, headers: getCorsHeaders() }
      );
    }
    
    return NextResponse.json({ category }, { status: 201, headers: getCorsHeaders() });
  } catch (error) {
    console.error('Error in POST /api/categories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: getCorsHeaders() }
    );
  }
}

