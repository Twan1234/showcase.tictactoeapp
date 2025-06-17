// SendMessageForm.cy.js
import SendMessageForm from './SendMessageForm';

describe('SendMessageForm Component', () => {
    const sendMessageSpy = cy.spy().as('sendMessageSpy');

    beforeEach(() => {
        cy.mount(<SendMessageForm sendMessage={sendMessageSpy} />);
    });

    it('allows typing messages', () => {
        cy.get('[data-cy="message-input"]')
            .type('Test message')
            .should('have.value', 'Test message');
    });

    it('submits message on button click', () => {
        cy.get('[data-cy="message-input"]').type('New message');
        cy.get('[data-cy="send-button"]').click();
        cy.get('@sendMessageSpy').should('have.been.calledWith', 'New message');
    });

    it('prevents empty submissions', () => {
        cy.get('[data-cy="send-button"]').click();
        cy.get('@sendMessageSpy').should('not.have.been.called');
    });
});