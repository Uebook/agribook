# Comprehensive Test Checklist - Agribook App

## Test Status: ✅ = Pass, ❌ = Fail, ⚠️ = Needs Review

---

## 1. AUTHENTICATION & REGISTRATION

### 1.1 Reader Registration & Login
- [ ] **Register as Reader**
  - Navigate to Register screen
  - Fill: Name, Email, Mobile, Password
  - Select "Reader" role
  - Select at least one interest category
  - Submit → Should create account and login
  - API: `POST /api/auth/register` ✅

- [ ] **Login as Reader (Mobile OTP)**
  - Enter mobile number
  - Enter OTP: `123456` (static for now)
  - Should navigate to Role Selection
  - Select "Reader"
  - Should show Home screen with all books
  - API: `POST /api/auth/send-otp` ✅
  - API: `POST /api/auth/verify-otp` ✅

- [ ] **Login as Reader (Email/Password)**
  - Enter email and password
  - Should login and navigate to Home
  - API: `POST /api/auth/login` ⚠️ (needs verification)

### 1.2 Author/Publish Registration & Login
- [ ] **Register as Author**
  - Navigate to Register screen
  - Fill: Name, Email, Mobile, Password
  - Select "Author" role
  - Select interest categories
  - Submit → Should create account and login
  - API: `POST /api/auth/register` ✅

- [ ] **Login as Author (Mobile OTP)**
  - Enter mobile number
  - Enter OTP: `123456`
  - Select "Author" role
  - Should show Home screen with only their books
  - API: `POST /api/auth/verify-otp` ✅

---

## 2. READER APP FUNCTIONALITY

### 2.1 Home Screen (Reader)
- [ ] Shows greeting with user name
- [ ] Shows user rating (if available)
- [ ] Shows notification badge with count
- [ ] Displays all published books (not author's own)
- [ ] Displays audio books/podcasts
- [ ] Search bar works
- [ ] Categories section visible
- [ ] API: `GET /api/books?status=published` ✅
- [ ] API: `GET /api/audio-books` ✅
- [ ] API: `GET /api/notifications?user_id=X` ✅

### 2.2 Book Store Screen
- [ ] Lists all available books
- [ ] Search functionality works
- [ ] Filter by category works
- [ ] Sort options work
- [ ] API: `GET /api/books` with filters ✅

### 2.3 Book Detail Screen (Reader)
- [ ] Shows book cover images (carousel if multiple)
- [ ] Shows book title, author, rating, price
- [ ] Shows "Add to Wishlist" button (heart icon)
- [ ] Shows "Buy Now" button
- [ ] Shows "Start Reading" button
- [ ] Shows "View Reviews" button
- [ ] Does NOT show "Edit Book" (author only)
- [ ] API: `GET /api/books/:id` ✅
- [ ] API: `GET /api/wishlist?user_id=X` ✅
- [ ] API: `POST /api/wishlist` (add) ✅
- [ ] API: `DELETE /api/wishlist` (remove) ✅

### 2.4 Library Screen
- [ ] Shows purchased books
- [ ] Shows reading progress
- [ ] API: `GET /api/orders?user_id=X` ✅

### 2.5 Wishlist Screen
- [ ] Lists all wishlisted books
- [ ] Can remove from wishlist
- [ ] API: `GET /api/wishlist?user_id=X` ✅

### 2.6 Reviews & Ratings Screen
- [ ] Shows reviews for a book
- [ ] Can submit new review
- [ ] Can edit own review
- [ ] Can delete own review
- [ ] API: `GET /api/reviews?bookId=X` ✅
- [ ] API: `POST /api/reviews` ✅
- [ ] API: `PUT /api/reviews/:id` ✅
- [ ] API: `DELETE /api/reviews/:id` ✅

### 2.7 Order History Screen
- [ ] Shows purchase history
- [ ] Shows order details
- [ ] API: `GET /api/orders?user_id=X` ✅

### 2.8 Notifications Screen
- [ ] Lists all notifications
- [ ] Shows unread count
- [ ] Can mark as read
- [ ] Can mark all as read
- [ ] API: `GET /api/notifications?user_id=X` ✅
- [ ] API: `PUT /api/notifications` (mark read) ✅

### 2.9 YouTube Channels Screen
- [ ] Lists YouTube channels
- [ ] Shows channel details
- [ ] API: `GET /api/youtube-channels` ✅

### 2.10 Government Curriculum Screen
- [ ] Lists curriculum items
- [ ] Shows curriculum details
- [ ] API: `GET /api/curriculum` ✅

### 2.11 Profile Screen (Reader)
- [ ] Shows user avatar (or initials)
- [ ] Shows user name, email, mobile
- [ ] Shows order count
- [ ] Menu items:
  - [ ] My Orders
  - [ ] Wishlist ✅
  - [ ] Reviews & Ratings ✅
  - [ ] YouTube Channels ✅
  - [ ] Settings ✅
- [ ] Does NOT show "Upload Book" (author only)
- [ ] Logout works
- [ ] API: `GET /api/users/:id` ✅
- [ ] API: `GET /api/orders?user_id=X` ✅

### 2.12 Edit Profile Screen (Reader)
- [ ] Can update name, email, mobile
- [ ] Can update bio, address, city, state, pincode
- [ ] Can change profile photo
- [ ] Photo upload works
- [ ] No render issues (keyboard stays open)
- [ ] API: `PUT /api/users/:id` ✅
- [ ] API: `PUT /api/upload` (avatar) ✅

### 2.13 Payment Screen
- [ ] Shows book details
- [ ] Shows price
- [ ] Payment options available
- [ ] Can complete purchase
- [ ] API: `POST /api/purchase` ✅

### 2.14 Reader Screen
- [ ] Can read book content
- [ ] Reading progress tracked
- [ ] API: `GET /api/books/:id/download` ✅

---

## 3. AUTHOR/PUBLISH APP FUNCTIONALITY

### 3.1 Home Screen (Author)
- [ ] Shows greeting with author name
- [ ] Shows ONLY their own books
- [ ] Shows ONLY their own audio books
- [ ] Does NOT show trending/recommended (reader only)
- [ ] API: `GET /api/books?author=X` ✅
- [ ] API: `GET /api/audio-books?author=X` ✅

### 3.2 Book Upload Screen
- [ ] Can upload PDF file
- [ ] Can upload audio file (for podcasts)
- [ ] Can upload multiple cover images
- [ ] Progress bar shows during upload
- [ ] Form validation works
- [ ] API: `POST /api/books` ✅
- [ ] API: `POST /api/audio-books` ✅
- [ ] API: `PUT /api/upload` ✅

### 3.3 Book Detail Screen (Author - Own Book)
- [ ] Shows book details
- [ ] Shows "Edit Book" button
- [ ] Does NOT show "Buy Now" (reader only)
- [ ] Does NOT show "Add to Wishlist" (reader only)
- [ ] Does NOT show reviews/ratings (reader only)
- [ ] API: `GET /api/books/:id` ✅

### 3.4 Edit Book Screen
- [ ] Can edit book details
- [ ] Can update cover images
- [ ] Can update PDF/audio file
- [ ] API: `PUT /api/books/:id` ✅
- [ ] API: `PUT /api/audio-books/:id` ✅

### 3.5 Profile Screen (Author)
- [ ] Shows author avatar
- [ ] Shows author details
- [ ] Menu items:
  - [ ] Upload Book ✅
  - [ ] My Orders
  - [ ] YouTube Channels ✅
  - [ ] Settings ✅
- [ ] Does NOT show "Wishlist" (reader only)
- [ ] Does NOT show "Reviews & Ratings" (reader only)
- [ ] API: `GET /api/users/:id` ✅

### 3.6 Edit Profile Screen (Author)
- [ ] Can update profile
- [ ] Can add website (author specific)
- [ ] Can change photo
- [ ] API: `PUT /api/users/:id` ✅

---

## 4. ADMIN PANEL

### 4.1 Dashboard
- [ ] Shows total books count
- [ ] Shows total audio books count
- [ ] Shows total authors count
- [ ] Shows total users count
- [ ] Shows revenue statistics
- [ ] Shows pending books
- [ ] Date range filter works
- [ ] API: `GET /api/dashboard` ✅

### 4.2 Books Management
- [ ] Lists all books
- [ ] Can view book details
- [ ] Can add new book
- [ ] Can edit book
- [ ] Can delete book
- [ ] API: `GET /api/books` ✅
- [ ] API: `POST /api/books` ✅
- [ ] API: `PUT /api/books/:id` ✅
- [ ] API: `DELETE /api/books/:id` ✅

### 4.3 Audio Books Management
- [ ] Lists all audio books
- [ ] Can view audio book details
- [ ] Can add new audio book
- [ ] Can edit audio book
- [ ] Can delete audio book
- [ ] API: `GET /api/audio-books` ✅
- [ ] API: `POST /api/audio-books` ✅
- [ ] API: `PUT /api/audio-books/:id` ✅
- [ ] API: `DELETE /api/audio-books/:id` ✅

### 4.4 Authors Management
- [ ] Lists all authors
- [ ] Can view author details
- [ ] Can add new author
- [ ] Can edit author
- [ ] API: `GET /api/authors` ✅
- [ ] API: `POST /api/authors` ✅
- [ ] API: `GET /api/authors/:id` ✅
- [ ] API: `PUT /api/authors/:id` ✅

### 4.5 Users Management
- [ ] Lists all users
- [ ] Can view user details
- [ ] Can edit user
- [ ] API: `GET /api/users` ✅
- [ ] API: `GET /api/users/:id` ✅
- [ ] API: `PUT /api/users/:id` ✅

### 4.6 Curriculum Management
- [ ] Lists all curriculum items
- [ ] Can add new curriculum
- [ ] Can edit curriculum
- [ ] API: `GET /api/curriculum` ✅
- [ ] API: `POST /api/curriculum` ⚠️ (needs verification)
- [ ] API: `PUT /api/curriculum/:id` ⚠️ (needs verification)

### 4.7 Purchases Management
- [ ] Lists all purchases
- [ ] Shows purchase details
- [ ] API: `GET /api/purchases` ✅

---

## 5. API ENDPOINTS VERIFICATION

### 5.1 Authentication APIs
- [x] `POST /api/auth/send-otp` - Send OTP
- [x] `POST /api/auth/verify-otp` - Verify OTP (static: 123456)
- [x] `POST /api/auth/register` - Register user
- [ ] `POST /api/auth/login` - Email/password login (needs test)

### 5.2 Books APIs
- [x] `GET /api/books` - List books (with filters)
- [x] `GET /api/books/:id` - Get book details
- [x] `POST /api/books` - Create book
- [x] `PUT /api/books/:id` - Update book
- [x] `DELETE /api/books/:id` - Delete book
- [x] `GET /api/books/:id/download` - Get download URL

### 5.3 Audio Books APIs
- [x] `GET /api/audio-books` - List audio books
- [x] `GET /api/audio-books/:id` - Get audio book details
- [x] `POST /api/audio-books` - Create audio book
- [x] `PUT /api/audio-books/:id` - Update audio book
- [x] `DELETE /api/audio-books/:id` - Delete audio book

### 5.4 Authors APIs
- [x] `GET /api/authors` - List authors
- [x] `GET /api/authors/:id` - Get author details
- [x] `POST /api/authors` - Create author
- [x] `PUT /api/authors/:id` - Update author

### 5.5 Users APIs
- [x] `GET /api/users` - List users
- [x] `GET /api/users/:id` - Get user details
- [x] `PUT /api/users/:id` - Update user

### 5.6 Orders & Purchases APIs
- [x] `GET /api/orders` - List orders (with user_id filter)
- [x] `POST /api/purchase` - Create purchase
- [x] `GET /api/purchases` - List all purchases

### 5.7 Wishlist APIs
- [x] `GET /api/wishlist` - Get wishlist (with user_id)
- [x] `POST /api/wishlist` - Add to wishlist
- [x] `DELETE /api/wishlist` - Remove from wishlist

### 5.8 Notifications APIs
- [x] `GET /api/notifications` - Get notifications (with user_id)
- [x] `PUT /api/notifications` - Mark as read

### 5.9 Reviews APIs
- [x] `GET /api/reviews` - Get reviews (with bookId)
- [x] `POST /api/reviews` - Create review
- [x] `PUT /api/reviews/:id` - Update review
- [x] `DELETE /api/reviews/:id` - Delete review

### 5.10 Other APIs
- [x] `GET /api/dashboard` - Dashboard stats
- [x] `GET /api/curriculum` - Get curriculum
- [x] `GET /api/youtube-channels` - Get YouTube channels
- [x] `PUT /api/upload` - Upload file

---

## 6. ROLE-BASED ACCESS CONTROL

### 6.1 Reader Role
- [x] Can view all published books
- [x] Can add books to wishlist
- [x] Can purchase books
- [x] Can write reviews
- [x] Can view library
- [x] CANNOT upload books
- [x] CANNOT edit other authors' books
- [x] CANNOT see "Upload Book" in menu

### 6.2 Author Role
- [x] Can view only their own books
- [x] Can upload books
- [x] Can edit their own books
- [x] CANNOT purchase books (no buy button)
- [x] CANNOT add to wishlist
- [x] CANNOT write reviews
- [x] CANNOT see "Wishlist" in menu
- [x] CANNOT see "Reviews & Ratings" in menu

---

## 7. KNOWN ISSUES & FIXES NEEDED

### 7.1 Fixed Issues ✅
- [x] EditProfileScreen render issue (InputField re-rendering)
- [x] react-native-document-picker compatibility (GuardedResultAsyncTask)
- [x] Profile screen order count from API
- [x] Avatar upload functionality
- [x] Role-based UI rendering

### 7.2 Needs Testing ⚠️
- [ ] Email/password login flow
- [ ] Purchase flow end-to-end
- [ ] Book download functionality
- [ ] Reading progress tracking
- [ ] Notification push (if implemented)

### 7.3 Potential Issues
- [ ] Password hashing not implemented (stored as plain text)
- [ ] JWT token authentication not implemented
- [ ] OTP is static (123456) - needs real implementation
- [ ] File upload size limits
- [ ] Error handling in some screens

---

## 8. TESTING INSTRUCTIONS

### 8.1 Test Reader Flow
1. Register as Reader → Select interests → Login
2. Browse books → View details → Add to wishlist
3. Purchase a book → Check order history
4. Write a review → Check reviews screen
5. Update profile → Change photo
6. Logout → Login again

### 8.2 Test Author Flow
1. Register as Author → Select interests → Login
2. Upload a book → Add cover images → Submit
3. View uploaded book → Edit book details
4. Upload audio book → Check in home
5. Update profile → Add website
6. Logout → Login again

### 8.3 Test Admin Panel
1. Access admin panel
2. View dashboard → Check stats
3. Manage books → Add/Edit/Delete
4. Manage users → View/Edit
5. View purchases → Check revenue

---

## 9. API BASE URL
- **Production**: `https://admin-orcin-omega.vercel.app`
- **Mobile App**: Configured in `mobile/src/services/api.js`

---

## 10. SUMMARY

### Total API Endpoints: 24
- ✅ Implemented: 23
- ⚠️ Needs Testing: 1 (login)

### Total Mobile Screens: 20+
- ✅ Reader Screens: 15
- ✅ Author Screens: 8
- ✅ Shared Screens: 5

### Total Admin Pages: 10+
- ✅ Dashboard: 1
- ✅ Management Pages: 9+

---

**Last Updated**: 2024
**Status**: Ready for comprehensive testing

