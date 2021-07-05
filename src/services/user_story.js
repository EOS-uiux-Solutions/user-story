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
  getStories: (
    page,
    currentStateSelected,
    authorQuery,
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
                    username_contains: "${authorQuery}"
                  }
                  ${categoryQuery}
                  ${productQuery}
                  ${searchQuery}
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
            user_story_comment_replies {
              createdAt
              Comments
              user {
                id
                username
              }
            }
          }
        }
       }`
    }
    return apiCall('/graphql', commentsQuery)
  },
  postComment: (addComment, storyId, id) => {
    const postCommentQuery = {
      query: `
      mutation {
        createUserStoryComment(input: {
          data: {
            Comments: "${addComment}"
            user_story: "${storyId}"
            user: "${id}"
          }
        }) {
          userStoryComment {
            id
            user {
              id
              username
            }
            Comments
            createdAt
            user_story_comment_replies {
              createdAt
              Comments
              user {
                id
                username
              }
            }
          }
        }
      }
      `
    }
    return apiCall('/graphql', postCommentQuery)
  },
  postCommentReply: (addReply, commentId, id) => {
    const postCommentReplyQuery = {
      query: `
      mutation {
        createUserStoryCommentThread (input: {
          data: {
            Comments: "${addReply}"
            user_story_comment: "${commentId}"
            user: "${id}"
          }
        }){
          userStoryCommentThread {
            createdAt
          }
        }
      }
      `
    }
    return apiCall('/graphql', postCommentReplyQuery)
  },
  getNotificationsByUserId: (userId) => {
    const getNotificationsByUserIdQuery = {
      query: `query {
      userStoryNotifications (where: {
        users: {
          id: "${userId}"
        }
      }){
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
    return apiCall('/graphql', getNotificationsByUserIdQuery)
  },
  markNotificationAsRead: (notificationId, seenBy) => {
    const markNotificationAsReadQuery = {
      query: `mutation updateNotifications($seenBy: [ID]){
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
  }
}

export default userStory
