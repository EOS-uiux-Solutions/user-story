/// <reference types="cypress" />

describe("Tests for creating a new story", () => {
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

    before('Log in the user', () => {
        cy.visit('/')

        cy.get('[data-cy=btn-signin]').click()

        cy.url().should('equal', `${Cypress.config().baseUrl}/login`)

        cy.wait(1500)

        cy.get('[data-cy=login-username]').type(testUser.username)

        cy.get('[data-cy=login-password]').type(testUser.password)

        cy.get('[data-cy=login-btn]').click()

        cy.url().should('equal', `${Cypress.config().baseUrl}/`)
    })

    beforeEach(() => {
        Cypress.Cookies.preserveOnce('token')
        cy.restoreLocalStorage()
    })

    afterEach(() => {
        cy.saveLocalStorage()
    })

    it('Allows user to create new story', () => {

        // Naviage to new story page
        cy.get('[data-cy=btn-new-story]').click()

        cy.url().should('equal', `${Cypress.config().baseUrl}/newStory`)

        cy.wait(1000)

        // Enter data of the new story
        cy.get('[data-cy=title]').type(testStory.title)

        cy.get('[data-cy=product]').select(testStory.product)

        cy.get('[data-cy=category]').select(testStory.category)

        cy.get('[data-cy=priority]').select(testStory.priority)

        cy.get('[data-cy=description-editor]').type(testStory.description)

        // Click on submit button to add a new story
        cy.get('[data-cy=btn-submit]').click()

        // Redirect to dashboard if story added successfully
        cy.url().should('equal', `${Cypress.config().baseUrl}/`)
    })

    it('Shows the new story in dashboard, once created', () => {

        // Enter story title in seacrh bar and click on search button
        cy.get('[data-cy=search-input]').type(testStory.title)

        cy.get('[data-cy=btn-search]').click()

        // Check if a story has same title and username
        cy.contains(testStory.title)

        cy.contains(testUser.username)
    })

    it('Shows the new story in user\'s stories , once created', () => {

        // Open the context menu on top right of the screen
        cy.get('[data-cy=user-dropdown-menu-btn]').click()

        cy.get('[data-cy=user-stories-btn]').click()

        // Naviage to the user's stories page
        cy.url().should('equal', `${Cypress.config().baseUrl}/myStories`)

        // Enter story title in search box and click on search button
        cy.get('[data-cy=search-input]').type(testStory.title)

        cy.get('[data-cy=btn-search]').click()

        // check if a story has same name and username
        cy.contains(testStory.title)

        cy.contains(testUser.username)
    })
})