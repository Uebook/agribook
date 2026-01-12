/**
 * Test Book Upload API
 * Tests the single API endpoint that accepts FormData with files and metadata
 */

const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const baseUrl = process.env.API_URL || 'https://admin-orcin-omega.vercel.app';

async function testBookUpload() {
  console.log('🧪 Testing Book Upload API (Single API Call)\n');
  console.log('Base URL:', baseUrl);
  console.log('Endpoint: POST /api/books\n');

  // Test data
  const testAuthorId = 'test-author-123';
  const testCategoryId = 'test-category-123'; // You'll need to use a real category ID

  // Paths to test files (adjust these paths)
  const testImagePath = path.join(__dirname, 'test-files', 'test.jpg');
  const testPdfPath = path.join(__dirname, 'test-files', 'test.pdf');

  try {
    // Test 1: Upload book with cover image and PDF (FormData)
    console.log('📚 Test 1: Upload book with cover image and PDF (FormData)...\n');
    
    const formData = new FormData();
    
    // Add metadata
    formData.append('title', 'Test Book - Single API Call');
    formData.append('author_id', testAuthorId);
    formData.append('summary', 'This is a test book uploaded using the new single API endpoint');
    formData.append('price', '299');
    formData.append('original_price', '299');
    formData.append('pages', '250');
    formData.append('language', 'English');
    formData.append('category_id', testCategoryId);
    formData.append('isbn', '978-test-123');
    formData.append('is_free', 'false');
    formData.append('published_date', new Date().toISOString());
    
    // Add cover image if file exists
    if (fs.existsSync(testImagePath)) {
      formData.append('coverImage', fs.createReadStream(testImagePath), {
        filename: 'test-cover.jpg',
        contentType: 'image/jpeg',
      });
      console.log('✅ Added cover image to FormData');
    } else {
      console.log('⚠️ Cover image file not found, skipping...');
    }
    
    // Add PDF if file exists
    if (fs.existsSync(testPdfPath)) {
      formData.append('pdfFile', fs.createReadStream(testPdfPath), {
        filename: 'test-book.pdf',
        contentType: 'application/pdf',
      });
      console.log('✅ Added PDF to FormData');
    } else {
      console.log('⚠️ PDF file not found, skipping...');
    }
    
    console.log('\n📤 Sending request to:', `${baseUrl}/api/books`);
    console.log('Content-Type:', formData.getHeaders()['content-type']);
    
    const response = await fetch(`${baseUrl}/api/books`, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders(),
    });
    
    const responseText = await response.text();
    console.log('\n📥 Response Status:', response.status, response.statusText);
    console.log('📥 Response Body:', responseText.substring(0, 500));
    
    if (response.ok) {
      const result = JSON.parse(responseText);
      console.log('\n✅ Book upload successful!');
      console.log('Book ID:', result.book?.id);
      console.log('Title:', result.book?.title);
      console.log('Cover Image URL:', result.book?.cover_image_url ? `${result.book.cover_image_url.substring(0, 50)}...` : 'None');
      console.log('PDF URL:', result.book?.pdf_url ? `${result.book.pdf_url.substring(0, 50)}...` : 'None');
    } else {
      console.log('\n❌ Book upload failed');
      try {
        const error = JSON.parse(responseText);
        console.log('Error:', error.error);
        console.log('Details:', error.details);
      } catch (e) {
        console.log('Error response:', responseText);
      }
    }
    
    // Test 2: Upload book without files (metadata only)
    console.log('\n\n📚 Test 2: Upload book without files (metadata only)...\n');
    
    const formData2 = new FormData();
    formData2.append('title', 'Test Book - No Files');
    formData2.append('author_id', testAuthorId);
    formData2.append('summary', 'This is a test book without files');
    formData2.append('price', '199');
    formData2.append('original_price', '199');
    formData2.append('language', 'English');
    formData2.append('category_id', testCategoryId);
    formData2.append('is_free', 'false');
    formData2.append('published_date', new Date().toISOString());
    
    const response2 = await fetch(`${baseUrl}/api/books`, {
      method: 'POST',
      body: formData2,
      headers: formData2.getHeaders(),
    });
    
    const responseText2 = await response2.text();
    console.log('📥 Response Status:', response2.status, response2.statusText);
    console.log('📥 Response Body:', responseText2.substring(0, 500));
    
    if (response2.ok) {
      const result2 = JSON.parse(responseText2);
      console.log('\n✅ Book upload successful (no files)!');
      console.log('Book ID:', result2.book?.id);
      console.log('Title:', result2.book?.title);
    } else {
      console.log('\n❌ Book upload failed');
    }
    
    // Test 3: Upload book with JSON (backward compatibility)
    console.log('\n\n📚 Test 3: Upload book with JSON (backward compatibility)...\n');
    
    const jsonData = {
      title: 'Test Book - JSON Format',
      author_id: testAuthorId,
      summary: 'This is a test book using JSON format',
      price: 149,
      original_price: 149,
      language: 'English',
      category_id: testCategoryId,
      is_free: false,
      published_date: new Date().toISOString(),
    };
    
    const response3 = await fetch(`${baseUrl}/api/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData),
    });
    
    const responseText3 = await response3.text();
    console.log('📥 Response Status:', response3.status, response3.statusText);
    console.log('📥 Response Body:', responseText3.substring(0, 500));
    
    if (response3.ok) {
      const result3 = JSON.parse(responseText3);
      console.log('\n✅ Book upload successful (JSON)!');
      console.log('Book ID:', result3.book?.id);
      console.log('Title:', result3.book?.title);
    } else {
      console.log('\n❌ Book upload failed');
    }
    
    console.log('\n\n✅ All tests completed!');
    
  } catch (error) {
    console.error('\n❌ Test error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
    });
  }
}

// Run tests
testBookUpload();
