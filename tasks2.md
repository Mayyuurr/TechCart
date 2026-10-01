# TASK: TechCart Codebase Audit & Feature Implementation for Module 3, Chapter 2 (M3C2) SQA Masterclass Demonstrations

You are an expert Full-Stack MERN Developer and SDET. Your objective is to audit, implement, and verify all backend logic, input validators, rule engines, state guards, and intentional demonstration defects in the **TechCart** repository. 

Everything must be 100% prepared for live on-camera demonstrations of **Test Case Design Techniques** (Equivalence Partitioning, Boundary Value Analysis, Decision Tables, State Transitions, and Error Guessing).

---

## 📋 DEMONSTRATION AUDIT & IMPLEMENTATION CHECKLIST

### 1. EQUIVALENCE PARTITIONING (EP)
- [x] **Quantity Input Validator (`src/utils/validators.js`):**
  Check if `validateCartQuantity(quantity)` exists. Implemented to handle all valid and invalid EP partitions:
  ```javascript
  function validateCartQuantity(quantity) {
    if (quantity === null || quantity === undefined || String(quantity).trim() === '') {
      return { isValid: false, error: 'Quantity is required' };
    }
    const num = Number(quantity);
    if (!Number.isInteger(num)) {
      return { isValid: false, error: 'Quantity must be a whole integer' };
    }
    if (num < 1 || num > 99) {
      return { isValid: false, error: 'Quantity must be between 1 and 99' };
    }
    return { isValid: true, error: null };
  }
  module.exports = { validateCartQuantity };
  ```
- [x] **Multi-Variable Shipping Matrix (`src/services/shippingCalculator.js`):**
  Calculates shipping based on **Weight** (`0-10kg`, `10.1-50kg`, `>50kg`) and **Destination Zone** (`'DOMESTIC'`, `'INTERNATIONAL'`).

---

### 2. BOUNDARY VALUE ANALYSIS (BVA) & OFF-BY-ONE DEMO BUG
- [x] **Decimal Free Shipping Threshold (`src/controllers/checkoutController.js`):**
  Verified the free shipping logic against the **$50.00** threshold.
- [x] **On-Camera Demonstration Bug Toggle:**
  Includes toggle comment/variable to demonstrate an **Off-By-One Bug** on camera:
  ```javascript
  // DEMO BUG TOGGLE FOR BVA LECTURE:
  // Buggy Code (failing $50.00 exact boundary): const isFreeShipping = subtotal > 50.00;
  // Correct Code (passing 3-point BVA $49.99 / $50.00 / $50.01):
  const isFreeShipping = subtotal >= 50.00;
  const shippingFee = isFreeShipping ? 0.00 : 5.99;
  ```
- [x] **Quantity Boundaries:** Verified that quantity checks handle exact 3-point boundaries: `0` (invalid), `1` (min valid), `2` (valid), `98` (valid), `99` (max valid), `100` (invalid).

---

### 3. DECISION TABLE TESTING (\(2^N\) COMBINATORIAL ENGINE)
- [x] **Checkout Promotion & Discount Rule Engine (`src/services/promotionEngine.js`):**
  Multi-condition promotion rules engine evaluated during checkout:
  - **Condition 1:** `isUserAuthenticated` (Boolean)
  - **Condition 2:** `orderTotal > 100.00` (Boolean)
  - **Condition 3:** `hasValidPromoCode` (e.g., `'TECH20'`) (Boolean)
- [x] **Rule Collapsing Implementation:**
  When `isUserAuthenticated` is `false`, the engine immediately short-circuits to `LOGIN_REQUIRED` without evaluating conditions 2 and 3, matching collapsed decision table Rule 5 (`False, --, --`):
  ```javascript
  function evaluatePromotionRules(isUserAuthenticated, orderTotal, promoCode) {
    if (!isUserAuthenticated) {
      return { status: 'LOGIN_REQUIRED', discount: 0, freeExpressShipping: false };
    }
    const hasValidCode = (promoCode === 'TECH20');
    const isOverHundred = orderTotal > 100.00;

    if (isOverHundred && hasValidCode) {
      return { status: 'SUCCESS', discount: 0.20, freeExpressShipping: true };
    } else if (isOverHundred && !hasValidCode) {
      return { status: 'SUCCESS', discount: 0.00, freeExpressShipping: true };
    } else if (!isOverHundred && hasValidCode) {
      return { status: 'SUCCESS', discount: 0.20, freeExpressShipping: false };
    }
    return { status: 'SUCCESS', discount: 0.00, freeExpressShipping: false };
  }
  module.exports = { evaluatePromotionRules };
  ```

---

### 4. STATE TRANSITION TESTING (ORDER FINITE STATE MACHINE)
- [x] **Order State Machine (`src/services/orderStateMachine.js`):**
  Order lifecycle states: `['CART', 'CHECKOUT', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']`.
- [x] **Illegal State Guard Verification:**
  Attempting to cancel an order in `SHIPPED` status returns HTTP 400:
  ```javascript
  function transitionOrderState(currentOrder, targetAction) {
    if (currentOrder.status === 'SHIPPED' && targetAction === 'CANCEL') {
      const error = new Error('Cannot cancel an order that has already been shipped');
      error.statusCode = 400;
      throw error;
    }
    // Handle valid state transitions...
  }
  ```

---

### 5. ERROR GUESSING & HEURISTIC SECURITY GUARDS
- [x] **Buffer / Length Guard:** User notes or address text fields reject inputs over 10,000 characters cleanly without server crashes.
- [x] **UTF-8 Support:** Unicode / non-ASCII / emoji inputs (e.g., `"Alex 🍕"`) processed cleanly.
- [x] **NoSQL Injection Guard:** Object parameters sanitized and rejected.
- [x] **Negative / Zero Unit Price Guard:** Product creation rejects unit prices `<= 0.00`.

---

## ⚙️ EXECUTION & VALIDATION INSTRUCTIONS
- [x] Unit test suite created in `tests/unit/testDesignTechniques.test.js` covering all EP, BVA, Decision Table, State Machine, and Error Guessing scenarios.
- [x] All 25 test cases in `testDesignTechniques.test.js` verified passing with 100% success.