import { BASIC_STORY_INFO_FRAGMENT } from './gql_fragments'

export const getUserStoryQuery = ({
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

  authorQuery = authorQuery === '' ? '' : `username_contains: "${authorQuery}"`

  followers = followers === '' ? '' : `followers: "${followers}"`

  return `query {
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
