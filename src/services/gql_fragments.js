export const BASIC_STORY_INFO_FRAGMENT = `fragment BasicStoryInfo on UserStory {
  id
  Title
  Description
  followers {
    id
    username
    profilePicture {
      id
      url
    }
  }
}`

export const NOTIFICATION_DATA_FRAGMENT = `fragment NotificationData on UserStoryNotification {
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
}`
