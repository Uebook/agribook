/**
 * Local test for /api/books endpoint
 * Tests both JSON and FormData requests
 */

const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const API_URL = process.env.API_URL || 'http://localhost:3000';

async function testBooksAPI() {
  console.log('🧪 Testing /api/books API Endpoint\n');
  console.log('='.repeat(60));
  console.log('API URL:', API_URL);
  console.log('='.repeat(60));
  console.log('\n');

  // Test 1: OPTIONS request (CORS preflight)
  console.log('📋 Test 1: OPTIONS request (CORS preflight)...');
  try {
    const optionsResponse = await fetch(`${API_URL}/api/books`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'POST',
      },
    });
    console.log('✅ OPTIONS Status:', optionsResponse.status);
    console.log('✅ CORS Headers:', {
      'Access-Control-Allow-Origin': optionsResponse.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': optionsResponse.headers.get('Access-Control-Allow-Methods'),
    });
  } catch (error) {
    console.error('❌ OPTIONS failed:', error.message);
  }
  console.log('\n');

  // Test 2: JSON request (metadata only, no files)
  console.log('📋 Test 2: JSON request (metadata only)...');
  try {
    const jsonData = {
      title: 'Test Book - JSON Only',
      author_id: 'test-author-123',
      summary: 'This is a test book using JSON format',
      price: 199,
      original_price: 199,
      language: 'English',
      category_id: 'test-category-123',
      is_free: false,
      published_date: new Date().toISOString(),
    };

    const jsonResponse = await fetch(`${API_URL}/api/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData),
    });

    const jsonResponseText = await jsonResponse.text();
    console.log('📥 JSON Response Status:', jsonResponse.status, jsonResponse.statusText);
    console.log('📥 JSON Response:', jsonResponseText.substring(0, 300));

    if (jsonResponse.ok) {
      const result = JSON.parse(jsonResponseText);
      console.log('✅ JSON request successful!');
      console.log('   Book ID:', result.book?.id);
      console.log('   Title:', result.book?.title);
    } else {
      console.log('❌ JSON request failed');
      try {
        const error = JSON.parse(jsonResponseText);
        console.log('   Error:', error.error);
      } catch (e) {
        console.log('   Raw error:', jsonResponseText);
      }
    }
  } catch (error) {
    console.error('❌ JSON request error:', error.message);
  }
  console.log('\n');

  // Test 3: FormData request (metadata only, no files)
  console.log('📋 Test 3: FormData request (metadata only, no files)...');
  try {
    const formData = new FormData();
    formData.append('title', 'Test Book - FormData Only');
    formData.append('author_id', 'test-author-123');
    formData.append('summary', 'This is a test book using FormData format');
    formData.append('price', '299');
    formData.append('original_price', '299');
    formData.append('language', 'English');
    formData.append('category_id', 'test-category-123');
    formData.append('is_free', 'false');
    formData.append('published_date', new Date().toISOString());

    const formDataResponse = await fetch(`${API_URL}/api/books`, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders(),
    });

    const formDataResponseText = await formDataResponse.text();
    console.log('📥 FormData Response Status:', formDataResponse.status, formDataResponse.statusText);
    console.log('📥 FormData Response:', formDataResponseText.substring(0, 300));

    if (formDataResponse.ok) {
      const result = JSON.parse(formDataResponseText);
      console.log('✅ FormData request successful!');
      console.log('   Book ID:', result.book?.id);
      console.log('   Title:', result.book?.title);
    } else {
      console.log('❌ FormData request failed');
      try {
        const error = JSON.parse(formDataResponseText);
        console.log('   Error:', error.error);
        console.log('   Details:', error.details);
      } catch (e) {
        console.log('   Raw error:', formDataResponseText);
      }
    }
  } catch (error) {
    console.error('❌ FormData request error:', error.message);
    console.error('   Stack:', error.stack);
  }
  console.log('\n');

  // Test 4: FormData with files (if test files exist)
  const testImagePath = path.join(__dirname, 'test-files', 'test.jpg');
  const testPdfPath = path.join(__dirname, 'test-files', 'test.pdf');

  if (fs.existsSync(testImagePath) && fs.existsSync(testPdfPath)) {
    console.log('📋 Test 4: FormData request with files...');
    try {
      const formDataWithFiles = new FormData();
      formDataWithFiles.append('title', 'Test Book - With Files');
      formDataWithFiles.append('author_id', 'test-author-123');
      formDataWithFiles.append('summary', 'This is a test book with files');
      formDataWithFiles.append('price', '399');
      formDataWithFiles.append('original_price', '399');
      formDataWithFiles.append('language', 'English');
      formDataWithFiles.append('category_id', 'test-category-123');
      formDataWithFiles.append('is_free', 'false');
      formDataWithFiles.append('published_date', new Date().toISOString());

      formDataWithFiles.append('coverImage', fs.createReadStream(testImagePath), {
        filename: 'test.jpg',
        contentType: 'image/jpeg',
      });
      formDataWithFiles.append('pdfFile', fs.createReadStream(testPdfPath), {
        filename: 'test.pdf',
        contentType: 'application/pdf',
      });

      const filesResponse = await fetch(`${API_URL}/api/books`, {
        method: 'POST',
        body: formDataWithFiles,
        headers: formDataWithFiles.getHeaders(),
      });

      const filesResponseText = await filesResponse.text();
      console.log('📥 Files Response Status:', filesResponse.status, filesResponse.statusText);
      console.log('📥 Files Response:', filesResponseText.substring(0, 300));

      if (filesResponse.ok) {
        const result = JSON.parse(filesResponseText);
        console.log('✅ FormData with files successful!');
        console.log('   Book ID:', result.book?.id);
        console.log('   Title:', result.book?.title);
        console.log('   Cover Image URL:', result.book?.cover_image_url ? 'Yes' : 'No');
        console.log('   PDF URL:', result.book?.pdf_url ? 'Yes' : 'No');
      } else {
        console.log('❌ FormData with files failed');
        try {
          const error = JSON.parse(filesResponseText);
          console.log('   Error:', error.error);
          console.log('   Details:', error.details);
        } catch (e) {
          console.log('   Raw error:', filesResponseText);
        }
      }
    } catch (error) {
      console.error('❌ FormData with files error:', error.message);
    }
  } else {
    console.log('⏭️  Test 4: Skipped (test files not found)');
    console.log('   Create test-files/test.jpg and test-files/test.pdf to test file uploads');
  }

  console.log('\n');
  console.log('='.repeat(60));
  console.log('✅ All tests completed!');
  console.log('='.repeat(60));
}

// Run tests
testBooksAPI().catch(console.error);
