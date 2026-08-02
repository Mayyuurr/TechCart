describe("Login Flow", ()=>{
    //Setup(initialize)

    beforeEach(()=>{
        //route to app
        cy.visit('/');
    });

    it("Log in and redirect to dashboard",()=>{

        //2.Execute(perform action)
        cy.get('input[type="email"]').type('testuser@email.com');
        cy.get('input[type="password"]').type("SecurePass123!");
        cy.get('button').contains('Login').click();

        //3.Validate(Assert)
        cy.url().should('include','/dashboard');

        cy.contains('Welcome').should('be.visible');
    });

    //4.Teardown(cleanup)
    afterEach(()=>{
        cy.clearCookies();
    });
});