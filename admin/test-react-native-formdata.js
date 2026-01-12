/**
 * Test that simulates React Native FormData format
 * React Native FormData uses a different format than Node.js FormData
 */

// Simulate React Native FormData structure
class ReactNativeFormData {
  constructor() {
    this._parts = [];
  }

  append(key, value) {
    if (typeof value === 'object' && value.uri) {
      // React Native file format
      this._parts.push([key, value]);
    } else {
      // Regular string value
      this._parts.push([key, String(value)]);
    }
  }

  getParts() {
    return this._parts;
  }
}

async function testReactNativeFormData() {
  console.log('🧪 Testing React Native FormData Simulation\n');
  console.log('='.repeat(60));
  
  // Simulate what React Native sends
  const formData = new ReactNativeFormData();
  
  // Add metadata (strings)
  formData.append('title', 'Test Book - React Native Format');
  formData.append('author_id', 'test-author-123');
  formData.append('summary', 'This simulates React Native FormData');
  formData.append('price', '299');
  formData.append('language', 'English');
  formData.append('category_id', 'test-category-123');
  formData.append('is_free', 'false');
  
  // Add file (React Native format - object with uri, type, name)
  formData.append('coverImage', {
    uri: 'file:///path/to/image.jpg',
    type: 'image/jpeg',
    name: 'cover.jpg',
  });
  
  console.log('📦 Simulated React Native FormData:');
  console.log('   Parts:', formData.getParts().length);
  formData.getParts().forEach(([key, value]) => {
    if (typeof value === 'object' && value.uri) {
      console.log(`   - ${key}: { uri: "${value.uri}", type: "${value.type}", name: "${value.name}" }`);
    } else {
      console.log(`   - ${key}: "${value}"`);
    }
  });
  
  console.log('\n✅ React Native FormData structure simulated');
  console.log('\n📝 Note: This is how React Native sends FormData to the server.');
  console.log('   The server should receive this as multipart/form-data.');
  console.log('   Files with {uri, type, name} format need special handling.');
  
  console.log('\n' + '='.repeat(60));
}

testReactNativeFormData();
