-- Reviews and Ratings table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  likes INTEGER DEFAULT 0,
  dislikes INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false, -- User has purchased the book
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (book_id, user_id) -- A user can only review a book once
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reviews_book ON reviews(book_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created ON reviews(created_at DESC);

-- Function to update book rating and reviews_count when a review is added/updated/deleted
CREATE OR REPLACE FUNCTION update_book_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Update book's average rating and reviews count
  UPDATE books
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM reviews
      WHERE book_id = COALESCE(NEW.book_id, OLD.book_id)
    ),
    reviews_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE book_id = COALESCE(NEW.book_id, OLD.book_id)
    )
  WHERE id = COALESCE(NEW.book_id, OLD.book_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Trigger to update book rating on review insert/update/delete
DROP TRIGGER IF EXISTS trg_update_book_rating_insert ON reviews;
CREATE TRIGGER trg_update_book_rating_insert
AFTER INSERT ON reviews
FOR EACH ROW EXECUTE FUNCTION update_book_rating();

DROP TRIGGER IF EXISTS trg_update_book_rating_update ON reviews;
CREATE TRIGGER trg_update_book_rating_update
AFTER UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_book_rating();

DROP TRIGGER IF EXISTS trg_update_book_rating_delete ON reviews;
CREATE TRIGGER trg_update_book_rating_delete
AFTER DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_book_rating();

-- Function to update updated_at timestamp for reviews
DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

