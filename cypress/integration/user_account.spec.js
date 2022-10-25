/// <reference types="cypress" />

describe("Tests for user's profile page", () => {
  const testUser = Cypress.env('testUser')

  const updatedUser = Cypress.env('updatedUser')

  // Function to update the detaiil of a user with the given text
  const updateDetail = (field, value) => {
    cy.get(`[data-cy=edit-${field}-btn]`).click({ force: true })

    cy.get(`[data-cy=edit-${field}]`).clear().type(value)

    // Save the edit
    cy.get('[data-cy=save-changes-btn]').click()

    cy.wait(1000)

    // check if the text has been updated
    cy.get(`[data-cy=user-${field}]`).contains(value)
  }

  before('Log in the user', () => {
    cy.visit('/')

    cy.get('[data-cy=btn-signin]').click()

    cy.url().should('equal', `${Cypress.config().baseUrl}/login`)

    cy.wait(500)

    cy.get('[data-cy=login-username]').type(testUser.username)

    cy.get('[data-cy=login-password]').type(testUser.password)

    cy.get('[data-cy=login-btn]').click()

    cy.url().should('equal', `${Cypress.config().baseUrl}/`)
  })

  before("Navigate to user's account page", () => {
    // Open the context menu on top right of the screen
    cy.get('[data-cy=user-dropdown-menu-btn]').click()

    cy.get('[data-cy=user-profile-btn]').click()

    // Naviage to the user's stories page
    cy.url().should('equal', `${Cypress.config().baseUrl}/myProfile`)
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('token')
    cy.restoreLocalStorage()
  })

  afterEach(() => {
    cy.saveLocalStorage()
  })

  it('Shows user details', () => {
    cy.wait(5000)

    cy.get('[data-cy=user-username]').contains(testUser.username)

    cy.get('[data-cy=user-email]').contains(testUser.email)

    cy.get('[data-cy=user-Bio]').contains('Say something about yourself')

    cy.get('[data-cy=user-Profession]').contains('Your job title')

    cy.get('[data-cy=user-Company]').contains('Your company name')

    cy.get('[data-cy=user-LinkedIn]').contains('Your LinkedIn username')

    cy.get('[data-cy=user-Twitter]').contains('Your Twitter handle')
  })

  it("Updates user's name", () => {
    updateDetail('Name', updatedUser.name)
  })

  it("Updates user's bio", () => {
    updateDetail('Bio', updatedUser.bio)
  })

  it("Updates user's details", () => {
    updateDetail('Profession', updatedUser.profession)

    updateDetail('Company', updatedUser.company)

    updateDetail('LinkedIn', updatedUser.linkedin)

    updateDetail('Twitter', updatedUser.twitter)
  })
})
