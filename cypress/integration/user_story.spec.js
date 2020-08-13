/// <reference types="cypress" />

describe('Test User Story', () => {
  before('Login', () => {
    cy.visit('/')

    cy.contains('Sign In').click()

    cy.url().should('equal', 'http://localhost:3000/login')

    cy.get('[type="text"]').type(Cypress.env('testEmail'))

    cy.get('[type="password"]').type(Cypress.env('testPassword'))

    cy.get('.form-default > .btn').click()

    cy.url({ timeout: 10000 }).should('equal', 'http://localhost:3000/')

    cy.getCookie('token').should('exist')

    cy.get('[href="/newStory"]').should('exist')

    cy.get('nav > :nth-child(2)').should('exist')

    cy.get('nav > :nth-child(3)').should('exist')

    cy.saveLocalStorage()
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('token')
    cy.saveLocalStorage()
  })

  it('Create new story', () => {
    cy.get('[href="/newStory"]').click()

    cy.url().should('equal', 'http://localhost:3000/newStory')

    cy.get('.input-default', { timeout: 10000 }).type('This is a test story')

    cy.get('[name="product"]').select('User Story')

    cy.get('[name="category"]').select('Development')

    cy.get('.ck-editor__main > .ck').type('Testing User Story')

    cy.get('.btn').click()

    cy.url({ timeout: 10000 }).should('equal', 'http://localhost:3000/')
  })

  it('Home page', () => {
    cy.get(':nth-child(1) > .stories-content > h4', {
      timeout: 10000
    }).contains('This is a test story')

    cy.get(':nth-child(1) > .stories-content').click()
  })

  it('Story page', () => {
    cy.url({ timeout: 10000 }).should('contain', 'story')

    cy.get('textarea', { timeout: 10000 }).type('Add main test comment')

    cy.get('.comment-form > .btn').click()

    cy.get('.comment-content > p', { timeout: 15000 }).contains(
      'Add main test comment'
    )

    cy.get('.reply-action > .btn', { timeout: 10000 }).click()

    cy.get('.comment-content > .comment-form > .field > textarea').type(
      'Add thread test comment'
    )

    cy.get('.comment-content > .comment-form > .btn').click()

    cy.get('.reply-action > :nth-child(2)', { timeout: 20000 })
      .contains('(1)')
      .click()

    cy.get(':nth-child(2) > .comment > .comment-content > p').contains(
      'Add thread test comment'
    )

    cy.contains('Edit').click()

    cy.get('.ck-blurred').type('Editing User Story')

    cy.contains('Save').click()

    cy.contains('Editing User Story', { timeout: 10000 })
  })
})
