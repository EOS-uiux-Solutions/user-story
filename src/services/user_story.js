import apiCall from './api'
import {
  BASIC_STORY_INFO_FRAGMENT,
  NOTIFICATION_DATA_FRAGMENT
} from './gql_fragments'

const userStory = {
  createStory: ({ description, title, category, product, priority }) => {
    const createQuery = {
      query: `mutation {
        createUserStory(
          input: {
            data: {
              Description: "${description}"
              Title: "${title}"
              Category: ${category}
              product: "${product}"
              Priority: ${priority}
            }
          }
        ) {
          userStory {
            createdAt
          }
        }
      }
      `
    }
    return apiCall('/graphql', createQuery)
  },
  getAllStories: () => {
    const query = {
      query: `query {
        userStories(sort: "votes:desc,createdAt:desc") {
          ...BasicStoryInfo
        }
      }
      ${BASIC_STORY_INFO_FRAGMENT}
      `
    }
    return apiCall('/graphql', query)
  },
  getStories: ({
    sortBy = 'createdAt:desc',
    limit = null,
    page = null,
    currentStateSelected = '',
    authorId = '',
    authorQuery = '',
    categoryQuery = '',
    productQuery = '',
    searchQuery = '',
    followers = ''
  }) => {
    page = !page || !limit ? '' : `start: ${(page - 1) * limit}`

    limit = !limit ? '' : `limit: ${limit}`

    currentStateSelected =
      currentStateSelected === ''
        ? ''
        : `user_story_status : {
            Status: "${currentStateSelected}"
          }`

    authorId = authorId === '' ? '' : `id: "${authorId}"`

    authorQuery =
      authorQuery === '' ? '' : `username_contains: "${authorQuery}"`

    followers = followers === '' ? '' : `followers: "${followers}"`

    const storiesQuery = {
      query: `query {
              userStories(
                sort: "${sortBy}"
                ${limit}
                ${page}
                where: {
                  author: {
                    ${authorId}
                    ${authorQuery}
                  }
                  ${followers}
                  ${currentStateSelected}
                  ${categoryQuery}
                  ${productQuery}
                  ${searchQuery}
              }) {
                ...BasicStoryInfo
                user_story_status {
                  Status
                }
                user_story_comments {
                  Comments
                }
                product {
                  Name
                }
                author {
                  id
                  username
                  profilePicture {
                    id
                    url
                  }
                }
                Category
              }
            }
            ${BASIC_STORY_INFO_FRAGMENT}
            `
    }
    return apiCall('/graphql', storiesQuery)
  },
  getStoryCount: (
    currentStateSelected,
    authorQuery,
    categoryQuery,
    productQuery,
    searchQuery
  ) => {
    const storyCountQuery = {
      query: `query {
              userStoriesConnection(where: {
                user_story_status: {
                  Status: "${currentStateSelected}"
                },
                author: {
                  username_contains: "${authorQuery}"
                }
                ${categoryQuery}
                ${productQuery}
                ${searchQuery}
              }) {
                aggregate {
                  count
                }
              }
            }`
    }
    return apiCall('/graphql', storyCountQuery)
  },
  getCategories: () => {
    const categoryQuery = {
      query: '{ __type(name: "ENUM_USERSTORY_CATEGORY") {enumValues {name}}}'
    }
    return apiCall('/graphql', categoryQuery)
  },
  getPriorities: () => {
    const priorityQuery = {
      query: `query { __type(name: "ENUM_USERSTORY_PRIORITY") {enumValues {name}}}`
    }
    return apiCall('/graphql', priorityQuery)
  },
  getProducts: () => {
    const productQuery = {
      query: `query {
              products {
                Name
              }
            }`
    }
    return apiCall('/graphql', productQuery)
  },
  getProductsWithTemplates: () => {
    const productQuery = {
      query: `query {
              products {
                id
                Name
                product_template
              }
            }`
    }
    return apiCall('/graphql', productQuery)
  },
  getNotifications: (userId) => {
    const notificationQuery = {
      query: `query {
        userStoryNotifications (where: {
          users: {
            id: "${userId}"
          }
        }){
          ...NotificationData
        }
      }
      ${NOTIFICATION_DATA_FRAGMENT}
      `
    }
    return apiCall('/graphql', notificationQuery)
  },
  getPolicyNotifications: () => {
    const policyQuery = {
      query: `query {
            userStoryNotifications(where: {message: "User story privacy policy has been updated"}) {
              ...NotificationData
            }
          }
          ${NOTIFICATION_DATA_FRAGMENT}
          `
    }
    return apiCall('/graphql', policyQuery)
  },
  updateNotifications: (policyId, seenBy) => {
    const notificationQuery = {
      query: `mutation updateNotifications($seenBy: [ID]){
              updateUserStoryNotification(input: {
                where: {
                  id: "${policyId}"
                }
                data: {
                  seenBy: $seenBy
                }
              }) {
                userStoryNotification {
                  id
                }
              }
            }`,
      variables: {
        seenBy: seenBy
      }
    }
    return apiCall('/graphql', notificationQuery)
  }
}

export default userStory
