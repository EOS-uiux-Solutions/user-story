/// <reference types="cypress" />

describe("Authentication Tests", () => {

    const testUser = {
        username: Cypress.env('testUsername'),
        email: Cypress.env('testUserEmail'),
        password: Cypress.env('testUserPassword')
    }

    beforeEach('visit the page and wait it to load', () => {

        cy.visit('/')

        cy.wait(1000)
    })

    /**
     * @success
     */
    it("Registers new user", () => {


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
    })


    it("Signs in an existing user", () => {

        cy.get('[data-cy=btn-signin]').click()

        cy.url().should('equal', `${Cypress.config().baseUrl}/login`)

        cy.wait(500)

        cy.get('[data-cy=login-username]').type(testUser.username)

        cy.get('[data-cy=login-password]').type(testUser.password)

        cy.get('[data-cy=login-btn]').click()

        cy.url().should('equal', `${Cypress.config().baseUrl}/`)

    })


    /**
     * @failure
     */
    it("Should not register using already registered credentials", () => {

        cy.get('[data-cy=btn-signin]').click()

        cy.url().should('equal', `${Cypress.config().baseUrl}/login`)

        cy.get('[data-cy=link-create-account]').click()

        cy.url().should('equal', `${Cypress.config().baseUrl}/register`)

        cy.get('[data-cy=username]').type(testUser.username)

        cy.get('[data-cy=email]').type(testUser.email) //Using already registered email address

        cy.get('[data-cy=password]')
            .should('have.attr', 'type', 'password')
            .type(testUser.password)

        cy.get('[data-cy=tc]').click()

        cy.get('[data-cy=btn-register]').click()

        cy.contains("Email is already taken")
    })

    it("Should not register using invalid details", () => {


        cy.get('[data-cy=btn-signin]').click()

        cy.url().should('equal', `${Cypress.config().baseUrl}/login`)

        cy.get('[data-cy=link-create-account]').click()

        cy.url().should('equal', `${Cypress.config().baseUrl}/register`)

        cy.get('[data-cy=username]').type(testUser.username)

        cy.get('[data-cy=email]').type(Math.random() * 1000) //Invalid email address

        cy.get('[data-cy=password]')
            .should('have.attr', 'type', 'password') // Password not provided

        cy.get('[data-cy=tc]').click()

        cy.get('[data-cy=btn-register]').click()

        cy.contains("This is required")
    })


    it("Should not register without agreeing to terms and conditions", () => {

        cy.get('[data-cy=btn-signin]').click()

        cy.url().should('equal', `${Cypress.config().baseUrl}/login`)

        cy.get('[data-cy=link-create-account]').click()

        cy.url().should('equal', `${Cypress.config().baseUrl}/register`)

        cy.get('[data-cy=username]').type(testUser.username)

        cy.get('[data-cy=email]').type(Math.random() * 1000)

        cy.get('[data-cy=password]')
            .should('have.attr', 'type', 'password')
            .type(testUser.password)

        // Do not click on the checkbox

        cy.get('[data-cy=btn-register]').click()

        cy.contains("You must accept our Terms and Conditions")
    })


    it("Should not login using invalid credentials", () => {

        cy.get('[data-cy=btn-signin]').click()

        cy.url().should('equal', `${Cypress.config().baseUrl}/login`)

        cy.get('[data-cy=login-username]').type(testUser.username)

        cy.get('[data-cy=login-password]').type(Math.random() * 1000) //Invalid password

        cy.get('[data-cy=login-btn]').click()

        cy.contains("Identifier or password invalid")
    })

})
