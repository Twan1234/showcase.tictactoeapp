// MessageContainer.cy.js
import MessageContainer from './MessageContainer';

describe('MessageContainer Component', () => {
    const mockMessages = [
        { msg: 'Test message 1', username: 'User1' },
        { msg: 'Test message 2', username: 'User2' }
    ];

    it('displays messages correctly', () => {
        cy.mount(<MessageContainer messages={mockMessages} />);

        cy.get('tr').should('have.length', 2);
        cy.contains('td', 'Test message 1 - User1').should('exist');
        cy.contains('td', 'Test message 2 - User2').should('exist');
    });

    it('handles empty messages', () => {
        cy.mount(<MessageContainer messages={[]} />);
        cy.get('tr').should('not.exist');
    });
});