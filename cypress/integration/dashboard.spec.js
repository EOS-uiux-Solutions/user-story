/// <reference types="cypress" />

describe('Tests for dashboard',()=>{

  before(()=>{
    cy.visit('/')
  })

  it('Shows the dashboard',()=>{
    cy.get('[data-cy=dashboard-heading]').contains('TELL US YOUR STORY')
  })
})


describe('Test the filters and search for stories in Home page', () => {
  const testStory = {
    title: Cypress.env('testStoryTitle'),
    product: Cypress.env('testStoryProduct'),
    category: Cypress.env('testCategory')
  }

  const testUser = {
    username: Cypress.env('testUsername')
  }

  const selectProduct = (productName) => {
    cy.get(`[data-cy=${productName.split(' ').join('-')}-card]`).click({
      force: true
    })
  }

  const setDropdown = (dropdown, value) => {
    cy.get('[data-cy=search-input-div]')
      .get(`[data-cy=${dropdown}-dropdown]`)
      .click()
    cy.contains(value).click({ force: true })
  }

  const searchByTitle = (value) => {
    cy.get('[data-cy=search-input]').type(value)
    cy.get('[data-cy=btn-search]').click()
  }

  const typeOnSearch = (value) => {
    cy.get('[data-cy=search-input]').type(value)
  }

  const clearSearchInput = () => {
    cy.get('[data-cy=btn-clear]').click({ force: true })
  }

  before(() => {
    cy.visit('/')
  })

  it('Filters stories based on product', () => {
    selectProduct('EOS User Story')

    cy.contains('No stories')

    selectProduct(testStory.product)

    cy.contains(testStory.title)

    selectProduct(testStory.product)
  })

  it('Filters stories based on category', () => {
    setDropdown('category', 'Bug')

    cy.contains('No stories')

    setDropdown('category', testStory.category)

    cy.contains(testStory.title)
  })

  it('Searches stories based on title', () => {
    searchByTitle('random')

    cy.contains('No stories')

    clearSearchInput()

    searchByTitle('test')

    cy.contains(testStory.title)

    clearSearchInput()
  })

  it('Searches stories based on author', () => {
    setDropdown('toggle-title', 'Author')

    typeOnSearch('un')
    cy.get('[data-cy=search-input-div]').contains('No users found')

    clearSearchInput()

    typeOnSearch(testUser.username.slice(0,2))
    cy.get('[data-cy=search-input-div]')
      .contains(testUser.username)
      .click({ force: true })

    cy.contains(testStory.title)
  })
})
