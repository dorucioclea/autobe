### **Internal Bulletin Board Requirements Specification**

| **Category** | **Requirements** |
| --- | --- |
| **1. User Authentication & Authorization** | • Only login with company email + password allowed • Initial password issued: **1234** • Password change **mandatory on first login** • No access to any posts or comments before login |
| **2. Bulletin Board Structure** | • Board types: **Announcements**, **Free Board**, **Popular Board** • **Popular Board**: posts with likes ≥ 10 are automatically promoted |
| **3. Posts & Comments Features** | • Create, edit, delete posts (by author + admin) • Support comments and **one-level nested replies** • Both posts and comments can receive **likes** (once per user) |
| **4. UI / UX** | • **Left navigation bar**: list of boards + new post button • **Top right corner**: login/logout and password change menu |
| **5. Other Constraints** | • Deleted posts and comments are permanently removed (hard delete) • Server-side handling to prevent duplicate likes during simultaneous requests |
