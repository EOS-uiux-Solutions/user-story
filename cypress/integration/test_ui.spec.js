describe('Test UI elements', () => {
  before(() => {
    cy.visit('/')
  })

  it('Has tell us your story', () => {
    cy.contains('TELL US YOUR STORY')
  })
})
