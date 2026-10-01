# 🛒 TechCart

**TechCart** is a modern e-commerce web application and comprehensive QA testing benchmark built with **React**, **TypeScript**, **Tailwind CSS**, and **Node.js/Express**. It provides realistic end-to-end e-commerce flows alongside dedicated suites for **White-Box Testing**, **Grey-Box Log Triaging**, **Unit Testing (AAA Pattern)**, **API Integration Testing (Supertest)**, **Test Case Design Techniques (EP, BVA, Decision Tables, State Transitions, Error Guessing)**, **E2E Automation (Cypress & Selenium)**, **Performance Testing**, and **Security Penetration Testing**.

---

## 📑 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [How to Run Locally](#-how-to-run-locally)
  - [Option A: Full-Stack Mode (Recommended)](#option-a-full-stack-mode-recommended)
  - [Option B: Development Mode (Frontend & Backend Separately)](#option-b-development-mode-frontend--backend-separately)
- [🎓 SQA Masterclass Demonstration Modules](#-sqa-masterclass-demonstration-modules)
  - [Module 2, Chapter 1: White-Box, Functional API & Error Triaging](#module-2-chapter-1-white-box-functional-api--error-triaging)
  - [Module 2, Chapter 2: Unit (AAA), Integration (Supertest) & System E2E](#module-2-chapter-2-unit-aaa-integration-supertest--system-e2e)
  - [Module 3, Chapter 2: Test Case Design Techniques (EP, BVA, Decision Tables, State Machines)](#module-3-chapter-2-test-case-design-techniques)
- [🐞 Intentionally Introduced Bugs & QA Scenarios](#-intentionally-introduced-bugs--qa-scenarios)
- [🔌 API Reference](#-api-reference)
- [🧪 QA & Test Automation Guide](#-qa--test-automation-guide)
  - [1. Backend Unit & Integration Tests (Jest & Supertest)](#1-backend-unit--integration-tests-jest--supertest)
  - [2. Frontend E2E Tests (Cypress)](#2-frontend-e2e-tests-cypress)
  - [3. Browser Automation (Selenium & TestNG)](#3-browser-automation-selenium--testng)
  - [4. API Testing (Postman)](#4-api-testing-postman)
- [Demo Credentials & Promo Codes](#-demo-credentials--promo-codes)
- [Sprint 5 Defect Ledger Summary](#-sprint-5-defect-ledger-summary)
- [Project Directory Structure](#-project-directory-structure)

---

## ✨ Features

- **Product Catalog & Live Search:** Browse electronics and accessories, filter by category, or perform live keyword queries (`/api/v1/products/search`).
- **Shopping Cart & Checkout Flow:** Real-time quantity updates, order quantity boundary checks (max 10 items), and dynamic total calculations.
- **Promotions & Shipping Engine:** Promo code application (`TECH20`, `SAVE10`), tax calculations, and multi-variable shipping matrix calculations.
- **Test Case Design Rule Engines:** Validated Equivalence Partitions (1–99), 3-point Boundary Value thresholds (\$50.00), \(2^N\) Decision Table evaluation, and Order Finite State Machine lifecycle.
- **Standardized Test Automation Selectors:** Pre-configured `data-cy` attributes across components for robust Cypress and Selenium locators.
- **QA & Security Benchmarks:** Built-in test harnesses for White-Box branch coverage, Supertest integration testing, simulated database bottlenecks (`/api/products/heavy-search`), and NoSQL injection defense demonstrations.

---

## 🛠 Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4
- **Backend:** Node.js, Express 5, Mongoose / In-memory data store
- **Testing Tools:** 
  - **Jest** (Unit, Branch Coverage & Technique Testing)
  - **Supertest** (HTTP / API Integration Testing)
  - **Cypress** (Frontend E2E & Component Testing)
  - **Selenium WebDriver + TestNG + Maven** (Cross-browser E2E Testing)
  - **Postman** (API Collection & Workflow Testing)

---

## 📋 Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v18.x or higher (v20+ recommended) — [Download Node.js](https://nodejs.org/)
- **npm**: v9.x or higher (comes with Node.js)
- *(Optional for Selenium tests)*: **Java JDK 11+** and **Apache Maven**

---

## 🚀 How to Run Locally

### Option A: Full-Stack Mode (Recommended)

In this mode, the frontend is compiled and served directly by the Express backend on **port 5000**.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Mayyuurr/TechCart.git
   cd TechCart
   ```

2. **Install backend and frontend dependencies:**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   cd ..

   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. **Build the frontend:**
   ```bash
   npm run build
   ```
   *This compiles the React application into `frontend/build`.*

4. **Start the server:**
   ```bash
   npm start
   ```

5. **Open in Browser:**
   Visit **[http://localhost:5000](http://localhost:5000)**

---

### Option B: Development Mode (Frontend & Backend Separately)

Use this mode for active development with Hot Module Replacement (HMR).

#### 1. Start the Backend API (Port 5000)
Open your first terminal window:
```bash
cd backend
npm install
node server.js
```
> Backend runs at: `http://localhost:5000`

#### 2. Start the Frontend Dev Server (Port 5173)
Open a second terminal window:
```bash
cd frontend
npm install
npm run dev
```
> Frontend Vite dev server runs at: `http://localhost:5173`

---

## 🎓 SQA Masterclass Demonstration Modules

TechCart is specially architected for hands-on SQA training and on-camera demonstrations:

### Module 2, Chapter 1: White-Box, Functional API & Error Triaging

1. **White-Box Testing (`taxCalculator.js`):**
   - File: `backend/src/utils/taxCalculator.js`
   - Test File: `backend/tests/unit/taxCalculator.test.js`
   - **Branch Coverage:** Tests 100% of decision branches (negative amounts, California `8.25%`, New York `8.875%`, default states `5%`).
   - Run: `npx jest tests/unit/taxCalculator.test.js`

2. **Functional Search API:**
   - Endpoint: `GET /api/v1/products/search?q=laptop`
   - Returns structured response: `{ status: "success", count: 2, data: [...] }`
   - Automated E2E Test: `frontend/cypress/e2e/search.cy.js`

3. **Grey-Box MongoDB Error Triaging:**
   - Endpoint: `POST /api/v1/users/register`
   - Registering `existinguser@email.com` explicitly logs a colored `MongoServerError: E11000 duplicate key error` in the terminal and returns a 500 error for inspecting network payloads and server logs.

---

### Module 2, Chapter 2: Unit (AAA), Integration (Supertest) & System E2E

1. **Level 1: Unit Testing with AAA Pattern (`similarity.js`):**
   - File: `backend/src/utils/similarity.js`
   - Test File: `backend/tests/unit/similarity.test.js`
   - Demonstrates the **Arrange-Act-Assert** pattern for unit tests, verifying identical strings, fractional similarities, and exception handling on null/undefined inputs.

2. **Level 2: API Integration Testing (`productApi.test.js` + Supertest):**
   - Endpoint: `POST /api/v1/products`
   - Test File: `backend/tests/integration/productApi.test.js`
   - Uses **Supertest** to test HTTP request/response payloads, status codes (201 Created), and JSON persistence assertions against the Express app without port binding.

3. **Level 3: System E2E & Standardized Selectors (`checkout.cy.js`):**
   - Automated Test: `frontend/cypress/e2e/checkout.cy.js`
   - Complete end-to-end user journey using standardized `data-cy` selectors (`search-input`, `product-card`, `add-to-cart-btn`, `nav-cart`, `cart-subtotal`, `checkout-btn`, `order-success-msg`).

---

### Module 3, Chapter 2: Test Case Design Techniques

Test suite: [`backend/tests/unit/testDesignTechniques.test.js`](file:///e:/QA%20and%20Testing%20Course%20final%20materials/TechCart/backend/tests/unit/testDesignTechniques.test.js) (25 passing tests).

1. **Equivalence Partitioning (EP):**
   - **Quantity Validator (`validators.js`):** Tests valid partitions (`1..99`) vs invalid non-integers, empty/null, and out-of-range values.
   - **Multi-Variable Shipping Matrix (`shippingCalculator.js`):** Weight tiers (`0-10kg`, `10.1-50kg`, `>50kg`) $\times$ Destination Zones (`'DOMESTIC'`, `'INTERNATIONAL'`).

2. **Boundary Value Analysis (BVA):**
   - **Decimal Free Shipping Threshold (\$50.00):** 3-point BVA testing \$49.99 (paid shipping), \$50.00 (free shipping), and \$50.01 (free shipping).
   - **Lecture Bug Toggle:** Demonstrates off-by-one bug failure (`subtotal > 50.00` vs `subtotal >= 50.00`).
   - **Quantity Limits:** 3-point analysis on `0, 1, 2` (lower) and `98, 99, 100` (upper).

3. **Decision Table Testing (\(2^N\) Combinatorial Engine):**
   - **Promotion Engine (`promotionEngine.js`):** Evaluates `isUserAuthenticated`, `orderTotal > 100.00`, and `hasValidPromoCode`.
   - **Rule Collapsing:** Short-circuits to `LOGIN_REQUIRED` when unauthenticated (Rule 5).

4. **State Transition Testing (Order Finite State Machine):**
   - **Order Lifecycle (`orderStateMachine.js`):** Valid transitions across `['CART', 'CHECKOUT', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']`.
   - **Illegal Guard:** Throws HTTP 400 when attempting to cancel an order already `SHIPPED`.

5. **Error Guessing & Security Guards:**
   - Buffer overflow guard (10,000 character limit).
   - UTF-8 / Emoji support (`"Alex 🍕"`).
   - Zero/negative unit price rejection (`price <= 0`).
   - NoSQL injection parameter sanitization.

---

## 🐞 Intentionally Introduced Bugs & QA Scenarios

TechCart includes deliberately crafted defects and lecture bug toggles for training:

### 1. BVA Off-By-One Free Shipping Demonstration Bug
- **Location:** `backend/src/controllers/checkoutController.js`
- **Bug Toggle:** `useBuggyThreshold = true`
- **Observed Bug:** Uses strict greater-than `subtotal > 50.00` instead of `subtotal >= 50.00`. An order of exactly **\$50.00** is improperly charged shipping (\$5.99).
- **QA Objective:** Demonstrating 3-point Boundary Value Analysis on camera.

### 2. The Duplicate Email Database Crash (API / Unhandled Exception)
- **Defect ID:** `TCART-102` (Severity: Critical)
- **How to Reproduce:** Register a new account with `existinguser@email.com`.
- **Observed Behavior:** The backend throws an unhandled duplicate key error (`500 Internal Server Error`). The React UI enters an infinite loading spinner.
- **QA Objective:** Network tab payload inspection, stack trace logging, and exception path verification.

### 3. The Promo Code Math Discrepancy (Functional / Business Logic Bug)
- **Defect ID:** `TCART-103` (Severity: Major)
- **How to Reproduce:** Add an item worth $100.00 to the cart and apply promo code `TECH20`.
- **Expected Calculation:**
  $$\text{Subtotal (\$80.00 after 20\% off)} + \text{Tax 8\% (\$6.40)} + \text{Shipping (\$10.00)} = \mathbf{\$96.40}$$
- **Observed Bug:** The backend calculation logic applies the shipping fee twice when a promo code is active, pushing the grand total to **$106.40**.
- **QA Objective:** Boundary calculations, unit test assertions, and defect triage.

### 4. The "Add to Cart" Button Overlap (Cosmetic / Responsive Layout Bug)
- **Defect ID:** `TCART-104` (Severity: Minor)
- **How to Reproduce:** Open DevTools, switch to Mobile Device Emulation, and set the viewport width to **375px** (e.g., iPhone SE).
- **Observed Bug:** Missing responsive flex-wrapping causes the product card description text to collide with the "Add to Cart" button.
- **QA Objective:** Cross-device responsive testing and accessibility compliance.

### 5. Brittle Test Selector & Maintenance Overhead (Automation Flakiness)
- **File:** `frontend/cypress/e2e/broken-test.cy.js`
- **Observed Bug:** The automated test is hardcoded to click `#register-btn-v1`, but the UI element was updated to `#register-btn-v2`.
- **QA Objective:** Demonstrating locator maintenance overhead and adopting resilient selector strategies (`data-cy`, semantic roles).

### 6. NoSQL Object Injection Vulnerability (Security Testing Demo)
- **Endpoints:** `POST /api/users/login-vulnerable` vs `POST /api/users/login-secure`
- **Exploit Payload:**
  ```json
  {
    "email": { "$gt": "" },
    "password": { "$gt": "" }
  }
  ```
- **Observed Bug:** On the vulnerable endpoint, object operators evaluate to `true`, bypassing authentication. The secure endpoint strictly validates string inputs.

---

## 🔌 API Reference

### Products & Search
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/products/search` | Search product catalog by keyword query (`?q=laptop`) |
| `POST` | `/api/v1/products` | Create/persist a new product (Supertest integration target) |
| `GET` | `/api/products` | Get list of all products (supports `?category=electronics`) |
| `GET` | `/api/products/:id` | Get details for a single product |
| `GET` | `/api/products/heavy-search` | Performance bottleneck simulation (1.5s artificial delay) |

### Test Case Design Technique Endpoints (M3C2)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/shipping/calculate` | Multi-variable shipping calculation (`weight`, `zone`) |
| `POST` | `/api/v1/checkout/bva` | BVA threshold checkout calculation (`subtotal`, `useBuggyThreshold`) |
| `POST` | `/api/v1/promotions/evaluate` | Decision table promotion rule evaluator |
| `POST` | `/api/v1/orders/transition` | Order finite state machine transition handler |

### Authentication & Users
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/users/register` | Registration endpoint with duplicate email error logging |
| `POST` | `/api/users` | Standard user login/registration endpoint |
| `PUT` | `/api/users/:id` | Update user details |
| `POST` | `/api/users/login-vulnerable` | Intentionally vulnerable route for NoSQL injection demo |
| `POST` | `/api/users/login-secure` | Secured login route with strict type verification |

### Cart & Checkout
| Method | Endpoint | Description |
|---|---|---|
| `DELETE` | `/api/cart/:id` | Remove item from cart |
| `POST` | `/api/checkout` | Process order total, applies promo discount, tax, and shipping |

---

## 🧪 QA & Test Automation Guide

### 1. Backend Unit & Integration Tests (Jest & Supertest)
Run all unit and integration test suites:
```bash
cd backend

# Run all test suites
npm test

# Run Test Case Design Techniques suite (M3C2)
npx jest tests/unit/testDesignTechniques.test.js

# Run White-Box Branch Coverage suite (M2C1)
npx jest tests/unit/taxCalculator.test.js

# Run AAA Unit Testing suite (M2C2)
npx jest tests/unit/similarity.test.js

# Run Supertest Integration suite (M2C2)
npx jest tests/integration/productApi.test.js
```

### 2. Frontend E2E Tests (Cypress)
Run Cypress tests interactively or headlessly:
```bash
cd frontend

# Open Cypress Test Runner UI:
npx cypress open

# Or run specific specs headlessly:
npx cypress run --spec "cypress/e2e/checkout.cy.js"
npx cypress run --spec "cypress/e2e/search.cy.js"
```

### 3. Browser Automation (Selenium & TestNG)
Make sure Java JDK and Maven are installed and the backend server is running on `http://localhost:5000`:
```bash
cd selenium-tests
mvn clean test
```

### 4. API Testing (Postman)
- Collections and environment files are located in the `postman/` directory.
- Import `postman/collections/` into the Postman App to run manual or automated test suites.

---

## 🔑 Demo Credentials & Promo Codes

### Active Promo Codes
- **`TECH20`**: 20% off cart subtotal + 8% sales tax + $10 flat-rate shipping (or free express shipping on orders > $100).
- **`SAVE10`**: 10% off cart subtotal on orders over $20.

### Mock User Database
| Email | Password | Role |
|---|---|---|
| `admin@email.com` | `adminpassword123` | Administrator |
| `existinguser@email.com` | `password123` | Standard User |

---

## 📊 Sprint 5 Defect Ledger Summary

| Defect ID | Severity | Priority | Description | Resolution Status |
|---|---|---|---|---|
| **TCART-102** | Critical | High | Duplicate registration unhandled 500 error & frozen UI | Unresolved (Demo Bug) |
| **TCART-103** | Major | High | Promo code `TECH20` doubles flat shipping charge | Unresolved (Demo Bug) |
| **TCART-104** | Minor | Medium | 375px responsive mobile "Add to Cart" button overlap | Unresolved (Demo Bug) |

---

## 📁 Project Directory Structure

```text
TechCart/
├── backend/
│   ├── server.js              # Server entry point (starts Express app)
│   ├── package.json           # Backend dependencies & test runner scripts
│   ├── src/
│   │   ├── app.js             # Modular Express application & API routing
│   │   ├── controllers/       # Controllers (checkoutController with BVA threshold)
│   │   ├── services/          # Rule engines (shippingCalculator, promotionEngine, orderStateMachine)
│   │   └── utils/             # Business logic (taxCalculator, similarity, validators, securityGuards, promo)
│   ├── tests/
│   │   ├── unit/              # Jest unit tests (testDesignTechniques, taxCalculator, similarity)
│   │   ├── integration/       # Supertest API tests (productApi)
│   │   └── promo.test.js      # Promo code validation tests
│   └── utils/                 # Utility exports
├── frontend/
│   ├── src/
│   │   ├── components/        # React UI (ProductList, CheckoutCart, RegistrationForm)
│   │   ├── App.jsx            # Main app with tab navigation & data-cy tags
│   │   └── index.css          # Tailwind CSS styles & responsive layout rules
│   ├── public/                # Static images & assets
│   ├── cypress/
│   │   └── e2e/               # Cypress E2E specs (checkout, search, broken-test)
│   ├── vite.config.js         # Vite configuration (builds to /build)
│   └── package.json           # Frontend dependencies & scripts
├── selenium-tests/
│   ├── pom.xml                # Maven configuration for Selenium + TestNG
│   └── src/test/java/         # Selenium test classes
├── postman/                   # Postman collections, environments & flows
├── TechCart_Sprint5_Test_Summary_Report.md # QA Sprint Test Summary Report
├── techcart-specifications-v1-2.md         # System BRD & FRS specifications
├── tasks2.md                  # Masterclass demonstration requirements checklist
├── package.json               # Root package script runner
└── README.md                  # Project documentation & testing guide
```
