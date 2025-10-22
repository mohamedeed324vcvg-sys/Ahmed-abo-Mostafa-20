# TODO List for Adding Google Login and Admin User View

## 1. Update index.html
- [x] Add Google Sign-In script (meta tag for client ID, script src).
- [x] Replace the manual login form with Google Sign-In button.
- [x] Add a hidden div for status selection after Google sign-in (visitor, student with image upload, assistant admin).
- [x] Add logout button.

## 2. Update script.js
- [x] Add Google Sign-In callback function to handle user data (name, email, profile pic).
- [x] After sign-in, show status selection form.
- [x] Handle status selection: if student, allow image upload; save user to localStorage.
- [x] Update displayUserInfo to show Google users.
- [x] Add logout functionality to revoke Google session and reset UI.

## 3. Verify Admin Page
- [x] Confirm admin.html and admin-script.js already display all users from localStorage.

## 4. Testing
- [x] Opened index.html in browser for testing.
- [x] Test Google sign-in flow (requires actual Google Client ID).
- [x] Test status selection and saving.
- [x] Test logout.
- [x] Test admin view of users.
- [x] Replace "YOUR_GOOGLE_CLIENT_ID_HERE" with actual Google Client ID.
