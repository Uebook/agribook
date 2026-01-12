# Postman Test Guide for File Upload API

## Test the Upload API Endpoint

### Endpoint Details
- **URL**: `https://admin-orcin-omega.vercel.app/api/upload`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`

---

## Test 1: Profile Image Upload (Avatar)

### Request Setup:
1. **Method**: `POST`
2. **URL**: `https://admin-orcin-omega.vercel.app/api/upload`
3. **Body Type**: `form-data` (not raw JSON)

### Form Data Fields:
Add these key-value pairs in Postman:

| Key | Type | Value | Required |
|-----|------|-------|----------|
| `file` | File | Select an image file (JPG/PNG) | ✅ Yes |
| `fileName` | Text | `avatar.jpg` | ✅ Yes |
| `fileType` | Text | `image/jpeg` | ✅ Yes |
| `bucket` | Text | `avatars` | ✅ Yes |
| `folder` | Text | `users` | ✅ Yes |
| `author_id` | Text | `user-uuid-here` | ⚠️ Optional |

**Note**: `author_id` is optional but recommended. When provided:
- Files are organized in folders: `users/{author_id}/{timestamp}-avatar.jpg`
- Makes it easier to identify which user's file it is
- Helps with cleanup and organization

### Steps in Postman:
1. Open Postman
2. Create new request
3. Set method to **POST**
4. Enter URL: `https://admin-orcin-omega.vercel.app/api/upload`
5. Go to **Body** tab
6. Select **form-data** (not raw)
7. Add the fields above:
   - For `file`: Click dropdown next to key, select **File**, then click **Select Files** and choose an image
   - For other fields: Keep as **Text** and enter the values
8. Click **Send**

### Expected Response (Success):
```json
{
  "success": true,
  "url": "https://[supabase-url]/storage/v1/object/public/avatars/users/...",
  "path": "users/1234567890-avatar.jpg",
  "publicUrl": "...",
  "signedUrl": "..."
}
```

### Expected Response (Error):
```json
{
  "error": "Error message here"
}
```

---

## Test 2: Book Cover Image Upload

### Request Setup:
1. **Method**: `POST`
2. **URL**: `https://admin-orcin-omega.vercel.app/api/upload`
3. **Body Type**: `form-data`

### Form Data Fields:

| Key | Type | Value | Required |
|-----|------|-------|----------|
| `file` | File | Select an image file (JPG/PNG) | ✅ Yes |
| `fileName` | Text | `cover.jpg` | ✅ Yes |
| `fileType` | Text | `image/jpeg` | ✅ Yes |
| `bucket` | Text | `books` | ✅ Yes |
| `folder` | Text | `covers` | ✅ Yes |
| `author_id` | Text | `user-uuid-here` | ⚠️ Optional |

**Note**: `author_id` organizes files as: `covers/{author_id}/{timestamp}-cover.jpg`

### Steps:
Same as Test 1, but use the values above.

---

## Test 3: PDF Upload

### Form Data Fields:

| Key | Type | Value | Required |
|-----|------|-------|----------|
| `file` | File | Select a PDF file | ✅ Yes |
| `fileName` | Text | `book.pdf` | ✅ Yes |
| `fileType` | Text | `application/pdf` | ✅ Yes |
| `bucket` | Text | `books` | ✅ Yes |
| `folder` | Text | `pdfs` | ✅ Yes |
| `author_id` | Text | `user-uuid-here` | ⚠️ Optional |

---

## Troubleshooting

### If you get "Network Error":
- Check if the URL is correct: `https://admin-orcin-omega.vercel.app/api/upload`
- Make sure you're using `form-data` (not `raw` JSON)
- Verify the file is selected correctly

### If you get "Bucket not found":
- Go to Supabase Dashboard → Storage → Buckets
- Create the bucket if it doesn't exist:
  - `avatars` (for profile images)
  - `books` (for book covers and PDFs)

### If you get "Permission denied":
- Check Supabase bucket permissions
- Make sure the bucket allows uploads

### If you get "CORS error":
- The API should have CORS headers configured
- If not, check the `/api/upload/route.ts` file

---

## Quick Test with cURL

### Profile Image:
```bash
curl -X POST https://admin-orcin-omega.vercel.app/api/upload \
  -F "file=@/path/to/your/image.jpg" \
  -F "fileName=avatar.jpg" \
  -F "fileType=image/jpeg" \
  -F "bucket=avatars" \
  -F "folder=users"
```

### Book Cover:
```bash
curl -X POST https://admin-orcin-omega.vercel.app/api/upload \
  -F "file=@/path/to/your/cover.jpg" \
  -F "fileName=cover.jpg" \
  -F "fileType=image/jpeg" \
  -F "bucket=books" \
  -F "folder=covers"
```

---

## Expected Response Format

### Success:
```json
{
  "success": true,
  "url": "https://[supabase-url]/storage/v1/object/public/books/covers/1234567890-cover.jpg",
  "path": "covers/1234567890-cover.jpg",
  "publicUrl": "https://[supabase-url]/storage/v1/object/public/books/covers/1234567890-cover.jpg",
  "signedUrl": "https://[supabase-url]/storage/v1/object/sign/books/covers/1234567890-cover.jpg?token=..."
}
```

### Error:
```json
{
  "error": "Error message describing what went wrong"
}
```

---

## How User Identification Works

### File Path Structure

When you upload with `author_id`, files are organized like this:

**With author_id:**
```
users/{author_id}/{timestamp}-avatar.jpg
covers/{author_id}/{timestamp}-cover.jpg
pdfs/{author_id}/{timestamp}-book.pdf
```

**Without author_id:**
```
users/{timestamp}-avatar.jpg
covers/{timestamp}-cover.jpg
pdfs/{timestamp}-book.pdf
```

### How to Identify Which User's File It Is

#### Method 1: Extract from File Path (Recommended)
The file path includes the `author_id`:
```javascript
// Example response:
{
  "path": "users/71264aae-af5c-4b82-bfd7-5f8be47dfec2/1704123456789-avatar.jpg",
  "url": "https://..."
}

// Extract user ID from path:
const path = "users/71264aae-af5c-4b82-bfd7-5f8be47dfec2/1704123456789-avatar.jpg";
const parts = path.split('/');
const userId = parts[1]; // "71264aae-af5c-4b82-bfd7-5f8be47dfec2"
```

#### Method 2: Store URL in User Record
When you get the upload response, save the URL to the user's record:
```javascript
// After upload:
const uploadResult = await uploadFile(...);
const avatarUrl = uploadResult.url;

// Update user record:
await updateUser(userId, { avatar_url: avatarUrl });
```

Then when fetching users:
```javascript
// Fetch user data:
const user = await getUser(userId);
// user.avatar_url contains the full URL
// You can extract author_id from the URL path if needed
```

#### Method 3: Query by URL Pattern
If you need to find which user has a specific file:
```sql
-- In Supabase SQL Editor:
SELECT * FROM users 
WHERE avatar_url LIKE '%/users/{author_id}/%';
```

### Example: Complete Upload Flow

```javascript
// 1. Upload file with author_id
const uploadResult = await apiClient.uploadFile(
  file,
  'avatars',
  'users',
  userId  // This is the author_id
);

// Response:
// {
//   "path": "users/71264aae-af5c-4b82-bfd7-5f8be47dfec2/1704123456789-avatar.jpg",
//   "url": "https://..."
// }

// 2. Save URL to user record
await updateUser(userId, {
  avatar_url: uploadResult.url
});

// 3. When fetching user:
const user = await getUser(userId);
// user.avatar_url = "https://.../users/71264aae-af5c-4b82-bfd7-5f8be47dfec2/..."
// You can verify it belongs to this user by:
// - Checking user.id matches the path
// - Or just using user.avatar_url directly
```

### Verification Checklist

✅ **Best Practice**: Always pass `author_id` when uploading
✅ **Store URL**: Save the returned URL in the user/book record
✅ **Path Verification**: The file path contains the `author_id` for verification
✅ **Database Link**: Link the file URL to the user/book in your database

---

## Notes

1. **File Size**: Make sure files are not too large (recommended: < 10MB for images, < 50MB for PDFs)
2. **File Types**: Supported types:
   - Images: `image/jpeg`, `image/png`, `image/jpg`
   - PDFs: `application/pdf`
3. **Buckets**: Must exist in Supabase Storage before uploading
4. **Folders**: Are created automatically if they don't exist
5. **author_id**: Optional but recommended for better organization and user identification

---

**Last Updated**: Postman test guide for upload API with user identification
