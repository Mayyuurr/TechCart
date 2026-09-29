# 🛒 TechCart

**TechCart** is a modern e-commerce web application and QA testing benchmark built with **React**, **TypeScript**, **Tailwind CSS**, and **Node.js/Express**. It provides realistic end-to-end e-commerce flows alongside dedicated endpoints for unit testing, integration testing, end-to-end UI automation (Cypress & Selenium), API automation (Postman/Newman), performance testing, and security testing.

---

## 📑 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [How to Run Locally](#-how-to-run-locally)
  - [Option A: Full-Stack Mode (Recommended)](#option-a-full-stack-mode-recommended)
  - [Option B: Development Mode (Frontend & Backend Separately)](#option-b-development-mode-frontend--backend-separately)
- [🐞 Intentionally Introduced Bugs & QA Scenarios](#-intentionally-introduced-bugs--qa-scenarios)
- [API Reference](#-api-reference)
- [QA & Test Automation Guide](#-qa--test-automation-guide)
  - [1. Backend Unit Tests (Jest)](#1-backend-unit-tests-jest)
  - [2. Frontend E2E Tests (Cypress)](#2-frontend-e2e-tests-cypress)
  - [3. Browser Automation (Selenium & TestNG)](#3-browser-automation-selenium--testng)
  - [4. API Testing (Postman)](#4-api-testing-postman)
- [Demo Credentials & Promo Codes](#-demo-credentials--promo-codes)
- [Sprint 5 Defect Ledger Summary](#-sprint-5-defect-ledger-summary)
- [Project Directory Structure](#-project-directory-structure)

---

## ✨ Features

- **Product Catalog & Details:** Browse electronics and accessories with category filtering.
- **Shopping Cart & Checkout Flow:** Real-time cart updates, boundary validations, and dynamic price calculations.
- **Promotions & Shipping Engine:** Promo code application (`TECH20`), tax calculation, and membership-based shipping rates.
- **User Authentication:** Registration and login flows with both secured and vulnerability-demonstration endpoints.
- **QA & Security Benchmarks:** Built-in scenarios for testing edge cases, boundary values, performance latency (`/api/products/heavy-search`), and NoSQL injection defenses.

---

## 🛠 Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4
- **Backend:** Node.js, Express 5, Mongoose / In-memory data store
- **Testing Tools:** 
  - **Jest** (Backend Unit Testing)
  - **Cypress** (Frontend E2E Testing)
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
   git clone <repository-url>
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

## 🐞 Intentionally Introduced Bugs & QA Scenarios

TechCart includes deliberately crafted defects and edge cases for training and demonstrating real-world QA engineering practices:

### 1. The Duplicate Email Database Crash (API / Unhandled Exception)
- **Defect ID:** `TCART-102` (Severity: Critical)
- **How to Reproduce:** Register a new account with the email `existinguser@email.com`.
- **Observed Behavior:** The backend throws an unhandled duplicate key error, returning a `500 Internal Server Error`. The React UI enters an infinite loading spinner.
- **QA Learning Objective:** Using Chrome DevTools Network Tab to inspect request payloads, capturing console stack traces, identifying missing error-handling exception paths, and logging reproducible defect reports.

### 2. The Promo Code Math Discrepancy (Functional / Business Logic Bug)
- **Defect ID:** `TCART-103` (Severity: Major)
- **How to Reproduce:** Add an item worth $100.00 to the cart and apply promo code `TECH20`.
- **Expected Calculation:**
  $$\text{Subtotal (\$80.00 after 20\% off)} + \text{Tax 8\% (\$6.40)} + \text{Shipping (\$10.00)} = \mathbf{\$96.40}$$
- **Observed Bug:** The backend calculation logic applies the shipping fee twice when a promo code is active, pushing the grand total to **$106.40**.
- **QA Learning Objective:** Writing boundary and calculation test suites, automating business logic validation via Jest (`mathLogic.test.js`, `promo.test.js`), and defect triage.

### 3. The "Add to Cart" Button Overlap (Cosmetic / Responsive Layout Bug)
- **Defect ID:** `TCART-104` (Severity: Minor)
- **How to Reproduce:** Open DevTools, switch to Mobile Device Emulation, and set the viewport width to **375px** (e.g., iPhone SE/XR).
- **Observed Bug:** Missing responsive flex-wrapping causes the product card description text to overflow and collide with the "Add to Cart" button, violating the 44px tap-target standard.
- **QA Learning Objective:** Cross-device and mobile viewport testing, inspecting computed CSS properties, and verifying accessibility/UX guidelines.

### 4. Brittle Test Selector & Maintenance Overhead (Automation Flakiness)
- **File:** `frontend/cypress/e2e/broken-test.cy.js`
- **Observed Bug:** The automated test is hardcoded to click `#register-btn-v1`, but the UI element was updated to `#register-btn-v2`.
- **QA Learning Objective:** Demonstrating test suite brittleness, diagnosing NoSuchElementException / locator timeout errors, and adopting resilient locator strategies (`data-testid`, semantic roles).

### 5. NoSQL Object Injection Vulnerability (Security Testing Demo)
- **Endpoints:** `POST /api/users/login-vulnerable` vs `POST /api/users/login-secure`
- **Exploit Payload:**
  ```json
  {
    "email": { "$gt": "" },
    "password": { "$gt": "" }
  }
  ```
- **Observed Bug:** On the vulnerable endpoint, object operators evaluate to `true` against the database query, completely bypassing credential verification.
- **QA Learning Objective:** API penetration testing, parameter tampering, and verifying defensive programming (strict string type verification in `login-secure`).

### 6. Simulated Heavy Database Bottleneck (Performance Testing)
- **Endpoint:** `GET /api/products/heavy-search`
- **Behavior:** Intentionally delays the response by 1,500ms using asynchronous timeouts to simulate an unindexed full-table scan.
- **QA Learning Objective:** Measuring SLA thresholds, response time metrics, and writing API performance assertions in Postman.

### 7. Order Quantity Boundaries (Equivalence Partitioning)
- **Rule:** A maximum of 10 identical items per order is allowed.
- **Boundary Cases:**
  - 10 items $\rightarrow$ `200 OK` (Valid boundary)
  - 11 items $\rightarrow$ `400 Bad Request: "Cannot purchase more than 10 of the same item."` (Invalid boundary)

---

## 🔌 API Reference

### Products
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Get list of all products (supports `?category=electronics`) |
| `GET` | `/api/products/:id` | Get details for a single product |
| `GET` | `/api/products/heavy-search` | Performance bottleneck simulation (1.5s artificial delay) |

### Authentication & Users
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/register` | User registration with duplicate email validation simulation |
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

### 1. Backend Unit Tests (Jest)
Runs unit tests for math calculations, checkout logic, and promo code verification:
```bash
cd backend
npm test
```

### 2. Frontend E2E Tests (Cypress)
Run Cypress tests interactively or headlessly:
```bash
cd frontend

# Open Cypress Test Runner UI:
npx cypress open

# Or run tests in headless mode:
npx cypress run
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

### Active Promo Code
- **Code:** `TECH20` (Case-sensitive)
- **Logic:** 20% off cart subtotal + 8% sales tax + $10 flat-rate shipping.

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
│   ├── server.js              # Express application & API routing
│   ├── package.json           # Backend dependencies & test scripts
│   ├── tests/                 # Jest unit tests (mathLogic, promo)
│   └── utils/                 # Business logic helpers (math, promo, shipping)
├── frontend/
│   ├── src/                   # React components, pages & styles
│   ├── public/                # Static images & assets
│   ├── cypress/               # Cypress E2E test specs (including brittle tests)
│   ├── vite.config.js         # Vite configuration (builds to /build)
│   └── package.json           # Frontend dependencies & scripts
├── selenium-tests/
│   ├── pom.xml                # Maven configuration for Selenium + TestNG
│   └── src/test/java/         # Selenium test classes
├── postman/                   # Postman collections, environments & flows
├── TechCart_Sprint5_Test_Summary_Report.md # QA Sprint Test Summary Report
├── techcart-specifications-v1-2.md         # System BRD & FRS specifications
├── package.json               # Root package script runner
└── README.md                  # Project documentation & testing guide
```
