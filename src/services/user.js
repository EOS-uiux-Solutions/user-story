import apiCall from './api'

const User = {
  updateUser: (user) => {
    const updateQuery = {
      query: `mutation {
        updateUser(input: {
          where: {
            id: "${user.id}"
          }
          data: {
            Name: "${user.Name ?? user.username}"
            Profession: "${user.Profession ?? ''}"
            Company: "${user.Company ?? ''}"
            LinkedIn: "${user.LinkedIn ?? ''}"
            Twitter: "${user.Twitter ?? ''}"
            Bio: "${user.Bio ?? ''}"
          }
        }) {
          user {
            username
          }
        }
      }`
    }
    return apiCall('/graphql', updateQuery)
  },
  getInfo: (id) => {
    const userQuery = {
      query: `query {
        user(id: "${id}") {
          profilePicture {
            id
            url
          }
          Name
          Bio
          username
          Company
          Profession
          email
          LinkedIn
          Twitter
        }
      }
      `
    }
    return apiCall('/graphql', userQuery)
  }
}

export default User
