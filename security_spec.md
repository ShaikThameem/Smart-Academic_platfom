# Smart Academic Platform - Security Specification

## 1. Data Invariants
1. **User Identity Boundary**: A user profile document (`/users/{userId}`) can only be written by the authenticated user whose `request.auth.uid == userId` or an authorized administrator (`thameemahmed087@gmail.com`).
2. **Role Elevation Prevention**: Normal students and faculty cannot elevate their own role to 'hod' or alter administrative flags during document creation or update.
3. **Attendance Record Integrity**: Attendance records can only be created or modified by verified faculty or HOD admins; students can only read their own records (`resource.data.studentId == request.auth.uid`).
4. **Complaint Ownership**: Students can only view their own complaints unless marked public, while HODs/Admins can view and update resolution notes.
5. **Feedback Anonymity & Integrity**: Only enrolled students can submit faculty feedback, and cannot modify existing feedback once recorded.
6. **Immutable Historical Records**: `createdAt`, `authorId`, and `studentId` cannot be changed after initial creation.
7. **Size & Input Boundaries**: String lengths must be strictly checked to prevent resource exhaustion attacks.

## 2. The "Dirty Dozen" Malicious Payloads (Tested to return PERMISSION_DENIED)
1. **Admin Escalation in User Profile**: A student attempting to write `role: "hod"` on their own `/users/{uid}` document without administrative authorization.
2. **Identity Spoofing in Attendance**: A student writing an attendance record for another student ID (`studentId: "other_uid"`).
3. **Unauthenticated Read on User Profiles**: An unauthenticated request reading `/users/{userId}`.
4. **Ghost Field Injection (Shadow Update)**: Attempting to update a user profile with an undeclared property `isSuperAdmin: true`.
5. **Oversized String Payload (Denial of Wallet)**: Submitting a complaint description exceeding the 2000-character limit (e.g., 200KB payload).
6. **Cross-Tenant Complaint Deletion**: A student attempting to delete a complaint belonging to a different student.
7. **Forged Faculty Feedback Author**: A student submitting feedback claiming to be another student ID.
8. **Unauthorized Announcement Publication**: A student attempting to create a departmental announcement in `/announcements`.
9. **Grade / Score Tampering**: A student updating their own submission score (`score: 100`) on `/submissions/{subId}`.
10. **Timestamp Forgery**: Submitting `createdAt` as a spoofed client date rather than server timestamp.
11. **Malicious ID Injection**: Creating a document with a 2KB non-alphanumeric ID string like `../../../etc/passwd` or oversized junk.
12. **Blanket Query Scraping**: Attempting an unrestricted `collection('users')` list query across all user records without authorization.

## 3. Test Verification
All the above malicious payloads are blocked by the rule constraints:
- `isValidId()` ensures all document IDs conform to regex `^[a-zA-Z0-9_\-]+$` and length `<= 128`.
- `isAdmin()` verifies bootstrap admin `thameemahmed087@gmail.com` with `email_verified == true`.
- Strict schema validation (`isValid[Entity]()`) and `affectedKeys().hasOnly()` prevent rogue property injection.
