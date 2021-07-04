import apiCall from './api'
import { getUserStoryQuery } from './utils/getUserStoryQuery'
import {
  BASIC_STORY_INFO_FRAGMENT,
  NOTIFICATION_DATA_FRAGMENT
} from './utils/gql_fragments'

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
  checkAuthor: (userId, storyId) => {
    return apiCall('/checkAuthor', {
      id: userId,
      storyId: storyId
    })
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
  getStories: (filters) => {
    const storiesQuery = {
      query: getUserStoryQuery(filters)
    }
    return apiCall('/graphql', storiesQuery)
  },
  getStory: (storyId) => {
    const storyQuery = {
      query: `query {
        userStory(id: "${storyId}") {
          ...BasicStoryInfo
          user_story_status {
            Status
          }
          author {
            id
            username
          }
        }
      }
      ${BASIC_STORY_INFO_FRAGMENT}
      `
    }
    return apiCall('/graphql', storyQuery)
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
  updateUserStoryDescription: (storyId, description) => {
    const updateQuery = {
      query: `mutation {
        updateUserStory(
          input: { where: { id: "${storyId}" }, data: { Description: "${description}" } }
        ) {
          userStory {
            updatedAt
          }
        }
      }`
    }
    return apiCall('/graphql', updateQuery)
  },
  getCategories: () => {
    const categoryQuery = {
      query: '{ __type(name: "ENUM_USERSTORY_CATEGORY") {enumValues {name}}}'
    }
    return apiCall('/graphql', categoryQuery)
  },
  getPolicies: () => {
    const policyQuery = {
      query: `query {
        userStoryPolicies {
          Description
        }
      }`
    }
    return apiCall('/graphql', policyQuery)
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
