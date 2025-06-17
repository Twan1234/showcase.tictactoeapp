describe('Multiplayer TicTacToe', () => {
    beforeEach(() => {
        cy.session('user1', () => {
            cy.visit('https://localhost:7142/Identity/Account/Login');
            //cy.visit('http://localhost:5285/Identity/Account/Login');
            cy.get('button.gdpr__buttons__accept').click();
            cy.get('#Input_Email').type('Cypress@gmail.com');
            cy.get('#Input_Password').type('Cypress04!');
            cy.get('#login-submit').click();
            cy.wait(2000);
            cy.get('#manage').should('contain.text', 'Hello Cypress@gmail.com!');
        });
    });

    it('User1 creates a room with random room code', () => {
        cy.visit('https://localhost:7142/TicTacToe');
        //cy.visit('http://localhost:5285/TicTacToe');
        cy.contains('button.btn-primary', 'Create New Room').click();
        cy.get('[data-testid="cypress-title"]').should("exist");
        cy.wait(2000);
    });

    it('User1 creates a room with code CYPRE, User2 joins', () => {
        cy.visit('https://localhost:7142/TicTacToe');
        //cy.visit('http://localhost:5285/TicTacToe');
        cy.get('#formRoomCode').clear().type('CYPRE');
        cy.contains('button.btn-primary', 'Join Existing Room').click();
        cy.get('[data-testid="cypress-title"]').should("exist");
        cy.wait(2000);
    });

    beforeEach(() => {
        cy.session('user2', () => {
            cy.visit('https://localhost:7142/Identity/Account/Login');
           // cy.visit('http://localhost:5285/Identity/Account/Login');
            cy.get('button.gdpr__buttons__accept').click();
            cy.get('#Input_Email').type('Cypress2@gmail.com');
            cy.get('#Input_Password').type('Cypress04!');
            cy.get('#login-submit').click();
            cy.wait(2000);
            cy.get('#manage').should('contain.text', 'Hello Cypress2@gmail.com!');
        });
    });

    it('User1 creates a room with random room code', () => {
        cy.visit(`https://localhost:7142/TicTacToe`);
        //cy.visit(`http://localhost:5285/TicTacToe`);
        cy.get('#formRoomCode').clear().type('CYPRE');
        cy.contains('button.btn-primary', 'Join Existing Room').click();
        cy.get('[data-testid="cypress-title"]').should("exist");
    });
});
