/// <reference types="cypress" />

describe('Tests for story page', () => {
  const testUser = Cypress.env("testUser")

  const testStory = {
    ...Cypress.env("testStory"),
    ...{
      priority: 'High',
      description: '{enter}Testing User Story',
      descriptionText: 'Testing User Story'
    }
  }

  const editedDescription = 'Edited story description'
  const testComment = 'Testing comments'

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
  
  before('Navigate to the story created by the user',()=>{
    
    // Enter story title in seacrh bar and click on search button
    cy.get('[data-cy=search-input]').type(testStory.title)
    
    cy.get('[data-cy=btn-search]').click()

    // click on the story
    cy.get('[data-cy=story-row]').first().click({ force: true})

    cy.wait(1500)
    
    cy.url().should('contain', `story`)

  })
  
  beforeEach(() => {
    Cypress.Cookies.preserveOnce('token')
    cy.restoreLocalStorage()

    cy.wait(500)
  })

  afterEach(() => {
    cy.saveLocalStorage()
  })

  it('Displays the details of the story', () => {
    
    cy.contains(testStory.title)

    cy.contains(testStory.descriptionText)

    cy.contains(testUser.username)

    cy.get('div.story-votes-count').should('contain','0')

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

    cy.wait(1000)

    cy.get('[data-cy=comment-input-2]').type(testComment)

    cy.get('[data-cy=btn-comment-2]').click()

    cy.get('[data-cy=comment-content]').contains(testComment)

    cy.get('[data-cy=comment-username]').contains(testUser.username).click()

    cy.url().should('contain', 'profile')

    cy.go('back')
  })
  
  it('Allows user to share a story',()=>{

    cy.wait(1000)
    
    // For sharing on social media
    cy.get('[data-cy=share-story-btn]').click()
    
    cy.contains('Share')
    
    cy.get('[data-cy=twitter-share-btn]').should('exist')
    
    cy.get('[data-cy=linkedin-share-btn]').should('exist')
    
    cy.get('span.close-icon').click()

  })

  it('Allows user to vote a story',()=>{

    cy.wait(1000)
    
    // Initially no one has voted for the story
    cy.get('[data-cy=story-votes-count]').should('contain','0')
    
    // click on the vote button 
    cy.get('[data-cy=story-vote-btn]').click()
    
    // check if vote count has increased
    cy.get('[data-cy=story-votes-count]').should('contain','1')

  })

})
