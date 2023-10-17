declare namespace Cypress {
  interface Chainable<Subject = any> {
    getElement(selector: string): Chainable;
  }
}

Cypress.Commands.add('getElement', (selector) => {
  return cy.get(`[data-cy=${selector}]`);
})
