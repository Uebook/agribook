import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/client';

// GET /api/categories/[id] - Get single category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServerClient();
    const { id } = await params;
    
    const { data: category, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching category:', error);
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ category });
  } catch (error) {
    console.error('Error in GET /api/categories/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServerClient();
    const { id } = await params;
    const body = await request.json();
    
    const { name, description, icon, status } = body;
    
    // Check if category exists
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id, name')
      .eq('id', id)
      .single();
    
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // If name is being updated, check for duplicates
    if (name && name !== existingCategory.name) {
      const { data: duplicateCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('name', name)
        .neq('id', id)
        .single();
      
      if (duplicateCategory) {
        return NextResponse.json(
          { error: 'Category with this name already exists' },
          { status: 400 }
        );
      }
    }
    
    // Update category - only include provided fields that exist in schema
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (icon !== undefined) updateData.icon = icon;
    
    // Only add optional fields if provided (columns may not exist in schema)
    if (description !== undefined && description !== null) {
      updateData.description = description;
    }
    if (status !== undefined) {
      updateData.status = status;
    }
    // Try to add updated_at (may not exist in schema)
    try {
      updateData.updated_at = new Date().toISOString();
    } catch (e) {
      // Ignore if column doesn't exist
    }
    
    const { data: category, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating category:', error);
      console.error('Supabase error details:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: 'Failed to update category', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ category });
  } catch (error) {
    console.error('Error in PUT /api/categories/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServerClient();
    const { id } = await params;
    
    // Check if category exists
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('id', id)
      .single();
    
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Check if category is used in books
    const { data: booksUsingCategory } = await supabase
      .from('books')
      .select('id')
      .eq('category_id', id)
      .limit(1);
    
    if (booksUsingCategory && booksUsingCategory.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category: It is being used by books' },
        { status: 400 }
      );
    }
    
    // Delete category
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting category:', error);
      return NextResponse.json(
        { error: 'Failed to delete category' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/categories/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

