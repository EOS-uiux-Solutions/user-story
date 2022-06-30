import apiCall from './api'
import {
  BASIC_STORY_INFO_FRAGMENT,
  NOTIFICATION_DATA_FRAGMENT
} from './gql_fragments'

const userStory = {
  createStory: (data) => {
    return apiCall('/user-stories', data)
  },
  checkAuthor: (userId, storyId) => {
    return apiCall('/checkAuthor', {
      id: userId,
      storyId: storyId
    })
  },
  getStoriesByTitle: (title) => {
    const query = {
      query: `query {
        userStories(sort: "votes:desc,createdAt:desc", where: {
          Title_contains: "${title}"
        }) {
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
    authorId,
    authorQuery,
    categoryQuery,
    productQuery,
    searchQuery,
    followerId
  ) => {
    authorId = !authorId ? '' : `id: "${authorId}"`
    followerId = !followerId ? '' : `followers: "${followerId}"`
    const storiesQuery = {
      query: `query {
              userStories(sort: "createdAt:desc", limit: 5, start: ${
                (page - 1) * 5
              }, where: {
                  ${
                    currentStateSelected !== 'All'
                      ? `user_story_status : {
                      Status: "${currentStateSelected}"
                    },`
                      : ''
                  }
                  author: {
                    ${authorId}
                    username_contains: "${authorQuery}"
                  }
                  ${categoryQuery}
                  ${productQuery}
                  ${searchQuery}
                  ${followerId}
              }) {
                id
                Title
                Description
                user_story_status {
                  Status
                }
                user_story_comments {
                  Comments
                }
                product {
                  Name
                }
                Attachment {
                  id
                  url
                }
                author {
                  id
                  username
                  profilePicture {
                    id
                    url
                  }
                }
                followers {
                  id
                  username
                }
                Category
                createdAt
              }
            }
            `
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
          user_story_comments {
            Comments
          }
          author {
            id
            username
          }
          Attachment {
            id
            url
          }
          createdAt
          product {
            Name
            logo {
              url
            }
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
    authorId,
    authorQuery,
    categoryQuery,
    productQuery,
    searchQuery,
    followerId
  ) => {
    authorId = !authorId ? '' : `id: "${authorId}"`
    followerId = !followerId ? '' : `followers: "${followerId}"`
    const storyCountQuery = {
      query: `query {
              userStoriesConnection(where: {
                ${
                  currentStateSelected !== 'All'
                    ? `user_story_status : {
                    Status: "${currentStateSelected}"
                  },`
                    : ''
                }
                author: {
                  ${authorId}
                  username_contains: "${authorQuery}"
                }
                ${categoryQuery}
                ${productQuery}
                ${searchQuery}
                ${followerId}
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
                logo {
                  url
                }
              }
            }`
    }
    return apiCall('/graphql', productQuery)
  },
  getProductCount: () => {
    const productCountQuery = {
      query: `query {
        productsConnection {
          aggregate {
            count
          }
        }
      }`
    }
    return apiCall('/graphql', productCountQuery)
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
  getNotificationsByUserId: (userId) => {
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
  markNotificationAsRead: (notificationId, seenBy) => {
    const markNotificationAsReadQuery = {
      query: `mutation updateNotifications($seenBy: [ID]) {
        updateUserStoryNotification(input: {
          where: {
            id: "${notificationId}"
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
    return apiCall('/graphql', markNotificationAsReadQuery)
  },
  getUserDetails: (userId) => {
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
  getUsers: () => {
    const getUsersQuery = {
      query: `
      query {
        users {
          id
          display: username
        }
      }`
    }
    return apiCall('/graphql', getUsersQuery)
  },
  getComments: (storyId) => {
    const commentsQuery = {
      query: `
      query {
        userStory(id: "${storyId}") {
          user_story_comments {
            id
            Comments
            user {
              id
              username
            }
            createdAt
            attachment {
              url
              id
            }
            user_story_comment_replies {
              createdAt
              Comments
              user {
                id
                username
              }
              attachment {
                id
                url
              }
            }
          }
        }
       }`
    }
    return apiCall('/graphql', commentsQuery)
  },
  postComment: (data) => {
    return apiCall('/user-story-comments', data)
  },
  postCommentReply: (data) => {
    return apiCall('/user-story-comment-threads', data)
  },
  updateVotes: (storyId, updatedFollowerIds) => {
    const updateVotesQuery = {
      query: `
      mutation {
        updateUserStory(input: {where: {id: "${storyId}"} data: {followers: [${updatedFollowerIds}]}}){
          userStory{
            followers {
              id
            }
          }
        }
      }
      `
    }
    return apiCall('/graphql', updateVotesQuery)
  }
}

export default userStory
