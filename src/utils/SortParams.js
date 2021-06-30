const SortParams = [
  {
    name: 'Most Voted',
    comparator: (a, b) => {
      return a.followers.length > b.followers.length ? -1 : 1
    }
  },
  {
    name: 'Most Discussed',
    comparator: (a, b) => {
      return a.user_story_comments.length > b.user_story_comments.length
        ? -1
        : 1
    }
  }
]

export default SortParams
