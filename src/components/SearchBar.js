import React, { useState, useEffect } from 'react'

import SearchInput from '../modules/SearchInput'
import Lists from '../utils/Lists'
import userStory from '../services/user_story'

const SearchBar = (props) => {
  const {
    sort,
    setSort,
    setSearchQuery,
    setAuthorQuery,
    setPage,
    selectedStatuses,
    setSelectedStatuses,
    selectedCategories,
    setSelectedCategories
  } = props

  const [categories, setCategories] = useState([])

  const [filtersOpened, setFiltersOpened] = useState(false)

  const toggleFilters = (filters, setFilters, value) => () => {
    if (filters.find((filter) => filter === value)) {
      setFilters(filters.filter((filter) => filter !== value))
    } else {
      setFilters(filters.concat(value))
    }
    setPage(1)
  }

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await userStory.getCategories()
      setCategories(
        response.data.data.__type.enumValues.map((ele) => {
          return ele.name
        })
      )
    }
    fetchCategories()
  }, [])

  return (
    <div className='flex flex-row search-bar'>
      <SearchInput
        setSearchQuery={setSearchQuery}
        setAuthorQuery={setAuthorQuery}
      />

      <label
        onClick={() => {
          setFiltersOpened(!filtersOpened)
        }}
      >
        {filtersOpened ? 'Hide ' : 'Show '}
        Filters{' '}
        {filtersOpened ? (
          <i className='eos-icons'>keyboard_arrow_up</i>
        ) : (
          <i className='eos-icons'>keyboard_arrow_down</i>
        )}
      </label>

      {filtersOpened && (
        <div className='search-filters'>
          <div className='filter-container'>
            <p>Stages</p>
            <div className='filter-section'>
              {Lists.stateList.map((state, key) => {
                return (
                  <span className='checkbox-row' key={key}>
                    <input
                      type='checkbox'
                      onChange={toggleFilters(
                        selectedStatuses,
                        setSelectedStatuses,
                        state.status
                      )}
                      id={state.status}
                      checked={
                        !!selectedStatuses.find(
                          (status) => status === state.status
                        )
                      }
                    />
                    <label htmlFor={state.status}>
                      <i className='eos-icons'>{state.icon}</i>
                      {state.status}
                    </label>
                  </span>
                )
              })}
            </div>
          </div>

          <div className='filter-container'>
            <p>Categories</p>
            <div className='filter-section'>
              {categories.map((category, key) => (
                <span className='checkbox-row' key={key}>
                  <input
                    type='checkbox'
                    id={category}
                    checked={!!selectedCategories.find((c) => c === category)}
                    onChange={toggleFilters(
                      selectedCategories,
                      setSelectedCategories,
                      category
                    )}
                  />
                  <label htmlFor={category}>{category}</label>
                </span>
              ))}
            </div>
          </div>

          <div className='filter-container'>
            <p>Sort By</p>
            <div className='filter-section'>
              {Lists.sortByList.map((item, key) => (
                <span className='checkbox-input' key={key}>
                  <input
                    type='radio'
                    id={item}
                    name='sortBy'
                    checked={sort === item}
                    onChange={() => {
                      setSort(item)
                    }}
                  />
                  <label htmlFor={item}>{item}</label>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar
