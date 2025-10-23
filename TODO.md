x# TODO List for Making All Users Enter Name for Admin View

## 1. Update script.js
- [x] Modify the change event to show name input for all statuses (visitor, student, assistant, admin).
- [x] In confirm-status handler, require name for all statuses.
- [x] Ensu.re all users are pushed to the users array in localStorage.
- [x] Fix syntax error in script.js (closing parenthesis).

## 2. Testing
- [ ] Open index.html in browser.
- [ ] Select different statuses, enter names, confirm.
- [ ] Go to admin.html, login as responsible admin, check user list shows all users with names.

## 3. Fix News Display Issue for Users
- [x] Add storage event listener in script.js to update news on index.html when localStorage changes.
- [x] Add storage event listener in events-script.js to update news on events.html when localStorage changes.

## 4. Fix Admin View Issues
- [x] Add storage event listener in admin-script.js to update users and news lists when localStorage changes from other pages.

## 5. Testing News Update
- [ ] Open index.html and events.html in separate tabs.
- [ ] Add a new event from admin.html.
- [ ] Check if the new event appears immediately in both index.html and events.html without manual refresh.

## 6. Testing Admin View
- [ ] Open admin.html in a tab, login as responsible admin.
- [ ] In another tab, go to index.html, select a status and enter name.
- [ ] Check if the new user appears immediately in admin.html user list without manual refresh.
- [ ] Add a new event from admin.html.
- [ ] Check if the new event appears in the delete list in admin.html without manual refresh.
