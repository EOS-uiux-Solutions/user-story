import apiCall from './api'

const BASIC_STORY_INFO_FRAGMENT = `fragment BasicStoryInfo on UserStory {
  id
  Title
  Description
  followers {
    id
    username
  }
}`

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
  getStories: (
    page,
    currentStateSelected,
    userQuery,
    categoryQuery,
    productQuery,
    searchQuery
  ) => {
    const storiesQuery = {
      query: `query {
              userStories(sort: "createdAt:desc", limit: 5, start: ${
                (page - 1) * 5
              }, where: {
                  user_story_status : {
                    Status: "${currentStateSelected}"
                  },
                  author: {
                    username_contains: "${userQuery}"
                  }
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
    userQuery,
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
                  username_contains: "${userQuery}"
                }
                ${productQuery},
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
  getPolicyNotifications: () => {
    const policyQuery = {
      query: `query {
            userStoryNotifications(where: {message: "User story privacy policy has been updated"}) {
              message
              id
              users {
                id
              }
              seenBy {
                id
              }
              date
              link
            }
          }`
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
