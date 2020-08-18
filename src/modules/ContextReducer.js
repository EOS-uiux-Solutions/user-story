export const ContextReducer = (state, action) => {
  switch (action.type) {
    case 'AUTHENTICATE':
      return {
        ...state,
        auth: true
      }
    case 'DEAUTHENTICATE':
      return {
        ...state,
        auth: false
      }
    case 'ERROR':
      return {
        ...state,
        errorCode: action.payload
      }
    default:
      return state
  }
}

export default ContextReducer
