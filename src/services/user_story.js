import apiCall, { deleteCall } from './api'
import {
  BASIC_STORY_INFO_FRAGMENT,
  NOTIFICATION_DATA_FRAGMENT
} from './gql_fragments'

const userStory = {
  createStory: (data) => {
    return apiCall('/user-stories', data)
  },
  deleteStory: (storyId) => {
    return apiCall(`/user-stories/${storyId}`, null, 'delete')
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
  getAllStories: (
    page,
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
  getStories: (
    page,
    currentStateSelected,
    authorId,
    authorQuery,
    categoryQuery,
    productQuery,
    searchQuery,
    followerId,
    sortType,
    isRoadmapView
  ) => {
    authorId = !authorId ? '' : `id: "${authorId}"`
    followerId = !followerId ? '' : `followers: "${followerId}"`
    const storiesQuery = {
      query: `query {
              userStories(sort: "${sortType}", 
              ${!isRoadmapView ? 'limit: 5' : ''}, 
              start: ${isRoadmapView ? 0 : (page - 1) * 5}, where: {
                  ${
                    currentStateSelected !== 'All' && isRoadmapView
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
            profilePicture {
              id
              url
            }
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
    followerId,
    checked
  ) => {
    authorId = !authorId ? '' : `id: "${authorId}"`
    followerId = !followerId ? '' : `followers: "${followerId}"`
    const storyCountQuery = {
      query: `query {
              userStoriesConnection(where: {
                ${
                  currentStateSelected !== 'All' && checked
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
  updateUserStoryStatus: (storyId, statusId) => {
    const updateQuery = {
      query: `mutation {
        updateUserStory(
          input: { where: { id: "${storyId}" }, data: { user_story_status: "${statusId}" } }
        ) {
          userStory {
            updatedAt
          }
        }
      }`
    }
    return apiCall('/graphql', updateQuery)
  },
  getStatuses: () => {
    const statusQuery = {
      query: `{
        userStoryStatuses {
          id
          Status
          icon_name
        }
      }`
    }
    return apiCall('/graphql', statusQuery)
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
          _id
          Name
          Bio
          username
          Company
          Profession
          email
          LinkedIn
          Twitter
          access_role {
            name
            permissions {
              id
              name
            }
          }
        }
      }
      `
    }
    return apiCall('/graphql', userQuery)
  },
  getUserDetailsByUsername: (username) => {
    const userQuery = {
      query: `query {
        users(where: {
          username: "${username}"
        }) {
          profilePicture {
            id
            url
          }
          _id
          Name
          Bio
          username
          Company
          Profession
          email
          LinkedIn
          Twitter
          access_role {
            name
          }
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
              profilePicture{
                url
              }
            }
            createdAt
            attachment {
              url
              id
            }
            user_story_comment_replies {
              id
              createdAt
              Comments
              user {
                id
                username
                profilePicture{
                  url
                }
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
  updateComment: (id, data) => {
    const updateQuery = {
      query: `mutation {
        updateUserStoryComment(
          input: { where: { id: "${id}" }, data: { Comments: "${data}" } }
        ) {
          userStoryComment {
            Comments
          }
        }
      }`
    }
    return apiCall('/graphql', updateQuery)
  },
  deleteComment: (id) => {
    return deleteCall(`/user-story-comments/${id}`)
  },
  updateCommentReply: (id, data) => {
    const updateQuery = {
      query: `mutation {
        updateUserStoryCommentThread(
          input: { where: { id: "${id}" }, data: { Comments: "${data}" } }
        ) {
          userStoryCommentThread {
            Comments
          }
        }
      }`
    }
    return apiCall('/graphql', updateQuery)
  },
  deleteCommentReply: (id) => {
    return deleteCall(`/user-story-comment-threads/${id}`)
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
  },
  getSimilarStoriesByAuthor: (authorId, currentStoryId) => {
    authorId = !authorId ? '' : `id: "${authorId}"`
    const similarStoriesQuery = {
      query: `query {
              userStories(sort: "createdAt:desc", limit: 4, where: {
                  author: {
                    ${authorId}
                  }
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
    return apiCall('/graphql', similarStoriesQuery)
  },
  getPermissionsById: (userId) => {
    const permissionsQuery = {
      query: `
        query {
          user(id: "${userId}") {
            id
            Name
            access_role {
              permissions {
                id
                name
              }
            }
          }
        }
      `
    }
    return apiCall('/graphql', permissionsQuery)
  },
  deleteStory: (storyId) => {
    return deleteCall(`/user-stories/${storyId}`)
  },
  addNewStatus: (status, icon) => {
    return apiCall('/user-story-statuses', {
      Status: status,
      icon_name: icon
    })
  }
}

export default userStory
