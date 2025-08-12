import React from 'react';
import SendMessageForm from '../../src/components/ChatRoom/SendMessageForm.js';

describe('SendMessageForm', () => {
    it('should send message and clear input', () => {
        const sendMessage = cy.stub().as('sendMessage');

        cy.mount(<SendMessageForm sendMessage={sendMessage} />);

        const testMessage = 'Test Message';

        cy.get('input[placeholder="Type your message"]').type(testMessage);
        cy.get('[data-cy=send-button]').click();

        cy.get('@sendMessage').should('have.been.calledOnceWith', testMessage);
        cy.get('input[placeholder="Type your message"]').should('have.value', '');
    });

    it('should disable send button when input is empty', () => {
        cy.mount(<SendMessageForm sendMessage={() => { }} />);
        cy.get('[data-cy=send-button]').should('be.disabled');
    });
});
