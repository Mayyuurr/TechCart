1. The Checkout Math Bug (Functional/Logic Error) [cite: 394]:
The Tweak: In your frontend cart component, modify the total calculation so that when a promo code is applied, the system accidentally adds the shipping fee twice, or subtracts the tax instead of adding it.
The QA Lesson: Students must write a test case to verify checkout totals, execute it, catch the math discrepancy, and report it [cite: 41].
2. The Duplicate Email Database Crash (API Error) [cite: 375, 376]:
The Tweak: Keep the database validation error unhandled on the backend [cite: 375]. If a user tries to register with existinguser@email.com, the React UI freezes with an infinite spinner, and a red 500 Internal Server Error is thrown in the console [cite: 375, 376].
The QA Lesson: Teaches students how to open Chrome DevTools, inspect the failed network request payload, and triangulate exactly where the crash occurred (frontend vs. backend database) [cite: 373, 376].
3. The "Add to Cart" Button Overlap (Cosmetic/UI Error) [cite: 394]:
The Tweak: On a specific browser window width (responsive design breakpoint), add a quick CSS rule that causes the "Add to Cart" button to awkwardly overlap with the product description text.
The QA Lesson: Teaches students how to test responsive design, identify cosmetic layout bugs, and document steps to reproduce across different screen layouts [cite: 394, 411].