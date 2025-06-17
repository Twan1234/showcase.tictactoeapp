// ChatRoom.cy.js
import ChatRoom from './ChatRoom';
import { MessageContainer, SendMessageForm } from './components';

describe('ChatRoom Component', () => {
    const mockMessages = [
        { msg: 'Hello!', username: 'User1' },
        { msg: 'Hi there!', username: 'User2' }
    ];
    const sendMessageSpy = cy.spy().as('sendMessageSpy');

    beforeEach(() => {
        cy.mount(
            <ChatRoom
                messages={mockMessages}
                sendMessage={sendMessageSpy}
            />
        );
    });

    it('renders chat room structure', () => {
        cy.get('h2').should('contain', 'ChatRoom');
        cy.get('[data-cy="message-container"]').should('exist');
        cy.get('[data-cy="send-message-form"]').should('exist');
    });

    it('displays passed messages', () => {
        cy.get('[data-cy="message"]').should('have.length', 2);
        cy.contains('Hello! - User1').should('be.visible');
        cy.contains('Hi there! - User2').should('be.visible');
    });

    it('calls sendMessage when form is submitted', () => {
        cy.get('[data-cy="message-input"]').type('New message');
        cy.get('[data-cy="send-button"]').click();
        cy.get('@sendMessageSpy').should('have.been.calledWith', 'New message');
    });
});