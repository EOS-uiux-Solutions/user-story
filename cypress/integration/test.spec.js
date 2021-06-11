describe('Test spec', () => {
  before(() => {
    cy.visit('/')
  })

  it('Has tell use your story', () => {
    cy.contains('TELL US YOUR STORY')
  })
})
