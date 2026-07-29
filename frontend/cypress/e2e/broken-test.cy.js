describe('Registration Flow - Brittle Element ID Test', () => {
  beforeEach(() => {
    // Visit the home page
    cy.visit('/');
    // Switch to the Register tab
    cy.contains('button', 'Register').click();
  });

  it('should attempt to register using the legacy button ID (brittle test)', () => {
    // Fill out the registration form
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="email"]').type('testuser@email.com');
    cy.get('input[name="password"]').type('password123');

    // CRITICAL FAILURE POINT:
    // The test is hardcoded to click the button with ID '#register-btn-v1'.
    // However, the UI developer changed the ID to '#register-btn-v2' this morning.
    // This rigid automation script will now fail to find the element, crash, 
    // and demonstrate the maintenance overhead associated with fragile tests.
    cy.get('#register-btn-v1').click();
  });
});
