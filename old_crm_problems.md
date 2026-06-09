# Review of Issues in the Old CRM System (Verified Audit Report)

This report summarizes the critical security vulnerabilities, performance issues, and structural bugs identified in the previous version of the CRM system (the "Old CRM"). Every issue listed has been verified against the codebase, with references to exact code locations.

---

## 1. Security & Data Protection Risks

### A. Weak User Authentication (Login) — **VERIFIED**
* **What it is:** The old system used a temporary "simulated" security key instead of generating secure, encrypted credentials for logins.
* **Code Location:** [server.js](file:///c:/Users/91704/Fetc_Website/server/server.js#L312)
* **Code Proof:** 
  ```javascript
  token: "mock-jwt-token-fetc-" + user.id
  ```
* **The Risk:** Anyone who figured out or guessed a user's database ID number could fake their credentials and log in. This could lead to unauthorized personnel viewing or modifying sensitive business and customer information.

### B. Unprotected Student Document Uploads (Passports & Visas) — **VERIFIED**
* **What it is:** Files uploaded by students (like passport copies, visa rejections, and academic sheets) were saved in a public folder with no security check on who was viewing them.
* **Code Location:** [server.js](file:///c:/Users/91704/Fetc_Website/server/server.js#L210)
* **Code Proof:**
  ```javascript
  app.use('/uploads', express.static(uploadDir));
  ```
* **The Risk:** Anyone who had the direct web address of an uploaded file could access it immediately from anywhere in the world. This was a severe privacy risk for sensitive client files.

### C. Vulnerable Database Communication (SSL Bypass) — **VERIFIED**
* **What it is:** The old system turned off database connection checks to bypass error screens.
* **Code Location:** [db.js](file:///c:/Users/91704/Fetc_Website/server/db.js#L6) and [server.js](file:///c:/Users/91704/Fetc_Website/server/server.js)
* **Code Proof:**
  ```javascript
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  ```
* **The Risk:** The link between the CRM and the database server was not secure. A bad actor could potentially eavesdrop on or hijack customer data as it traveled back and forth.

### D. Open Server Access (CORS Policy) — **VERIFIED**
* **What it is:** The system was configured to accept requests from any website whatsoever.
* **Code Location:** [server.js](file:///c:/Users/91704/Fetc_Website/server/server.js#L172-L175)
* **Code Proof:**
  ```javascript
  app.use(cors({
    origin: '*', // Allow all origins
    allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning']
  }));
  ```
* **The Risk:** Malicious websites could make unauthorized requests to our CRM database, leading to data leaks or spam lead generation.

---

## 2. Speed & Reliability Risks (Performance)

### A. Slow Loading Speeds (No Pagination) — **VERIFIED**
* **What it is:** When viewing list screens (like Leads or Users), the CRM fetched every single record in the database all at once.
* **Code Location:** [server.js](file:///c:/Users/91704/Fetc_Website/server/server.js#L623-L648) (`app.get('/api/v1/lead/allleads')`)
* **Code Proof:**
  ```javascript
  const leadsRes = await db.query('SELECT * FROM leads ORDER BY created_at DESC');
  ```
* **The Risk:** While it worked for a few dozen test records, as our database grows to thousands of leads, loading the page will become slower and slower, eventually crashing the server.

### B. Screen Freezes During Excel Imports — **VERIFIED**
* **What it is:** When importing a spreadsheet of leads, the web browser had to read the whole sheet and verify duplicates row-by-row on the screen.
* **Code Location:** [LeadList.jsx](file:///c:/Users/91704/OneDrive/Pictures/Documents/frontend/src/pages/admin/leadform/LeadList.jsx#L321-L347)
* **Code Proof:**
  ```javascript
  const rows = await parseFile(file);
  // ... nested javascript loop checking elements client-side
  const existing = new Set(allLeads.map(l => `${normalizeName(...)}`));
  ```
* **The Risk:** Uploading large files would cause the browser to freeze or crash. Additionally, if the upload failed halfway through, some leads would be added while others were missed, making cleanup a headache.

---

## 3. Configuration & Link Failures

### A. Hardcoded Developer Addresses — **VERIFIED**
* **What it is:** Multiple page elements contained links specifically pointing to local developer laptops (e.g., `localhost:5000`).
* **Code Location:** [Unit-1.jsx](file:///c:/Users/91704/OneDrive/Pictures/Documents/frontend/src/pages/Courses/Unit-1.jsx#L164) and [Unit-1.jsx](file:///c:/Users/91704/OneDrive/Pictures/Documents/frontend/src/pages/Courses/Unit-1.jsx#L190)
* **Code Proof:**
  ```javascript
  const response = await axios.post('http://localhost:5000/api/submit', ...);
  const resultResponse = await axios.get('http://localhost:5000/api/results');
  ```
* **The Risk:** Once deployed online for client use, these buttons and forms would stop working because they were searching for files on the developer's laptop instead of the live server.

### B. Hardcoded External Forms (Google Forms) — **VERIFIED**
* **What it is:** Survey forms were linked to external personal Google Forms instead of being saved inside our database.
* **Code Location:** [PrForm.jsx](file:///c:/Users/91704/OneDrive/Pictures/Documents/frontend/src/pages/webpages/PrForm.jsx#L91) and [ExclusiveUniversity.jsx](file:///c:/Users/91704/OneDrive/Pictures/Documents/frontend/src/pages/webpages/ExclusiveUniversity.jsx#L39)
* **Code Proof:**
  ```javascript
  // PrForm.jsx
  onClick={() => window.open('https://forms.gle/es6Mkua6qGDWVikF7', '_blank')}
  
  // ExclusiveUniversity.jsx
  window.location.href = 'https://forms.gle/9nJQ2H2ps38fbBPY9';
  ```
* **The Risk:** If those personal accounts were closed or the forms were modified, the links inside our system would break instantly.
