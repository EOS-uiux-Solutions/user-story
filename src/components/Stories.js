import React, { useState, useEffect, useRef, useCallback } from 'react'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import { DragDropContext } from 'react-beautiful-dnd'

// components
import StoriesList from './StoriesList'
import Pagination from './Pagination'
import Dropdown from './Dropdown'
import ProductList from './ProductList'
import RoadmapFilter from './roadmap-filter'
import Switch from './Switch'
import StatusContainer from './StatusContainer'
// others
import SearchInput from '../modules/SearchInput'
import Lists from '../utils/Lists'
import userStory from '../services/user_story'
import toast from 'react-hot-toast'

const Stories = ({ authorId, followerId, userId }) => {
  const [currentStateSelected, selectState] = useState('All')

  const [page, setPage] = useState(1)

  const [sort, setSort] = useState('Most Voted')

  const [category, setCategory] = useState('All')

  const [categories, setCategories] = useState([])

  const [searchTerm, setSearchTerm] = useState('')

  const { promiseInProgress } = usePromiseTracker({ area: 'stories-div' })

  const [storyCount, setStoryCount] = useState()

  const [stories, setStories] = useState([])

  const sortDropdownContainer = useRef()

  const categoryDropdownContainer = useRef()

  const [productQuery, setProductQuery] = useState(``)

  const [categoryQuery, setCategoryQuery] = useState(``)

  const [searchQuery, setSearchQuery] = useState('')

  const [userTerm, setUserTerm] = useState('')

  const [authorQuery, setAuthorQuery] = useState('')

  const [sortType, setSortType] = useState('followers:desc')

  const [isRoadmapView, setIsRoadmapView] = useState(false)

  const [isDragDisabled, setIsDragDisabled] = useState(true)

  const [statusList, setStatusList] = useState([])

  const getPage = useCallback((page) => {
    setPage(page)
  }, [])

  useEffect(() => {
    const fetchStoryCount = async () => {
      const response = await userStory.getStoryCount(
        currentStateSelected,
        authorId,
        authorQuery,
        categoryQuery,
        productQuery,
        searchQuery,
        followerId,
        isRoadmapView
      )
      setStoryCount(response.data.data.userStoriesConnection.aggregate.count)
    }
    fetchStoryCount()
  }, [
    currentStateSelected,
    categoryQuery,
    productQuery,
    searchQuery,
    authorQuery,
    authorId,
    followerId,
    isRoadmapView
  ])

  useEffect(() => {
    if (category !== 'All') {
      setCategoryQuery(`Category : "${category}"`)
    } else {
      setCategoryQuery(``)
    }
    if (searchTerm === '') {
      setSearchQuery('')
    }
    if (userTerm === '') {
      setAuthorQuery('')
    }
  }, [category, searchTerm, userTerm])

  useEffect(() => {
    if (sort === 'Most Voted') {
      setSortType('followers:desc')
    } else if (sort === 'Most Discussed') {
      setSortType('comments:desc')
    }

    const fetchStories = async () => {
      const response = await userStory.getStories(
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
      )
      setStories(response.data.data.userStories)
    }
    trackPromise(fetchStories(), 'stories-div')
  }, [
    categoryQuery,
    currentStateSelected,
    page,
    productQuery,
    searchQuery,
    authorQuery,
    authorId,
    followerId,
    sortType,
    sort,
    isRoadmapView
  ])

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await userStory.getCategories()
      setCategories([
        'All',
        ...response.data.data.__type.enumValues.map((ele) => {
          return ele.name
        })
      ])
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const getPermissions = async () => {
      if (!userId) return

      const permissionResponse = await userStory.getPermissionsById(userId)
      const permissions = permissionResponse.data.data.user.access_role.length
        ? permissionResponse.data.data.user.access_role[0].permissions.map(
            (item) => item.name
          )
        : []

      const updatedAllowed = permissions.includes('Update Story Status')
      const editAllowed = permissions.includes('Edit Story')

      setIsDragDisabled(!updatedAllowed && !editAllowed)
    }
    getPermissions()
  }, [userId])

  useEffect(() => {
    const fetchStatus = async () => {
      const statusResponse = await userStory.getStatuses()
      setStatusList([
        ...Lists.additionalState,
        ...statusResponse.data.data.userStoryStatuses
      ])
    }

    fetchStatus()
  }, [])

  const onDragEnd = async (result) => {
    try {
      if (!result.destination) {
        return
      }

      const draggedStoryIndex = stories
        .map((story) => story.id)
        .indexOf(result.draggableId)

      const draggedStory = stories[draggedStoryIndex]
      if (
        draggedStory.user_story_status.Status === result.destination.droppableId
      )
        return

      draggedStory.user_story_status.Status = result.destination.droppableId
      stories[draggedStoryIndex] = draggedStory
      setStories([...stories])

      const newStatusIndex = statusList
        .map((status) => status.Status)
        .indexOf(result.destination.droppableId)

      await userStory.updateUserStoryStatus(
        draggedStory.id,
        statusList[newStatusIndex].id
      )

      toast.success(`Updated ${draggedStory.Title}`)
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div>
      <div className='filters'>
        <div className='filters-top flex'>
          <div className='options-bar'>
            <ProductList setProductQuery={setProductQuery} />
            <Dropdown
              title='Categories'
              reference={categoryDropdownContainer}
              curr={category}
              setCurr={setCategory}
              itemList={categories}
              data-cy='category-dropdown'
            />
            <Dropdown
              title='Sort By'
              reference={sortDropdownContainer}
              curr={sort}
              setCurr={setSort}
              itemList={Lists.sortByList}
            />
            <Switch
              checked={isRoadmapView}
              setChecked={setIsRoadmapView}
              uncheckedOption={'All'}
              checkedOption={'By Roadmap Stage'}
            />
          </div>
          <SearchInput
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            userTerm={userTerm}
            setUserTerm={setUserTerm}
            setSearchQuery={setSearchQuery}
            setAuthorQuery={setAuthorQuery}
          />
        </div>
        {isRoadmapView && (
          <RoadmapFilter
            selectState={selectState}
            setPage={setPage}
            currentStateSelected={currentStateSelected}
            statusList={statusList}
          />
        )}
      </div>
      <div className='status-container-box flex'>
        <DragDropContext onDragEnd={onDragEnd}>
          {isRoadmapView &&
            statusList
              .slice(1)
              .map((state, index) => (
                <StatusContainer
                  stories={stories}
                  state={state}
                  key={index}
                  index={index}
                  isDragDisabled={isDragDisabled}
                />
              ))}
        </DragDropContext>
      </div>
      {!isRoadmapView && (
        <div className='stories-div'>
          <StoriesList
            stories={stories}
            isLoading={promiseInProgress}
            statusList={statusList}
          />
        </div>
      )}
      {!isRoadmapView && (
        <Pagination
          getPage={getPage}
          storyCount={storyCount}
          status={currentStateSelected}
          productQuery={productQuery}
        />
      )}
    </div>
  )
}

export default Stories
