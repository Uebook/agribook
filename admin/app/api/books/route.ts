import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/client';

// GET /api/books - List books with pagination
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const searchParams = request.nextUrl.searchParams;
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;
    
    // Filters
    const categoryId = searchParams.get('category');
    const authorId = searchParams.get('author');
    const language = searchParams.get('language');
    const search = searchParams.get('search');
    const status = searchParams.get('status'); // Don't default to 'published', allow 'all'
    
    // Build query
    let query = supabase
      .from('books')
      .select(`
        *,
        author:authors(*),
        category:categories(*)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Apply status filter only if specified (not 'all')
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    
    // Apply filters
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }
    
    if (authorId) {
      query = query.eq('author_id', authorId);
    }
    
    if (language) {
      query = query.eq('language', language);
    }
    
    if (search) {
      // Full-text search
      query = query.textSearch('title', search, {
        type: 'websearch',
        config: 'english',
      });
    }
    
    const { data: books, error, count } = await query;
    
    if (error) {
      console.error('Error fetching books:', error);
      return NextResponse.json(
        { error: 'Failed to fetch books' },
        { status: 500 }
      );
    }
    
    // Get total count for pagination
    let countQuery = supabase
      .from('books')
      .select('*', { count: 'exact', head: true });
    
    if (status && status !== 'all') {
      countQuery = countQuery.eq('status', status);
    }
    
    const { count: totalCount } = await countQuery;
    
    return NextResponse.json({
      books: books || [],
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Error in GET /api/books:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/books - Create new book
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await request.json();
    
    const {
      title,
      author_id,
      summary,
      price,
      original_price,
      pages,
      language,
      category_id,
      isbn,
      is_free,
      pdf_url,
      cover_image_url,
      cover_images,
      published_date,
    } = body;
    
    // Log image data for debugging
    console.log('📸 Image data received:', {
      cover_image_url: cover_image_url ? `${cover_image_url.substring(0, 50)}...` : null,
      cover_images_count: Array.isArray(cover_images) ? cover_images.length : (cover_images ? 1 : 0),
      cover_images_type: typeof cover_images,
      cover_images_is_array: Array.isArray(cover_images),
      cover_images_preview: Array.isArray(cover_images) 
        ? cover_images.map((url: string) => url ? `${url.substring(0, 30)}...` : null).slice(0, 3)
        : cover_images ? `${String(cover_images).substring(0, 30)}...` : null,
    });
    
    // Validate required fields
    if (!title || !author_id || !category_id) {
      return NextResponse.json(
        { error: 'Missing required fields: title, author_id, and category_id are required' },
        { status: 400 }
      );
    }
    
    // Check if author exists, if not create one from user data
    let finalAuthorId = author_id;
    const { data: existingAuthor, error: authorCheckError } = await supabase
      .from('authors')
      .select('id')
      .eq('id', author_id)
      .single();
    
    if (authorCheckError || !existingAuthor) {
      console.log('Author not found, attempting to create from user data...');
      // Author doesn't exist, try to create from user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, name, email, mobile, avatar_url')
        .eq('id', author_id)
        .single();
      
      if (userData && !userError) {
        // Create author record from user data
        const { data: newAuthor, error: createAuthorError } = await supabase
          .from('authors')
          .insert({
            id: userData.id, // Use same ID as user
            name: userData.name || 'Unknown Author',
            email: userData.email || null,
            mobile: userData.mobile || null,
            avatar_url: userData.avatar_url || null,
            status: 'active',
          })
          .select()
          .single();
        
        if (createAuthorError) {
          console.error('Error creating author:', createAuthorError);
          // If it's a duplicate key error, author might have been created by another request
          // Check again if author exists now
          const { data: retryAuthor } = await supabase
            .from('authors')
            .select('id')
            .eq('id', author_id)
            .single();
          
          if (!retryAuthor) {
            return NextResponse.json(
              { error: `Failed to create author record: ${createAuthorError.message}` },
              { status: 400 }
            );
          }
        } else {
          finalAuthorId = newAuthor.id;
        }
      } else {
        return NextResponse.json(
          { error: `Author ID ${author_id} not found in users table. Please ensure the user exists.` },
          { status: 400 }
        );
      }
    }
    
    // Validate category exists
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('id, name')
      .eq('id', category_id)
      .single();
    
    if (!category || categoryError) {
      console.error('Category validation error:', categoryError);
      return NextResponse.json(
        { 
          error: `Invalid category_id: Category with ID ${category_id} does not exist. Please select a valid category.`,
          details: categoryError?.message || 'Category not found'
        },
        { status: 400 }
      );
    }
    
    console.log('Category validated:', category.name);
    
    // Process cover_images - ensure it's an array
    let processedCoverImages: string[] = [];
    if (cover_images) {
      if (Array.isArray(cover_images)) {
        // Filter out null/undefined/empty strings
        processedCoverImages = cover_images.filter((url: any) => url && typeof url === 'string' && url.trim().length > 0);
      } else if (typeof cover_images === 'string' && cover_images.trim().length > 0) {
        // Single string, convert to array
        processedCoverImages = [cover_images];
      }
    }
    
    // Use first cover image as cover_image_url if not provided
    const finalCoverImageUrl = cover_image_url || (processedCoverImages.length > 0 ? processedCoverImages[0] : null);
    
    console.log('📸 Processed image data:', {
      cover_image_url: finalCoverImageUrl ? `${finalCoverImageUrl.substring(0, 50)}...` : null,
      cover_images_count: processedCoverImages.length,
      cover_images_preview: processedCoverImages.slice(0, 3).map((url: string) => url ? `${url.substring(0, 30)}...` : null),
    });
    
    // Insert book
    const { data: book, error } = await supabase
      .from('books')
      .insert({
        title,
        author_id: finalAuthorId,
        summary,
        price: price || 0,
        original_price: original_price || price || 0,
        pages,
        language: language || 'English',
        category_id,
        isbn,
        is_free: is_free || false,
        pdf_url,
        cover_image_url: finalCoverImageUrl,
        cover_images: processedCoverImages,
        published_date: published_date || new Date().toISOString(),
        status: 'pending',
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating book:', error);
      // Provide more detailed error message
      let errorMessage = 'Failed to create book';
      if (error.code === '23503') {
        errorMessage = 'Foreign key constraint failed. Please ensure author and category exist.';
      } else if (error.code === '23505') {
        errorMessage = 'Duplicate entry. A book with this title or ISBN may already exist.';
      } else if (error.message) {
        errorMessage = `Failed to create book: ${error.message}`;
      }
      return NextResponse.json(
        { error: errorMessage, details: error },
        { status: 500 }
      );
    }
    
    // Log successful creation with image info
    console.log('✅ Book created successfully:', {
      book_id: book?.id,
      title: book?.title,
      has_cover_image_url: !!book?.cover_image_url,
      cover_images_count: Array.isArray(book?.cover_images) ? book.cover_images.length : 0,
      cover_image_url_preview: book?.cover_image_url ? `${book.cover_image_url.substring(0, 50)}...` : null,
    });
    
    // Update author's books count (ignore errors if RPC doesn't exist)
    try {
      await supabase.rpc('increment_author_books', {
        author_id_param: finalAuthorId,
      });
    } catch (rpcError) {
      console.warn('Could not increment author books count:', rpcError);
      // Not critical, continue
    }
    
    return NextResponse.json({ book }, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/books:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}




