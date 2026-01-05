import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/client';

// GET /api/categories - List all categories
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching categories:', error);
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ categories: categories || [] });
  } catch (error) {
    console.error('Error in GET /api/categories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
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
        { status: 400 }
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
        { status: 400 }
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
        { status: 500 }
      );
    }
    
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/categories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

