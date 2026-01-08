# Postman Test Configuration for Upload API

## Endpoint Details

**URL:** `https://admin-orcin-omega.vercel.app/api/upload`

**Method:** `POST`

**Content-Type:** `multipart/form-data` (Postman will set this automatically)

---

## Headers

No custom headers needed. Postman will automatically set:
- `Content-Type: multipart/form-data; boundary=...`
- `Accept: */*` (optional, but recommended)

---

## Body (Form-Data)

Select **"form-data"** in Postman body tab, then add these fields:

| Key | Type | Value | Required |
|-----|------|-------|----------|
| `file` | **File** | Select a file (PDF, image, etc.) | ✅ Yes |
| `fileName` | Text | `test.pdf` (or your file name) | ✅ Yes |
| `fileType` | Text | `application/pdf` (or appropriate MIME type) | ✅ Yes |
| `bucket` | Text | `books` | ✅ Yes |
| `folder` | Text | `pdfs` (or `covers`, `audio`) | ❌ Optional |
| `author_id` | Text | `test123` (or actual user ID) | ❌ Optional |

---

## Example Values

### For PDF Upload:
```
file: [Select File] test.pdf
fileName: test.pdf
fileType: application/pdf
bucket: books
folder: pdfs
author_id: test123
```

### For Image Upload:
```
file: [Select File] cover.jpg
fileName: cover.jpg
fileType: image/jpeg
bucket: books
folder: covers
author_id: test123
```

### For Audio Upload:
```
file: [Select File] audio.mp3
fileName: audio.mp3
fileType: audio/mpeg
bucket: audio-books
folder: audio
author_id: test123
```

---

## Expected Success Response

**Status Code:** `200 OK`

**Response Body:**
```json
{
  "success": true,
  "path": "pdfs/test123/1767873149736-test.pdf",
  "url": "https://isndoxsyjbdzibhkrisj.supabase.co/storage/v1/object/sign/books/pdfs/test123/1767873149736-test.pdf?token=...",
  "publicUrl": "https://isndoxsyjbdzibhkrisj.supabase.co/storage/v1/object/public/books/pdfs/test123/1767873149736-test.pdf",
  "signedUrl": "https://isndoxsyjbdzibhkrisj.supabase.co/storage/v1/object/sign/books/pdfs/test123/1767873149736-test.pdf?token=..."
}
```

---

## Expected Error Responses

### Missing File:
**Status Code:** `400 Bad Request`
```json
{
  "error": "Missing file or bucket",
  "details": {
    "hasFile": false,
    "bucket": "books"
  }
}
```

### Missing Bucket:
**Status Code:** `400 Bad Request`
```json
{
  "error": "Missing file or bucket"
}
```

### Invalid Bucket:
**Status Code:** `500 Internal Server Error`
```json
{
  "error": "Bucket \"invalid-bucket\" not found. Please create the bucket in Supabase Storage."
}
```

---

## Step-by-Step Postman Setup

1. **Open Postman** and create a new request
2. **Set Method** to `POST`
3. **Enter URL:** `https://admin-orcin-omega.vercel.app/api/upload`
4. **Go to Body tab**
5. **Select "form-data"** (not "x-www-form-urlencoded")
6. **Add fields:**
   - Click "Select Files" next to `file` key
   - Choose a test file (PDF, image, etc.)
   - Add other fields as text
7. **Click Send**

---

## Test CORS (Optional)

**Method:** `OPTIONS`

**URL:** `https://admin-orcin-omega.vercel.app/api/upload`

**Headers:** None needed

**Expected Response:**
- Status: `200 OK`
- Headers should include:
  - `access-control-allow-origin: *`
  - `access-control-allow-methods: GET, POST, PUT, DELETE, OPTIONS`

---

## Quick Test cURL Command

```bash
curl -X POST https://admin-orcin-omega.vercel.app/api/upload \
  -F "file=@/path/to/your/file.pdf" \
  -F "fileName=test.pdf" \
  -F "fileType=application/pdf" \
  -F "bucket=books" \
  -F "folder=pdfs" \
  -F "author_id=test123"
```

---

## Notes

- The API supports CORS from any origin (`*`)
- File size limits depend on Vercel and Supabase configuration
- The `author_id` parameter is optional but recommended for organizing files
- The `folder` parameter helps organize files in the bucket
- Response includes both `publicUrl` and `signedUrl` for flexibility
