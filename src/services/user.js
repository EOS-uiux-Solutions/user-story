import apiCall from './api'
import { BASIC_STORY_INFO_FRAGMENT } from './gql_fragments'

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
  getInfo: (userId) => {
    const userQuery = {
      query: `query {
        user(id: "${userId}") {
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
  },
  getUserStoriesByUser: (userId) => {
    const userQuery = {
      query: `query {
        user(id: "${userId}") {
          user_stories {
            ...BasicStoryInfo
            user_story_status {
              Status
            }
            product {
              Name
            }
            author {
              id
              username
            }
            user_story_comments {
              Comments
            }
            Category
          }
        }
      }
      ${BASIC_STORY_INFO_FRAGMENT}
      `
    }
    return apiCall('/graphql', userQuery)
  }
}

export default User
