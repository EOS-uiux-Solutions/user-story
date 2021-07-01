/// <reference types="cypress" />

describe('Test new User Registration Workflow', () => {
  const testUser = {
    username: 'user5',
    email: 'test5@gmail.com',
    password: 'password',
  }

  before('Register a new user', () => {
    cy.visit('/')

    cy.contains('Sign In').click()

    cy.url().should('equal', 'http://localhost:3000/login')

    cy.contains('Create an account').click()

    cy.url().should('equal', 'http://localhost:3000/register')

    cy.get('[name=username]').should('have.attr', 'type', 'text').type(testUser.username)

    cy.get('[name=email]').should('have.attr', 'type', 'text').type(testUser.email)

    cy.get('[name=password]').should('have.attr', 'type', 'password').type(testUser.password)

    cy.get('[name=tc]').should('have.attr', 'type', 'checkbox').click()

    cy.contains('Register').click()

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

    cy.get('[name=title]').type('This is a test story')

    cy.get('[name=product]').select('EOS Icons')

    cy.get('[name=category]').select('Documentation')

    cy.get('[name=priority]').select('High')

    cy
      .get('[data-cy=description-editor]')
      .type('{enter}Testing User Story')

    cy.contains('Submit').click()

    cy.url().should('equal', 'http://localhost:3000/')
  })

  it('Displays story in home page, once created', () => {
    cy.get('[data-cy=stories]').contains('This is a test story').click()

    cy.url().should('contain', 'story')
  })

  it('Displays the data from template text', () => {
    cy.contains('What is the issue?')  // Data from the template text
  })

  it('Allows user to edit the story created by them', () => {
    cy.contains('Edit').click()

    cy.get('[data-cy=edit-description]').type('Edited story description')

    cy.get('[data-cy=story-buttons]').contains('Save').click()

    cy.get('[data-cy=story-description]').contains('Edited story description')
  })

  it('Allows user to comment on a story', () => {
    cy.get('[href="/"]').click()

    cy.get('[data-cy=stories]').contains('Testing my story').click()

    cy.get('[name="addComment"]').type('Testing comments')

    cy.get('[data-cy=btn-comment]').contains('Add Comment').click()

    cy.get('[data-cy=comment-content] > .link').contains(testUser.username)

    cy.get('[data-cy=comment-content] > p').contains('Testing comments')
  })
})
