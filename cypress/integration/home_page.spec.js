/// <reference types="cypress" />

context('Home Page', () => {
  it('Loads successfully', () => {
    cy.visit('/')

    cy.get('nav > .link').contains('SIGN IN')
  })
})
