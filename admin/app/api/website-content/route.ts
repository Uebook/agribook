import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/client';

function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(),
  });
}

// GET /api/website-content - Get website content
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data, error } = await supabase
      .from('website_content')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      console.error('❌ Error fetching website content:', error);
      // Return default content if table doesn't exist yet
      return NextResponse.json(
        {
          id: null,
          logo_url: null,
          logo_text: 'Agribook',
          hero_title: 'Your Agricultural Knowledge Hub',
          hero_subtitle: 'Discover thousands of eBooks, audiobooks, and expert resources to transform your farming practices',
          hero_image_url: null,
          hero_button_1_text: 'Explore Books',
          hero_button_1_link: '#books',
          hero_button_2_text: 'Learn More',
          hero_button_2_link: '#features',
          stat_books: 500,
          stat_authors: 50,
          stat_readers: 10000,
          features_title: 'Why Choose Agribook?',
          features_subtitle: 'Everything you need to grow your agricultural knowledge',
          features: [],
          categories_title: 'Explore Categories',
          categories_subtitle: 'Find books in your area of interest',
          featured_category_ids: [],
          books_title: 'Featured Books',
          books_subtitle: 'Discover our most popular agricultural books',
          featured_book_ids: [],
          authors_title: 'Meet Our Authors',
          authors_subtitle: 'Learn from agricultural experts and industry leaders',
          featured_author_ids: [],
          statistics: [],
          about_title: 'About Agribook',
          about_description: null,
          about_image_url: null,
          about_features: [],
          cta_title: 'Start Your Agricultural Journey Today',
          cta_subtitle: 'Join thousands of farmers and agricultural enthusiasts learning and growing with Agribook',
          cta_button_1_text: 'Explore Books',
          cta_button_1_link: '#books',
          cta_button_2_text: 'Learn More',
          cta_button_2_link: '#features',
          footer_description: 'Your trusted partner in agricultural knowledge and growth.',
          footer_email: 'info@agribook.com',
          footer_phone: '+91 98765 43210',
          footer_support_email: 'support@agribook.com',
          footer_copyright: '© 2024 Agribook. All rights reserved.',
          navigation_links: [],
          footer_quick_links: [],
          footer_categories: [],
          android_app_url: null,
          ios_app_url: null,
          meta_title: 'Agribook - Your Agricultural Knowledge Hub',
          meta_description: 'Discover thousands of agricultural eBooks, audiobooks, and resources. Learn from experts and grow your farming knowledge.',
        },
        { status: 200, headers: getCorsHeaders() }
      );
    }
    
    const response = NextResponse.json(data || {}, { headers: getCorsHeaders() });
    return response;
  } catch (error: any) {
    console.error('❌ Error in GET /api/website-content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch website content', details: error.message },
      { status: 500, headers: getCorsHeaders() }
    );
  }
}

// PUT /api/website-content - Update website content
export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await request.json();
    
    // First, check if any content exists
    const { data: existing } = await supabase
      .from('website_content')
      .select('id')
      .limit(1)
      .single();
    
    const updateData = {
      ...body,
      updated_at: new Date().toISOString(),
    };
    
    let result;
    if (existing?.id) {
      // Update existing
      const { data, error } = await supabase
        .from('website_content')
        .update(updateData)
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      // Create new
      const { data, error } = await supabase
        .from('website_content')
        .insert(updateData)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    }
    
    return NextResponse.json(result, { headers: getCorsHeaders() });
  } catch (error: any) {
    console.error('❌ Error updating website content:', error);
    return NextResponse.json(
      { error: 'Failed to update website content', details: error.message },
      { status: 500, headers: getCorsHeaders() }
    );
  }
}
