/// <reference types="cypress" />

describe('Test new User Registration Workflow', () => {
  const testUser = {
    username: 'user5',
    email: 'test5@gmail.com',
    password: 'password',
  }

  before('Register a new user', () => {
    cy.visit('/')

    cy
      .get('[data-cy=btn-signin]')
      .should('have.attr', 'href', '/login')
      .contains('Sign In')
      .click()

    cy.url().should('equal', 'http://localhost:3000/login')

    cy
      .get('[data-cy=link-create-account]')
      .should('have.attr', 'href', '/register')
      .contains('Create an account')
      .click()

    cy.url().should('equal', 'http://localhost:3000/register')

    cy.get('[data-cy=username]').should('have.attr', 'type', 'text').type(testUser.username)

    cy.get('[data-cy=email]').should('have.attr', 'type', 'text').type(testUser.email)

    cy.get('[data-cy=password]').should('have.attr', 'type', 'password').type(testUser.password)

    cy.get('[data-cy=tc]').should('have.attr', 'type', 'checkbox').click()

    cy.get('[data-cy=btn-register]').contains('Register').click()

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
    cy
      .get('[data-cy=btn-new-story]')
      .should('have.attr', 'href', '/newStory')
      .contains('+ New Story')
      .click()

    cy.url().should('equal', 'http://localhost:3000/newStory')

    cy.get('[data-cy=title]').type('This is a test story')

    cy.get('[data-cy=product]').select('EOS Icons')

    cy.get('[data-cy=category]').select('Documentation')

    cy.get('[data-cy=priority]').select('High')

    cy
      .get('[data-cy=description-editor]')
      .type('{enter}Testing User Story')

    cy.get('[data-cy=btn-submit]').contains('Submit').click()

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
    cy.get('[data-cy=btn-edit]').contains('Edit').click()

    cy.get('[data-cy=edit-description]').type('Edited story description')

    cy.get('[data-cy=story-buttons]').contains('Save').click()

    cy.get('[data-cy=story-description]').contains('Edited story description')
  })

  it('Allows user to comment on a story', () => {
    cy.get('[data-cy=nav-eos-logo]').should('have.attr', 'href', '/').click()

    cy.get('[data-cy=stories]').contains('Testing my story').click()

    cy.get('[data-cy=comment-input]').type('Testing comments')

    cy.get('[data-cy=btn-comment]').contains('Add Comment').click()

    cy.get('[data-cy=comment-content]').contains('Testing comments')

    cy.get('[data-cy=comment-username]').contains(testUser.username).click()

    cy.url().should('contain', 'profile')
  })
})
