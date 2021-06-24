export const filterDescriptionText = (text) => {
  text = text.replace(/\\*"/g, '\\"') // Replace all occurences of " with \"
  text = text.replace(/[\r\n]/g, '') // Remove the line endings
  return text
}
