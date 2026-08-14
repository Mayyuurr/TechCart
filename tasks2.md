1. Backend Code Preparation (server.js)
You need to add two specific routes to your Express backend: one that is intentionally vulnerable to teach the exploit, and one that is secured to teach the defensive remediation [cite: 41].
Prep A: The Vulnerable Login Route (NoSQL Injection) [cite: 24, 41]
In MongoDB and in-memory mock databases, if input data is not strictly checked for type safety, an attacker can pass query operators (like $gt which means "greater than") inside objects to bypass authentication entirely [cite: 24, 41].
Add this route to your Express server:
// 1. INTENTIONALLY VULNERABLE LOGIN ROUTE (For Security Demo)
app.post('/api/users/login-vulnerable', (req, res) => {
    const { email, password } = req.body;

    // Simulate MongoDB's object operator processing in your mock database.
    // If the attacker sends {"$gt": ""}, it evaluates to "always true".
    const user = mockUserDatabase.find(u => {
        const emailMatch = (typeof email === 'object' && email['$gt'] !== undefined) 
            ? u.email > email['$gt'] 
            : u.email === email;

        const passwordMatch = (typeof password === 'object' && password['$gt'] !== undefined) 
            ? u.password > password['$gt'] 
            : u.password === password;

        return emailMatch && passwordMatch;
    });

    if (user) {
        return res.status(200).json({
            success: true,
            message: "Exploit Successful! Bypassed Auth.",
            token: "mock-jwt-admin-token"
        });
    } else {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
});
Prep B: The Secured Login Route (Input Sanitization) [cite: 41]
To show students how to fix this vulnerability, add a secure route that sanitizes inputs by forcing them to be strict strings (disallowing injected query objects) [cite: 24, 41]:
// 2. SECURED LOGIN ROUTE (The Fix)
app.post('/api/users/login-secure', (req, res) => {
    const { email, password } = req.body;

    // DEFENSIVE REMEDIATION: Strict type verification
    // Force inputs to be strings. If they are objects, reject them immediately.
    if (typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({
            success: false,
            message: "Security Alert: Invalid input type detected! Rejected."
        });
    }

    const user = mockUserDatabase.find(u => u.email === email && u.password === password);

    if (user) {
        return res.status(200).json({ success: true, message: "Logged in securely!" });
    } else {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
});
2. Postman Setup Prerequisites [cite: 40, 47]
In Postman, create a folder in your collection named "Security Testing" and pre-configure these two payloads so you can execute them seamlessly on camera [cite: 40, 55]:
Request 1 (The Hack):
Method: POST
URL: {{base_url}}/api/users/login-vulnerable [cite: 40]
JSON Payload (NoSQL injection to bypass typing a real email/password) [cite: 24]:
Request 2 (The Remediation):
Method: POST
URL: {{base_url}}/api/users/login-secure [cite: 40]
Using the exact same payload above, you will click send and show it returning a 400 Bad Request security rejection block!
3. System & Recording Optimizations (8GB RAM Constraints) [cite: 3]
Because security concepts can be explained without rendering heavy web pages, you will save massive amounts of RAM and CPU by recording this video in a split-screen layout featuring only VS Code and Postman [cite: 3, 40, 47].
Stop Local Database Engines: Ensure any local PostgreSQL or MongoDB background services are stopped to free up to 1.5 GB of RAM [cite: 3].
No Automated Scanners: Do not open OWASP ZAP or run security scan commands in your terminal. They will peg your CPU at 100% and corrupt your video recording stream [cite: 3].
Prepare Exploit Scripts: Keep your JSON injection strings ready in a separate notepad file so you can copy and paste them during the video, which keeps the lecture pace engaging and completely error-free [cite: 55]!