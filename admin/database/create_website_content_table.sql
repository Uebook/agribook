-- Website Content Management Table
-- Stores all editable website content including logo, hero text, features, stats, etc.

CREATE TABLE IF NOT EXISTS website_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Logo and Branding
  logo_url TEXT,
  logo_text VARCHAR(255) DEFAULT 'Agribook',
  logo_icon VARCHAR(10) DEFAULT '🌾',
  
  -- Hero Section
  hero_title TEXT DEFAULT 'Your Agricultural Knowledge Hub',
  hero_subtitle TEXT DEFAULT 'Discover thousands of eBooks, audiobooks, and expert resources to transform your farming practices',
  hero_image_url TEXT,
  hero_button_1_text VARCHAR(100) DEFAULT 'Explore Books',
  hero_button_1_link VARCHAR(255) DEFAULT '#books',
  hero_button_2_text VARCHAR(100) DEFAULT 'Learn More',
  hero_button_2_link VARCHAR(255) DEFAULT '#features',
  
  -- Statistics (Hero Section)
  stat_books INTEGER DEFAULT 500,
  stat_authors INTEGER DEFAULT 50,
  stat_readers INTEGER DEFAULT 10000,
  
  -- Features Section
  features_title VARCHAR(255) DEFAULT 'Why Choose Agribook?',
  features_subtitle TEXT DEFAULT 'Everything you need to grow your agricultural knowledge',
  features JSONB DEFAULT '[]', -- Array of feature objects
  
  -- Categories Section
  categories_title VARCHAR(255) DEFAULT 'Explore Categories',
  categories_subtitle TEXT DEFAULT 'Find books in your area of interest',
  
  -- Books Section
  books_title VARCHAR(255) DEFAULT 'Featured Books',
  books_subtitle TEXT DEFAULT 'Discover our most popular agricultural books',
  featured_book_ids UUID[], -- Array of book IDs to display
  
  -- Authors Section
  authors_title VARCHAR(255) DEFAULT 'Meet Our Authors',
  authors_subtitle TEXT DEFAULT 'Learn from agricultural experts and industry leaders',
  featured_author_ids UUID[], -- Array of author IDs to display
  
  -- Statistics Section
  statistics JSONB DEFAULT '[]', -- Array of stat objects
  
  -- About Section
  about_title VARCHAR(255) DEFAULT 'About Agribook',
  about_description TEXT,
  about_image_url TEXT,
  about_features JSONB DEFAULT '[]', -- Array of feature strings
  
  -- CTA Section
  cta_title TEXT DEFAULT 'Start Your Agricultural Journey Today',
  cta_subtitle TEXT DEFAULT 'Join thousands of farmers and agricultural enthusiasts learning and growing with Agribook',
  cta_button_1_text VARCHAR(100) DEFAULT 'Explore Books',
  cta_button_1_link VARCHAR(255) DEFAULT '#books',
  cta_button_2_text VARCHAR(100) DEFAULT 'Learn More',
  cta_button_2_link VARCHAR(255) DEFAULT '#features',
  
  -- Footer
  footer_description TEXT DEFAULT 'Your trusted partner in agricultural knowledge and growth.',
  footer_email VARCHAR(255) DEFAULT 'info@agribook.com',
  footer_phone VARCHAR(50) DEFAULT '+91 98765 43210',
  footer_support_email VARCHAR(255) DEFAULT 'support@agribook.com',
  footer_copyright TEXT DEFAULT '© 2024 Agribook. All rights reserved.',
  
  -- App Download Links
  android_app_url TEXT,
  ios_app_url TEXT,
  
  -- Meta Information
  meta_title VARCHAR(255) DEFAULT 'Agribook - Your Agricultural Knowledge Hub',
  meta_description TEXT DEFAULT 'Discover thousands of agricultural eBooks, audiobooks, and resources. Learn from experts and grow your farming knowledge.',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create a single row with default values
INSERT INTO website_content (id) 
VALUES (gen_random_uuid())
ON CONFLICT DO NOTHING;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_website_content_updated ON website_content(updated_at DESC);
