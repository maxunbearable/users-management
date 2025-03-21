# users-management
Users management app using AngularJs

- Create AngularJS application (version < 2) Without server side. (Just emulate it)
- User list page
- User view page
- Should have fallback pages for 404 and 403 errors.
- User can be created/updated/deleted through the interface.
In css class naming will be good if you use BEM (would be plus).
Don't use any css frameworks, just your own css code and markup.
Implement custom directive for user form validation (check and display validation errors).
Implement a service for sending and receiving data from the server. Just emulate it - save data
locally.

Form validation. Form can display server side errors.
User fields. All required
- username (unique)
- first_name
- last_name
- email (valid email address.)
- password (min length 8. at least one number and one letter )
- user_type ("Admin", "Driver')
