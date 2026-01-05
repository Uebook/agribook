import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/client';

// GET /api/reviews - Get reviews for a book
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get('bookId');
    const userId = searchParams.get('userId'); // Optional: filter by user
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    if (!bookId) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('reviews')
      .select(
        `
        *,
        user:users(id, name, email, avatar_url)
      `,
        { count: 'exact' }
      )
      .eq('book_id', bookId)
      .order('created_at', { ascending: false });

    // Filter by user if provided
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data: reviews, error, count } = await query
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching reviews:', error);
      return NextResponse.json(
        { error: 'Failed to fetch reviews' },
        { status: 500 }
      );
    }

    // Format reviews for response
    const formattedReviews = (reviews || []).map((review) => ({
      id: review.id,
      bookId: review.book_id,
      userId: review.user_id,
      userName: review.user?.name || 'Anonymous',
      userAvatar: review.user?.avatar_url,
      rating: review.rating,
      comment: review.comment,
      likes: review.likes || 0,
      dislikes: review.dislikes || 0,
      verified: review.verified || false,
      date: review.created_at,
      updatedAt: review.updated_at,
    }));

    return NextResponse.json({
      reviews: formattedReviews,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Error in GET /api/reviews:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await request.json();
    const { bookId, userId, rating, comment } = body;

    if (!bookId || !userId || !rating) {
      return NextResponse.json(
        { error: 'Book ID, User ID, and rating are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if user has already reviewed this book
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('book_id', bookId)
      .eq('user_id', userId)
      .single();

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this book' },
        { status: 409 }
      );
    }

    // Check if user has purchased the book (for verified badge)
    const { data: purchase } = await supabase
      .from('user_purchases')
      .select('id')
      .eq('book_id', bookId)
      .eq('user_id', userId)
      .single();

    const verified = !!purchase;

    // Create review
    const { data: review, error: createError } = await supabase
      .from('reviews')
      .insert({
        book_id: bookId,
        user_id: userId,
        rating,
        comment: comment || null,
        verified,
      })
      .select(
        `
        *,
        user:users(id, name, email, avatar_url)
      `
      )
      .single();

    if (createError) {
      console.error('Error creating review:', createError);
      return NextResponse.json(
        { error: 'Failed to create review' },
        { status: 500 }
      );
    }

    // Format review for response
    const formattedReview = {
      id: review.id,
      bookId: review.book_id,
      userId: review.user_id,
      userName: review.user?.name || 'Anonymous',
      userAvatar: review.user?.avatar_url,
      rating: review.rating,
      comment: review.comment,
      likes: review.likes || 0,
      dislikes: review.dislikes || 0,
      verified: review.verified || false,
      date: review.created_at,
      updatedAt: review.updated_at,
    };

    return NextResponse.json({ review: formattedReview }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/reviews:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

