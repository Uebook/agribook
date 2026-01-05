import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/client';

// GET /api/audio-books/[id] - Get single audio book
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const { id } = params;
    
    const { data: audioBook, error } = await supabase
      .from('audio_books')
      .select(`
        *,
        author:authors(*),
        category:categories(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching audio book:', error);
      return NextResponse.json(
        { error: 'Audio book not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ audioBook });
  } catch (error) {
    console.error('Error in GET /api/audio-books/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/audio-books/[id] - Update audio book
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const { id } = params;
    const body = await request.json();
    
    const { data: audioBook, error } = await supabase
      .from('audio_books')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating audio book:', error);
      return NextResponse.json(
        { error: 'Failed to update audio book' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ audioBook });
  } catch (error) {
    console.error('Error in PUT /api/audio-books/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/audio-books/[id] - Delete audio book
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const { id } = params;
    
    const { data: audioBook } = await supabase
      .from('audio_books')
      .select('audio_url')
      .eq('id', id)
      .single();
    
    const { error } = await supabase
      .from('audio_books')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting audio book:', error);
      return NextResponse.json(
        { error: 'Failed to delete audio book' },
        { status: 500 }
      );
    }
    
    // Delete audio file from storage if exists
    if (audioBook?.audio_url) {
      const fileName = audioBook.audio_url.split('/').pop();
      await supabase.storage
        .from('audio-books')
        .remove([fileName || '']);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/audio-books/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

