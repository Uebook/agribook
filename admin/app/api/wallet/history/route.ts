import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/client';

// CORS headers helper
function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  Object.entries(getCorsHeaders()).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

// GET /api/wallet/history - Get author payment history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const authorId = searchParams.get('author_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type'); // 'payments' or 'withdrawals'

    if (!authorId) {
      const errorResponse = NextResponse.json(
        { error: 'author_id is required' },
        { status: 400 }
      );
      Object.entries(getCorsHeaders()).forEach(([key, value]) => {
        errorResponse.headers.set(key, value);
      });
      return errorResponse;
    }

    const supabase = createServerClient();
    const offset = (page - 1) * limit;

    if (type === 'withdrawals') {
      // Get withdrawal history
      const { data: withdrawals, error: withdrawalError } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .eq('author_id', authorId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      const { count } = await supabase
        .from('withdrawal_requests')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', authorId);

      if (withdrawalError) {
        const errorResponse = NextResponse.json(
          { error: 'Failed to fetch withdrawals', details: withdrawalError.message },
          { status: 500 }
        );
        Object.entries(getCorsHeaders()).forEach(([key, value]) => {
          errorResponse.headers.set(key, value);
        });
        return errorResponse;
      }

      const response = NextResponse.json({
        success: true,
        withdrawals: withdrawals || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      });
      Object.entries(getCorsHeaders()).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    } else {
      // Get payment history
      // First try author_payment_history, then fallback to payments table
      let { data: payments, error: paymentError } = await supabase
        .from('author_payment_history')
        .select(`
          *,
          book:books(id, title, cover_image_url),
          audio_book:audio_books(id, title, cover_url),
          buyer:users(id, name, email)
        `)
        .eq('author_id', authorId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      let count = 0;
      if (!paymentError) {
        const { count: historyCount } = await supabase
          .from('author_payment_history')
          .select('*', { count: 'exact', head: true })
          .eq('author_id', authorId);
        count = historyCount || 0;
      }

      // If author_payment_history is empty or has error, query from payments table directly
      if (!payments || payments.length === 0 || paymentError) {
        console.log('📊 author_payment_history empty or error, querying from payments table...');
        
        // Query all payments and join with books/audio_books to get author_id
        const { data: allPayments, error: paymentsError } = await supabase
          .from('payments')
          .select(`
            *,
            book:books(id, title, cover_image_url, author_id),
            audio_book:audio_books(id, title, cover_url, author_id),
            buyer:users(id, name, email)
          `)
          .eq('status', 'completed')
          .order('created_at', { ascending: false });

        if (!paymentsError && allPayments) {
          // Filter payments where book.author_id or audio_book.author_id matches
          const authorPayments = allPayments.filter((payment: any) => {
            const bookAuthorId = payment.book?.author_id;
            const audioBookAuthorId = payment.audio_book?.author_id;
            const paymentAuthorId = payment.author_id;
            
            return bookAuthorId === authorId || 
                   audioBookAuthorId === authorId || 
                   paymentAuthorId === authorId;
          });

          // Transform to match author_payment_history format
          payments = authorPayments.map((payment: any) => ({
            id: payment.id,
            author_id: authorId,
            payment_id: payment.id,
            book_id: payment.book_id,
            audio_book_id: payment.audio_book_id,
            user_id: payment.user_id,
            gross_amount: parseFloat(payment.amount || 0),
            gst_amount: parseFloat(payment.gst_amount || 0),
            net_amount: parseFloat(payment.net_amount || payment.amount || 0),
            platform_commission: parseFloat(payment.platform_commission || 0),
            author_earnings: parseFloat(payment.author_earnings || 0),
            status: payment.status || 'completed',
            created_at: payment.created_at,
            book: payment.book,
            audio_book: payment.audio_book,
            buyer: payment.buyer,
          }));

          // Apply pagination
          count = payments.length;
          payments = payments.slice(offset, offset + limit);

          console.log(`📊 Found ${count} total payments for author ${authorId} from payments table`);
        } else {
          console.error('❌ Error fetching payments:', paymentsError);
          payments = [];
          count = 0;
        }
      } else {
        console.log(`📊 Found ${count} payments from author_payment_history`);
      }

      if (paymentError && (!payments || payments.length === 0)) {
        const errorResponse = NextResponse.json(
          { error: 'Failed to fetch payment history', details: paymentError.message },
          { status: 500 }
        );
        Object.entries(getCorsHeaders()).forEach(([key, value]) => {
          errorResponse.headers.set(key, value);
        });
        return errorResponse;
      }

      const response = NextResponse.json({
        success: true,
        payments: payments || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      });
      Object.entries(getCorsHeaders()).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }
  } catch (error: any) {
    console.error('Error in GET /api/wallet/history:', error);
    const errorResponse = NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
    Object.entries(getCorsHeaders()).forEach(([key, value]) => {
      errorResponse.headers.set(key, value);
    });
    return errorResponse;
  }
}
