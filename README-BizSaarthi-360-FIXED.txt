BizSaarthi 360 - FULL FIXED PROJECT

Main fixes in this package:
1. Business Profile page syntax/navigation fixed. Loading screen has a fail-safe.
2. Customer Dashboard shows the public business name + logo at the top.
3. Customer Dashboard remembers the public business context and can return to the public business website.
4. Business Customers page is expanded with full customer/application information and a customer history modal.
5. Owner sees only applications belonging to the logged-in business account.
6. Customer sees only their own applications.
7. Existing Firebase configuration is retained.
8. Existing files are retained; this package does not require deleting the repository files.
9. Firebase Storage is not required for the current application-information workflow.

Important:
- Firestore rules in firestore.rules must be published manually in Firebase Console if they are not already published.
- Firebase Storage is intentionally not used because the current Firebase setup does not have Storage enabled.
