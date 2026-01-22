import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/client';

// GET /api/dashboard - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Get total books
    const { count: totalBooks } = await supabase
      .from('books')
      .select('*', { count: 'exact', head: true });

    // Get total audio books
    const { count: totalAudioBooks } = await supabase
      .from('audio_books')
      .select('*', { count: 'exact', head: true });

    // Get total authors
    const { count: totalAuthors } = await supabase
      .from('authors')
      .select('*', { count: 'exact', head: true });

    // Get total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Get pending books
    const { count: pendingBooks } = await supabase
      .from('books')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Get pending audio books
    const { count: pendingAudioBooks } = await supabase
      .from('audio_books')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Get active users
    const { count: activeUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Get payments and revenue from payments table
    let totalPayments = 0;
    let totalRevenue = 0;
    let totalPlatformCommission = 0;
    let totalGST = 0;
    let totalAuthorEarnings = 0;
    const authorRevenue: any[] = [];
    
    try {
      // Debug: Get total count of all payments (any status) FIRST
      const { count: allPaymentsCount } = await supabase
        .from('payments')
        .select('*', { count: 'exact', head: true });
      
      console.log('📊 ========================================');
      console.log('📊 PAYMENTS TABLE CHECK:');
      console.log('📊 Total payments in database (any status):', allPaymentsCount || 0);
      
      // Check if payments table exists by trying to query it with basic columns only
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('id, amount, status, book_id, audio_book_id, created_at, subscription_type_id', { count: 'exact', head: false })
        .limit(1);
      
      console.log('📊 Payments table check result:', paymentsError ? 'ERROR' : 'OK');
      if (paymentsError) {
        console.log('📊 Payments error code:', paymentsError.code);
        console.log('📊 Payments error message:', paymentsError.message);
      }
      
      // If table doesn't exist (PGRST116) or no error, try to fetch all payments
      if (paymentsError && paymentsError.code === 'PGRST116') {
        // Table doesn't exist, use defaults
        console.log('❌ Payments table not found, using default values');
      } else if (!paymentsError) {
        console.log('✅ Payments table exists, proceeding with query...');
        // Table exists, fetch book/audio book payments (EXACT same query pattern as purchases API)
        // Use select('*') to get all columns (like purchases API) - handles missing columns gracefully
        let paymentsQuery = supabase
          .from('payments')
          .select('*') // Get all columns - matches purchases API exactly
          .eq('status', 'completed') // Only completed payments (same as purchases API)
          .is('subscription_type_id', null); // Exclude subscription purchases (same as purchases API)
        
        console.log('📊 Query filters: status=completed, subscription_type_id=null');
        console.log('📊 Using select(*) to get all columns (handles missing columns gracefully)');
        
        // Apply date filtering if provided
        if (startDate) {
          paymentsQuery = paymentsQuery.gte('created_at', startDate);
        }
        if (endDate) {
          // Add one day to endDate to include the entire end date
          const endDatePlusOne = new Date(endDate);
          endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
          paymentsQuery = paymentsQuery.lt('created_at', endDatePlusOne.toISOString());
        }
        
        // Execute query - EXACT same as purchases API
        console.log('🔍 Executing payments query...');
        const { data: allPayments, error: paymentsFetchError } = await paymentsQuery;
        
        if (paymentsFetchError) {
          console.error('❌ Error fetching payments:', paymentsFetchError);
          console.error('Error details:', JSON.stringify(paymentsFetchError, null, 2));
        } else {
          console.log('✅ Payments query successful');
        }
        
        console.log('📊 ========================================');
        console.log('📊 DASHBOARD PAYMENTS DEBUG START');
        console.log('📊 ========================================');
        console.log('📊 All payments fetched from query:', allPayments?.length || 0);
        
        // Log ALL payments with full details
        if (allPayments && allPayments.length > 0) {
          console.log('📊 ALL PAYMENTS FROM QUERY:');
          allPayments.forEach((p: any, index: number) => {
            console.log(`📊 Payment ${index + 1}:`, {
              id: p.id,
              amount: p.amount,
              status: p.status,
              book_id: p.book_id,
              audio_book_id: p.audio_book_id,
              subscription_type_id: p.subscription_type_id,
              created_at: p.created_at,
              platform_commission: p.platform_commission,
              gst_amount: p.gst_amount,
              author_earnings: p.author_earnings,
              hasBookId: !!p.book_id,
              hasAudioBookId: !!p.audio_book_id,
              hasBookOrAudioBook: !!(p.book_id || p.audio_book_id),
              amountValue: parseFloat(String(p.amount || 0))
            });
          });
        } else {
          console.log('⚠️ NO PAYMENTS RETURNED FROM QUERY!');
        }
        
        // Filter payments - EXACT same logic as purchases API
        // Purchases API filters in JavaScript: payments with book_id OR audio_book_id
        // This matches what shows on the Purchases page
        const bookPayments = (allPayments || []).filter(p => {
          const hasBookOrAudioBook = p.book_id || p.audio_book_id;
          console.log(`🔍 Filtering payment: book_id=${p.book_id}, audio_book_id=${p.audio_book_id}, matches=${hasBookOrAudioBook}`);
          return hasBookOrAudioBook; // Must have book_id OR audio_book_id
        });
        
        console.log('📊 ========================================');
        console.log('📊 FILTERED RESULTS:');
        console.log('📊 Total payments from query:', allPayments?.length || 0);
        console.log('📊 Payments with book_id or audio_book_id:', bookPayments.length);
        console.log('📊 ========================================');
        
        if (bookPayments.length > 0) {
          console.log('✅ FOUND BOOK PAYMENTS:', bookPayments.length);
          console.log('📊 BOOK PAYMENTS DETAILS:');
          bookPayments.forEach((p: any, index: number) => {
            console.log(`📊 Book Payment ${index + 1}:`, {
              id: p.id,
              amount: p.amount,
              amountParsed: parseFloat(String(p.amount || 0)),
              book_id: p.book_id,
              audio_book_id: p.audio_book_id,
              platform_commission: p.platform_commission,
              gst_amount: p.gst_amount,
              author_earnings: p.author_earnings
            });
          });
        } else {
          console.log('⚠️ NO BOOK PAYMENTS FOUND AFTER FILTERING!');
          if (allPayments && allPayments.length > 0) {
            console.log('⚠️ Payments exist but none have book_id or audio_book_id');
            console.log('📊 All payments (first 5):', JSON.stringify(allPayments.slice(0, 5), null, 2));
          } else {
            console.log('⚠️ No payments returned from query at all!');
          }
        }
        
        if (bookPayments && bookPayments.length > 0) {
          console.log('📊 ========================================');
          console.log('📊 CALCULATING TOTALS:');
          console.log('📊 ========================================');
          
          totalPayments = bookPayments.length;
          console.log('📊 Total Payments Count:', totalPayments);
          
          // Calculate totals - only include payments with amount > 0 for revenue
          const revenuePayments = bookPayments.filter(p => {
            const amount = parseFloat(String(p.amount || 0));
            const included = amount > 0;
            console.log(`💰 Payment ${p.id}: amount=${p.amount} (parsed=${amount}), included=${included}`);
            return included;
          });
          
          console.log('📊 Revenue payments (amount > 0):', revenuePayments.length);
          
          totalRevenue = revenuePayments.reduce((sum, p) => {
            const amount = parseFloat(String(p.amount)) || 0;
            console.log(`💰 Adding to revenue: ${amount}, running total: ${sum + amount}`);
            return sum + amount;
          }, 0);
          
          console.log('📊 Total Revenue Calculated:', totalRevenue);
          
          // Calculate commission/GST - use stored values or calculate on the fly
          // Only process payments with amount > 0 for revenue calculations
          console.log('📊 Calculating commission/GST/earnings...');
          for (const payment of bookPayments.filter(p => parseFloat(String(p.amount || 0)) > 0)) {
            const amount = parseFloat(String(payment.amount)) || 0;
            console.log(`💰 Processing payment ${payment.id}: amount=${amount}`);
            
            // If commission fields are missing, calculate them
            let gstAmount = parseFloat(String(payment.gst_amount)) || 0;
            let platformCommission = parseFloat(String(payment.platform_commission)) || 0;
            let authorEarnings = parseFloat(String(payment.author_earnings)) || 0;
            
            console.log(`💰 Stored values: GST=${gstAmount}, Commission=${platformCommission}, Earnings=${authorEarnings}`);
            
            // Only calculate if amount > 0 and fields are missing
            if (amount > 0 && (gstAmount === 0 || platformCommission === 0 || authorEarnings === 0)) {
              console.log(`💰 Calculating missing values for payment ${payment.id}...`);
              // GST calculation: 18% of gross amount
              gstAmount = parseFloat((amount * 0.18).toFixed(2));
              // Net amount after GST
              const netAmount = parseFloat((amount - gstAmount).toFixed(2));
              // Platform commission: 30% of net amount
              platformCommission = parseFloat((netAmount * 0.30).toFixed(2));
              // Author earnings: 70% of net amount
              authorEarnings = parseFloat((netAmount * 0.70).toFixed(2));
              console.log(`💰 Calculated: GST=${gstAmount}, Net=${netAmount}, Commission=${platformCommission}, Earnings=${authorEarnings}`);
            }
            
            totalPlatformCommission += platformCommission;
            totalGST += gstAmount;
            totalAuthorEarnings += authorEarnings;
          
            console.log(`💰 Running totals: Commission=${totalPlatformCommission}, GST=${totalGST}, Earnings=${totalAuthorEarnings}`);
          }
          
          console.log('📊 ========================================');
          console.log('📊 FINAL CALCULATED TOTALS:');
          console.log('📊 ========================================');
          console.log('📊 Total Payments:', bookPayments.length);
          console.log('📊 Total Revenue:', totalRevenue);
          console.log('📊 Total Platform Commission:', totalPlatformCommission);
          console.log('📊 Total GST:', totalGST);
          console.log('📊 Total Author Earnings:', totalAuthorEarnings);
          console.log('📊 ========================================');
          
          // Calculate author revenue (group by author) - use author_earnings from payments
          // Only process payments with amount > 0
          const authorRevenueMap = new Map();
          for (const payment of bookPayments.filter(p => parseFloat(String(p.amount || 0)) > 0)) {
            const amount = parseFloat(String(payment.amount)) || 0;
            if (amount > 0) {
              // Calculate author earnings (use stored value or calculate)
              let authorEarnings = parseFloat(String(payment.author_earnings)) || 0;
              if (authorEarnings === 0 && amount > 0) {
                // Calculate on the fly if missing
                const gstAmount = parseFloat((amount * 0.18).toFixed(2));
                const netAmount = parseFloat((amount - gstAmount).toFixed(2));
                authorEarnings = parseFloat((netAmount * 0.70).toFixed(2));
              }
              
              if (authorEarnings > 0) {
                // Get author_id from payment or from book/audio_book
                let authorId = payment.author_id || null;
                if (!authorId) {
                  if (payment.book_id) {
                    const { data: book } = await supabase
                      .from('books')
                      .select('author_id')
                      .eq('id', payment.book_id)
                      .single();
                    authorId = book?.author_id;
                  } else if (payment.audio_book_id) {
                    const { data: audioBook } = await supabase
                      .from('audio_books')
                      .select('author_id')
                      .eq('id', payment.audio_book_id)
                      .single();
                    authorId = audioBook?.author_id;
                  }
                }
                
                if (authorId) {
                  const current = authorRevenueMap.get(authorId) || 0;
                  authorRevenueMap.set(authorId, current + authorEarnings);
                }
              }
            }
          }
          
          // Convert map to array and get author names
          const authorIds = Array.from(authorRevenueMap.keys());
          if (authorIds.length > 0) {
            const { data: authors } = await supabase
              .from('authors')
              .select('id, name')
              .in('id', authorIds);
            
            if (authors) {
              const authorNameMap = new Map(authors.map(a => [a.id, a.name]));
              for (const [authorId, revenue] of authorRevenueMap.entries()) {
                authorRevenue.push({
                  authorId,
                  authorName: authorNameMap.get(authorId) || 'Unknown',
                  revenue: revenue,
                });
              }
              
              // Sort by revenue descending
              authorRevenue.sort((a, b) => b.revenue - a.revenue);
            }
          }
        }
      }
    } catch (paymentsError) {
      console.error('❌ ========================================');
      console.error('❌ ERROR IN PAYMENTS TRY-CATCH BLOCK:');
      console.error('❌ ========================================');
      console.error('❌ Error:', paymentsError);
      console.error('❌ Error message:', paymentsError instanceof Error ? paymentsError.message : String(paymentsError));
      console.error('❌ Error stack:', paymentsError instanceof Error ? paymentsError.stack : 'N/A');
      console.error('❌ ========================================');
      // Continue with default values
    }

    // Calculate platform profit (commission - GST is already deducted from gross)
    const platformProfit = totalPlatformCommission;

    const response = {
      totalBooks: totalBooks || 0,
      totalAudioBooks: totalAudioBooks || 0,
      totalAuthors: totalAuthors || 0,
      totalUsers: totalUsers || 0,
      totalRevenue,
      totalPayments,
      totalPlatformCommission,
      totalGST,
      totalAuthorEarnings,
      platformProfit,
      pendingBooks: pendingBooks || 0,
      pendingAudioBooks: pendingAudioBooks || 0,
      activeUsers: activeUsers || 0,
      authorRevenue,
    };

    console.log('📊 ========================================');
    console.log('📊 FINAL RESPONSE:');
    console.log('📊 ========================================');
    console.log('📊 Response JSON:', JSON.stringify(response, null, 2));
    console.log('📊 ========================================');
    console.log('📊 DASHBOARD PAYMENTS DEBUG END');
    console.log('📊 ========================================');

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in GET /api/dashboard:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


