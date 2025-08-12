import { mount } from 'cypress/react';

declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Mounts a React component for testing
             * @example cy.mount(<MyComponent />)
             */
            mount: typeof mount;
        }
    }
}
