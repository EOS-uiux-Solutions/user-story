export const filterDescriptionText = (text) => {
  text = text.replace(/\\*"/g, '\\"') // Replace all occurences of " with \"
  text = text.replace(/[\r\n]/g, '') // Remove the line endings
  return text
}

export const strip = (html, len) => {
  html = html.replace(/<\s*[^>]*>/gi, '')
  if (html.length > len) {
    html = `${html.substring(0, len)}...`
  }
  return html
}

export const parseArrayToQuery = (queryParam, items) => {
  if (items.length === 0) return ''
  return `${queryParam}: ["${items.join(`", "`)}"]`
}
