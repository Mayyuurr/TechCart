describe('System E2E Test Suite: Checkout Flow', () => {
  it('should allow a customer to search, add to cart, and complete purchase', () => {
    cy.visit('/');
    cy.get('[data-cy="search-input"]').type('laptop{enter}');
    cy.get('[data-cy="add-to-cart-btn"]').first().click();
    cy.get('[data-cy="nav-cart"]').click();
    cy.get('[data-cy="cart-subtotal"]').should('exist');
    cy.get('[data-cy="checkout-btn"]').click();
    cy.get('[data-cy="order-success-msg"]').should('be.visible');
  });
});
