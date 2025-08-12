import React from 'react';
import { mount } from '@cypress/react';
import ChatRoom from '../../src/components/ChatRoom/ChatRoom.js';
import { SinonStub } from 'cypress/types/sinon/index.js';

describe('ChatRoom Component', () => {
    const mockMessages = [
        { msg: 'Hello!', username: 'Alice' },
        { msg: 'Hi there!', username: 'Bob' }
    ];

    // Remove the stub creation from here
    // const mockSendMessage = cy.stub().as('sendMessage'); // ❌ WRONG PLACE

    // Instead, create it inside tests or in beforeEach
    let mockSendMessage: Cypress.Omit<SinonStub<any[], any>, "withArgs"> & Cypress.SinonSpyAgent<SinonStub<any[], any>> & SinonStub<any[], any>;

    beforeEach(() => {
        // Create a fresh stub before each test
        mockSendMessage = cy.stub().as('sendMessage');
    });

    it('displays messages', () => {
        mount(<ChatRoom messages={mockMessages} sendMessage={mockSendMessage} />);

        cy.get('[data-cy="message"]')
            .should('have.length', mockMessages.length)
            .each(($el, index) => {
                expect($el).to.contain(mockMessages[index].msg);
                expect($el).to.contain(mockMessages[index].username);
            });
    });

    it('sends new messages', () => {
        mount(<ChatRoom messages={[]} sendMessage={mockSendMessage} />);

        const testMessage = 'Test message';

        cy.get('[data-cy="message-input"]').siblings('input')
            .type(testMessage)
            .should('have.value', testMessage);

        cy.get('[data-cy="send-button"]')
            .should('not.be.disabled')
            .click();

        cy.get('@sendMessage').should('be.calledWith', testMessage);
        cy.get('[data-cy="message-input"]').siblings('input').should('have.value', '');
    });

    it('handles button disabled state', () => {
        mount(<ChatRoom messages={[]} sendMessage={mockSendMessage} />);

        cy.get('[data-cy="send-button"]').should('be.disabled');

        cy.get('[data-cy="message-input"]').siblings('input')
            .type('A')
            .then(() => {
                cy.get('[data-cy="send-button"]').should('not.be.disabled');
            })
            .clear()
            .then(() => {
                cy.get('[data-cy="send-button"]').should('be.disabled');
            });
    });
});