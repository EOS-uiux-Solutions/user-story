/// <reference types="cypress" />

describe('Test new User Registration Workflow', () => {
  const testUser = {
    username: Cypress.env('testUsername'),
    email: Cypress.env('testUserEmail'),
    password: Cypress.env('testUserPassword')
  }

  const testStory = {
    title: Cypress.env('testStoryTitle'),
    product: Cypress.env('testStoryProduct'),
    category: Cypress.env('testCategory'),
    priority: 'High',
    description: '{enter}Testing User Story'
  }

  const editedDescription = 'Edited story description'
  const testComment = 'Testing comments'

  before('Test new user registration', () => {
    cy.visit('/')

    cy.get('[data-cy=btn-signin]').click()

    cy.url().should('equal', `${Cypress.config().baseUrl}/login`)

    cy.get('[data-cy=link-create-account]').click()

    cy.url().should('equal', `${Cypress.config().baseUrl}/register`)

    cy.get('[data-cy=username]').type(testUser.username)

    cy.get('[data-cy=email]').type(testUser.email)

    cy.get('[data-cy=password]')
      .should('have.attr', 'type', 'password')
      .type(testUser.password)

    cy.get('[data-cy=tc]').click()

    cy.get('[data-cy=btn-register]').click()

    cy.url().should('equal', `${Cypress.config().baseUrl}/`)

    cy.saveLocalStorage()
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('token')
    cy.restoreLocalStorage()
  })

  afterEach(() => {
    cy.saveLocalStorage()
  })

  describe('Test New Story page', () => {
    it('Allows user to create new story', () => {
      cy.get('[data-cy=btn-new-story]').click()

      cy.url().should('equal', `${Cypress.config().baseUrl}/newStory`)

      cy.get('[data-cy=title]').type(testStory.title)

      cy.get('[data-cy=product]').select(testStory.product)

      cy.get('[data-cy=category]').select(testStory.category)

      cy.get('[data-cy=priority]').select(testStory.priority)

      cy.get('[data-cy=description-editor]').type(testStory.description)

      cy.get('[data-cy=btn-submit]').click()

      cy.url().should('equal', `${Cypress.config().baseUrl}/`)
    })
  })

  describe('Test Home page', () => {
    it('Displays story in home page, once created', () => {
      cy.get('[data-cy=stories]').contains(testStory.title).click()

      cy.url().should('contain', 'story')
    })
  })

  describe('Test Story Page', () => {
    it('Displays the data from template text', () => {
      cy.contains('What is the issue?') // Data from the template text
    })

    it('Allows user to edit the story created by them', () => {
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1500)

      cy.get('[data-cy=btn-edit]').click()

      cy.get('[data-cy=edit-description]').type(editedDescription)

      cy.get('[data-cy=btn-save]').click()

      cy.get('[data-cy=story-description]').contains(editedDescription)
    })

    it('Allows user to comment on a story', () => {
      cy.get('[data-cy=comment-input-2]').type(testComment)

      cy.get('[data-cy=btn-comment-2]').click()

      cy.get('[data-cy=comment-content]').contains(testComment)

      cy.get('[data-cy=comment-username]').contains(testUser.username).click()

      cy.url().should('contain', 'profile')
    })
  })
})
