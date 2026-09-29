# TechCart Checkout & Registration Specifications v1.2

**Document Ref:** FRS-TC-091  
**Author:** Product Manager / Lead Architect  
**Status:** Approved for Sprint 5  

---

## Section 1: User Registration System

### 1.1 Business Requirements (BRD)
*   **REQ_REG_01:** The system shall allow new users to register an account using an email address, password, and first name. The registration flow must be fast and error-free.
*   **REQ_REG_02:** The system must prevent security issues by securing user credential entries.

*   *QA Static Testing Note:* "Fast" is subjective and non-testable. "Error-free" lacks definition of error-handling states.

### 1.2 Functional & Technical Specifications (FRS)
*   **Endpoint:** `POST /api/users/register`
*   **Payload Format:** JSON
    ```json
    {
      "firstName": "String",
      "email": "String",
      "password": "String (min-length: 8)"
    }
    ```
*   **Database Operation:** 
    Upon receiving a registration payload, the server must query the in-memory user collection (`mockUserDatabase`) to verify if the email is unique.
*   **Database Constraints:** 
    *   `email`: Must be unique. 
    *   `password`: Must be parsed as a string.

*   *Critical QA Loophole Identified during Static Testing:* The FRS specifies that the email must be unique, but **does not define the exception path or error response format** if a database unique-key constraint is violated on duplicate signup. (This omission leads directly to **Bug 1: The Infinite Spinner / 500 server crash**).

---

## Section 2: Checkout, Promo Code & Shipping Logic

### 2.1 Business Requirements (BRD)
*   **REQ_CHK_01:** The system shall support discount promotional codes at checkout to encourage holiday sales.
*   **REQ_CHK_02:** The system must calculate local taxes and support flat-rate shipping options.

### 2.2 Functional & Technical Specifications (FRS)
*   **Active Promo Codes:** `TECH20` (Case-sensitive)  
*   **Mathematical Rules for Promo Code `TECH20`:**
    1.  **Deduct 20%** from the combined subtotal of all items in the shopping cart.
    2.  Calculate **8% local sales tax** on the new *discounted* subtotal.
    3.  Apply a **flat shipping fee of $10.00** to the final calculated balance.
*   **Expected Grand Total Calculation Formula:**
    $$\text{Grand Total} = \left( \text{Subtotal} \times 0.80 \right) + \text{Tax} + \text{Shipping}$$

*   *Critical QA Calculation Boundary:* If a user checkout contains an item worth $100.00 and applies `TECH20`:
    *   **Discounted Subtotal:** $80.00
    *   **Tax (8%):** $6.40
    *   **Shipping (Flat):** $10.00
    *   **Expected Grand Total:** **$96.40**

*   *Critical QA Loophole Identified during Static Testing:* The system's calculation module executes calculations sequentially. A logic error in the backend code adds the flat shipping fee *twice* if a coupon is valid, pushing the checkout total to **$106.40** (This matches **Bug 2: The Checkout Promo Math Bug**).

---

## Section 3: User Interface & Responsive Design

### 3.1 Business Requirements (BRD)
*   **REQ_UI_01:** The shopping cart and product details page must be accessible and easy to click across all devices, including mobile viewports.

### 3.2 Functional & Technical Specifications (FRS)
*   **Target Breakpoints:**
    *   Desktop Viewports: $\ge$ 1024px width
    *   Tablet Viewports: 768px – 1023px width
    *   Mobile Viewports: $\le$ 480px width (Standard testing breakpoint: **375px wide**)
*   **CSS Rendering Constraints:** 
    All action items (including the "Add to Cart" and "Checkout" call-to-actions) must remain unblocked, maintain a minimum tap-target size of 44px x 44px, and feature a minimum 16px padding boundary away from product description typography.

*   *Critical QA Loophole Identified during Static Testing:* The CSS stylesheet fails to apply responsive flex-wrap logic at the 375px threshold, causing the product card's text container to overflow. (This layout failure leads directly to **Bug 3: The Add to Cart Button Overlap**).
