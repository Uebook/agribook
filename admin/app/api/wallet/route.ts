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

// GET /api/wallet - Get author wallet balance and summary
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const authorId = searchParams.get('author_id');

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

    // Get or create wallet
    let { data: wallet, error: walletError } = await supabase
      .from('author_wallet')
      .select('*')
      .eq('author_id', authorId)
      .single();

    if (walletError && walletError.code === 'PGRST116') {
      // Wallet doesn't exist, create it
      const { data: newWallet, error: createError } = await supabase
        .from('author_wallet')
        .insert({
          author_id: authorId,
          balance: 0,
          total_earnings: 0,
          total_withdrawn: 0,
        })
        .select()
        .single();

      if (createError) {
        const errorResponse = NextResponse.json(
          { error: 'Failed to create wallet', details: createError.message },
          { status: 500 }
        );
        Object.entries(getCorsHeaders()).forEach(([key, value]) => {
          errorResponse.headers.set(key, value);
        });
        return errorResponse;
      }
      wallet = newWallet;
    } else if (walletError) {
      const errorResponse = NextResponse.json(
        { error: 'Failed to fetch wallet', details: walletError.message },
        { status: 500 }
      );
      Object.entries(getCorsHeaders()).forEach(([key, value]) => {
        errorResponse.headers.set(key, value);
      });
      return errorResponse;
    }

    // Get recent payment history (last 10)
    // First try author_payment_history, then fallback to payments table
    let { data: recentPayments, error: paymentHistoryError } = await supabase
      .from('author_payment_history')
      .select(`
        *,
        book:books(id, title, cover_image_url),
        audio_book:audio_books(id, title, cover_url),
        buyer:users(id, name)
      `)
      .eq('author_id', authorId)
      .order('created_at', { ascending: false })
      .limit(10);

    // If author_payment_history is empty or has error, query from payments table directly
    if (!recentPayments || recentPayments.length === 0 || paymentHistoryError) {
      console.log('📊 author_payment_history empty or error, querying from payments table...');
      
      // Query payments and join with books/audio_books to get author_id
      const { data: allPayments, error: paymentsError } = await supabase
        .from('payments')
        .select(`
          *,
          book:books(id, title, cover_image_url, author_id),
          audio_book:audio_books(id, title, cover_url, author_id),
          buyer:users(id, name)
        `)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(50); // Get more to filter by author_id

      if (!paymentsError && allPayments) {
        // Filter payments where book.author_id or audio_book.author_id matches
        const authorPayments = allPayments.filter((payment: any) => {
          const bookAuthorId = payment.book?.author_id;
          const audioBookAuthorId = payment.audio_book?.author_id;
          const paymentAuthorId = payment.author_id; // Direct author_id on payment
          
          return bookAuthorId === authorId || 
                 audioBookAuthorId === authorId || 
                 paymentAuthorId === authorId;
        });

        // Transform to match author_payment_history format
        recentPayments = authorPayments.slice(0, 10).map((payment: any) => ({
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

        console.log(`📊 Found ${recentPayments.length} payments for author ${authorId} from payments table`);
      } else {
        console.error('❌ Error fetching payments:', paymentsError);
        recentPayments = [];
      }
    } else {
      console.log(`📊 Found ${recentPayments.length} payments from author_payment_history`);
    }

    // Get pending withdrawal requests
    const { data: pendingWithdrawals } = await supabase
      .from('withdrawal_requests')
      .select('*')
      .eq('author_id', authorId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    const response = NextResponse.json({
      success: true,
      wallet: {
        balance: parseFloat(wallet.balance || 0),
        total_earnings: parseFloat(wallet.total_earnings || 0),
        total_withdrawn: parseFloat(wallet.total_withdrawn || 0),
      },
      recent_payments: recentPayments || [],
      pending_withdrawals: pendingWithdrawals || [],
    });
    Object.entries(getCorsHeaders()).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  } catch (error: any) {
    console.error('Error in GET /api/wallet:', error);
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
