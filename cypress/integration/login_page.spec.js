/// <reference types="cypress" />

context('Login Page', () => {
  it('Sets auth cookie when logging in via form submission', () => {
    cy.visit('/login')

    cy.get('[type="text"]').type('test@gmail.com')

    cy.get('[type="password"]').type('1234567')

    cy.get('.form-default > .btn').click()

    cy.url().should('equal', 'http://localhost:3000/')

    cy.getCookie('token').should('exist')

    cy.get('[href="/newStory"]').should('exist')

    cy.get('nav > :nth-child(2)').should('exist')

    cy.get('nav > :nth-child(3)').should('exist')
  })
})
