# CineRec: Full-Stack Test Automation & Quality Engineering Portfolio
[![E2E Tests](https://github.com/yourusername/cinerec-automation/actions/workflows/e2e-tests.yml/badge.svg)](https://github.com/yourusername/cinerec-automation/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](https://opensource.org/licenses/MIT)

Welcome to the **CineRec** Test Automation Portfolio. This repository showcases industry-standard Quality Engineering (QE) practices implemented on **CineRec**—a responsive, full-stack movie discovery web application integrating the TMDB API, featuring user authentication, custom watchlists, movie searching, and review publishing.

This portfolio demonstrates:
1. **Frontend E2E Testing:** A structured Page Object Model (POM) framework using Cypress/Playwright.
2. **Backend API Testing:** A Postman collection and Supertest suite executing contract, schema, and authentication boundary validations.
3. **Continuous Integration (CI/CD):** Automatic automated regression runs triggered on every Git pull request via GitHub Actions.
4. **Professional Bug Registry:** Actionable, engineering-grade defect tickets tracking local staging regressions.

---

## 🏗️ Framework Architecture

The testing infrastructure is built with a decoupled, modular design to ensure high maintainability, dry test scripts, and stable executions under asynchronous rendering conditions.

```
cinerec-test-suite/
├── .github/workflows/          # CI/CD Pipeline Definitions
│   └── e2e-tests.yml
├── cypress/                    # Cypress End-to-End Testing Directory
│   ├── e2e/                    # Test Specifications
│   │   ├── auth.cy.js
│   │   └── search.cy.js
│   ├── page-objects/           # Page Object Model (POM) Locators & Actions
│   │   ├── LoginPage.js
│   │   └── SearchPage.js
│   └── support/                # Custom Assertions and Global Hooks
│       ├── commands.js
│       └── e2e.js
├── postman/                    # API Integration Collections
│   ├── cinerec-api.json
│   └── staging-env.json
└── README.md
```

---

## 💻 Code Showcase: Page Object Model (POM)

To prevent brittle tests and locator duplication, we utilize the **Page Object Model**. Below is the clean implementation for our `SearchPage.js` and corresponding automated E2E search script.

### 1. Page Object Class (`cypress/page-objects/SearchPage.js`)
```javascript
class SearchPage {
  // Elements / Locators
  get searchInput() { return cy.get('input[data-qa="movie-search-input"]'); }
  get searchButton() { return cy.get('button[data-qa="movie-search-submit"]'); }
  get movieCard() { return cy.get('[data-qa="movie-card"]'); }
  get noResultsMessage() { return cy.get('[data-qa="no-results-alert"]'); }

  // Actions
  typeSearchQuery(query) {
    this.searchInput.clear().type(query);
    return this;
  }

  submitSearch() {
    this.searchButton.click();
    return this;
  }

  // Chained Flow Helper
  searchForMovie(title) {
    this.typeSearchQuery(title);
    this.submitSearch();
  }
}

export default new SearchPage();
```

### 2. Test Specification (`cypress/e2e/search.cy.js`)
```javascript
import SearchPage from '../page-objects/SearchPage';

describe('CineRec Movie Discovery & Search Functional Suite', () => {
  beforeEach(() => {
    cy.visit('/explore');
  });

  it('TC-01: Should display matching movie cards under valid search query', () => {
    const movieTitle = 'Inception';
    
    // Perform Search Action Flow
    SearchPage.searchForMovie(movieTitle);

    // Assertions
    SearchPage.movieCard.should('have.length.at.least', 1);
    SearchPage.movieCard.first()
      .find('[data-qa="movie-title"]')
      .should('contain.text', movieTitle);
  });

  it('TC-02: Should display graceful warning message when query returns empty results', () => {
    const invalidQuery = 'ZXYWVUTS123456';
    
    SearchPage.searchForMovie(invalidQuery);

    SearchPage.movieCard.should('not.exist');
    SearchPage.noResultsMessage()
      .should('be.visible')
      .and('contain.text', 'No movies found matching your search criteria');
  });
});
```

---

## 📡 Backend API Testing (Postman / Javascript)

Our API verification strategy targets our REST endpoints (`/api/users` and `/api/movies`) using automated assertion scripts inside Postman to validate payload types, response times, and HTTP status codes.

### Postman Test Assertion Snippet (JWT Guard Verification):
```javascript
// Verify that the endpoint enforces authentication security
pm.test("Status code is 401 Unauthorized when Bearer token is missing", function () {
    pm.response.to.have.status(401);
});

pm.test("Response body contains exact error message", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.message).to.eql("Access denied. No token provided.");
});
```

---

## ⚙️ CI/CD Integration: GitHub Actions

This test suite runs automatically on every Pull Request (PR) to the `main` branch, ensuring that regressions are caught before code merges.

```yaml
# .github/workflows/e2e-tests.yml
name: CineRec E2E Continuous Verification Suite

on:
  pull_request:
    branches: [ main ]
  push:
    branches: [ main ]

jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install System Dependencies
        run: npm ci

      - name: Build & Launch CineRec App
        run: |
          npm run build
          npm run start &
          npx wait-on http://localhost:3000

      - name: Run Cypress Automated Tests
        uses: cypress-io/github-action@v6
        with:
          install: false
          wait-on: 'http://localhost:3000'
```

---

## 🐛 Local Staging Bug Registry

These bugs were identified during manual and static exploratory testing runs on localhost and logged inside Jira for developer remediation.

### Ticket ID: CIN-204 (Severity: Critical | Priority: High)
*   **Summary:** [Authentication] Server crash (500 Error) on duplicate signup submission.
*   **Steps to Reproduce:**
    1. Navigate to `/register`.
    2. Input name: `Alex`, and existing user credentials: `duplicate@user.com`.
    3. Click "Sign Up".
*   **Expected Result:** System blocks submission, displaying validation boundary toast: "Account already exists."
*   **Actual Result:** The browser UI spins indefinitely. The node backend terminal prints an unhandled database unique-key crash, returning `500 Internal Server Error`.
