describe('Test spec', () => {
  before(() => {
    cy.visit('/')
  })

  it('Has tell us your story', () => {
    cy.contains('TELL US YOUR STORY')
  })

  it('Has Add profile image update feature', () => {
    cy.contains('Add profile image update feature')
  })
})
