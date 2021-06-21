/// <reference types="cypress" />

describe('Test new User Registration Workflow', () => {
  before('Register a new user', () => {
    cy.visit('/')

    cy.contains('Sign In').click()

    cy.url().should('equal', 'http://localhost:3000/login')

    cy.contains('Create an account').click()

    cy.url().should('equal', 'http://localhost:3000/register')

    cy.get('[name=username]').should('have.attr', 'type', 'text').type('user5')

    cy.get('[name=email]').should('have.attr', 'type', 'text').type('test5@gmail.com')

    cy.get('[name=password]').should('have.attr', 'type', 'password').type('password')

    cy.get('[name=tc]').should('have.attr', 'type', 'checkbox').click()

    cy.get('.form-default > .btn').click()

    cy.url().should('equal', 'http://localhost:3000/')
  
    cy.saveLocalStorage()
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('token')
    cy.restoreLocalStorage()
  })

  afterEach(() => {
    cy.saveLocalStorage()
  })

  it('Allows user to create new story', () => {
    cy.get('[href="/newStory"]').click()

    cy.url().should('equal', 'http://localhost:3000/newStory')

    cy.get('.input-default').type('This is a test story')

    cy.get('[name="product"]').select('EOS User Story')

    cy.get('[name="category"]').select('Documentation')

    cy.get('[name=priority]').select('High')

    cy.get('.ck-editor__main > .ck').type('Testing User Story')

    cy.contains('Submit').click()

    cy.url().should('equal', 'http://localhost:3000/')
  })

  it('Displays story in home page, once created', () => {
    cy.get('.stories-content').contains('This is a test story').click()

    cy.url().should('contain', 'story')
  })

  it('Allows user to edit the story created by them', () => {
    cy.contains('Edit').click()

    cy.get('.ck-editor__main > .ck').type('Edited story description')

    cy.get('.story-buttons-container').contains('Save').click()

    cy.get('.story-description').contains('Edited story description')
  })

  it('Allows user to comment on a story', () => {
    cy.get('[href="/"]').click()

    cy.get('.stories-content').contains('Testing my story').click()

    cy.get('[name="addComment"]').type('Testing comments')

    cy.get('.btn').contains('Add Comment').click()

    cy.get('.comment-content > .link').contains('user5')

    cy.get('.comment-content > p').contains('Testing comments')
  })
})
