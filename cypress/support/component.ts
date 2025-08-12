import { mount } from 'cypress/react';

Cypress.Commands.add('mount', mount);

// This line ensures the file is treated as a module (prevents global scope conflict)
export { };
