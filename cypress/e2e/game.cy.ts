
describe('Home page', () => {
  it('Visits the home page', () => {
    cy.clearAllSessionStorage()
    cy.visit('/');
  });

  it("can't go to battle without resource select", () => {
    cy.getElement('start-game-btn').click();
    cy.wait(300);
    cy.get('mat-snack-bar-container').should('contain.text', 'Select resource!');
  });

  it("can't go to battle until some resourced are fetched", () => {
    cy.getElement('start-game-btn').click();
    cy.wait(300);

    // test needs to be runned with empty sessionStorage
    cy.intercept('GET', 'https://swapi.dev/api/people/*').as('peoplePage1Request');
    cy.wait('@peoplePage1Request', { timeout: 10000 });
  });

  it("selected resource should be marked", () => {
    cy.getElement('starship-selector-button').click();
    cy.getElement('starship-selector-button')
      .should('have.css', 'filter')
      .and('contain', 'drop-shadow');

    cy.getElement('creature-selector-button').click();
    cy.getElement('starship-selector-button')
      .should('have.css', 'filter')
      .and('not.contain', 'drop-shadow')
  })

  it("navigate to game with creatures", () => {
    cy.getElement('start-game-btn').click();
  })
})

describe('Game page', () => {
  it('visits the game page', () => {
    cy.url().should('include', '/game');
    cy.url().should('include', 'resource=creature');
  });

  it('data should be displayed after loading', () => {
    cy.getElement('loading').should('be.visible');
    cy.getElement('card-player1').should('be.visible');
    cy.getElement('card-player2').should('be.visible');
  });

  it('point should be correctly assigned', () => {
    cy.getElement('battle-result-txt').invoke('text').then((resultText) => {
      if (resultText.includes('Player 1')) {
        cy.getElement('score-txt').should('include.text', '1 : 0');
      } else if (resultText.includes('Player 2')) {
        cy.getElement('score-txt').should('include.text', '0 : 1');
      } else {
        cy.getElement('score-txt').should('include.text', '0 : 0');
      }
    });
  })

  it('play again should reload the game', () => {
    cy.getElement('play-again-button').click();
    cy.getElement('loading').should('be.visible');
  });

  it('change resource to starship', () => {
    cy.getElement('change-resource-button').click();
    cy.getElement('starship-selector-button').click();
    cy.getElement('start-game-btn').click();
    cy.url().should('include', 'resource=starship');
  })
})
