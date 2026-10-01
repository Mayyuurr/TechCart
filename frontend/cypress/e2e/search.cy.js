describe('TechCart Product Search Suite', () => {
  it('should filter product catalog when user types a query', () => {
    cy.visit('/');
    cy.get('[data-cy="search-input"]').type('laptop{enter}');
    cy.get('[data-cy="product-card"]').should('have.length.at.least', 1);
  });
});
