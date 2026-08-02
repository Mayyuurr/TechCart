describe('Checkout Flow', () => {
  beforeEach(() => {
    // Visit the home page
    cy.visit('/');
  });

  it('should allow adding a product and completing checkout', () => {
    // Check if we are on the products tab by default
    cy.contains('Our Collection').should('be.visible');

    // Add Smartphone to the cart
    cy.contains('.group1', 'Smartphone').within(() => {
      cy.contains('Add to Cart').click();
    });

    // Check alert (Cypress automatically accepts alerts, but we can verify it was called)
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Smartphone added to cart!');
    });

    // Navigate to the Cart tab
    cy.contains('button', 'Cart (1)').click();

    // Verify the cart contains the Smartphone
    cy.contains('h4', 'Smartphone').should('be.visible');
    cy.contains('span', '1').should('be.visible');

    // Click Proceed to Checkout
    cy.contains('button', 'Proceed to Checkout').click();

    // Verify order confirmation details
    cy.contains('h3', 'Order Confirmed!').should('be.visible');
    cy.contains('Subtotal:').should('be.visible');
    cy.contains('Total:').should('be.visible');
  });
});
