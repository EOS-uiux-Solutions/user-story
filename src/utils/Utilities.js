export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('user', JSON.stringify(action.payload.user))
      localStorage.setItem('token', JSON.stringify(action.payload.jwt))
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.jwt
      }
    case 'LOGOUT':
      localStorage.clear()
      return {
        ...state,
        isAuthenticated: false,
        user: null
      }
    case 'SIGNUP':
      localStorage.setItem('user', JSON.stringify(action.payload.user))
      localStorage.setItem('token', JSON.stringify(action.payload.jwt))
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.jwt
      }
    default:
      return state
  }
}
