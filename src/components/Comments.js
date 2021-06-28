import React, { useState, useEffect, useContext } from 'react'
import { Link } from '@reach/router'
import Button from './Button'
import axios from 'axios'
import { apiURL } from '../config.json'
import { useForm } from 'react-hook-form'
import { MentionsInput, Mention } from 'react-mentions'

import Context from '../modules/Context'
import FormError from '../components/FormError'

const Comments = (props) => {
  const { storyId } = props

  const {
    register: registerComment,
    errors: errorsComment,
    handleSubmit: handleSubmitComment
  } = useForm()

  const {
    register: registerReply,
    errors: errorsReply,
    handleSubmit: handleSubmitReply
  } = useForm()

  const { state } = useContext(Context)

  const id = localStorage.getItem('id')

  const [comment, setComment] = useState('')

  const [fetchComments, setFetchComments] = useState(false)

  const [commentId, setCommentId] = useState()

  const [commentReply, setCommentReply] = useState('')

  const [comments, setComments] = useState([])

  const [repliesToggled, setRepliesToggled] = useState()

  const [viewRepliesToggled, setViewRepliesToggled] = useState([])

  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchComments = async () => {
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
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
        }
        `
        },
        {
          withCredentials: true
        }
      )
      setComments(response.data.data.userStory.user_story_comments)
    }
    const fetchUsers = async () => {
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `query {
            users {
              id
              display: username
            }
          }`
        },
        {
          withCredentials: true
        }
      )
      setUsers(response.data.data.users)
    }
    fetchComments()
    fetchUsers()
  }, [storyId, fetchComments])

  const addComment = async (data) => {
    // I used this saveComments function to parse markdown and replace regex with HTML string.
    // const saveComment = async () => {
    // let newComment = data.addComment

    // First regex expression

    // newComment.replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
    // console.log(newComment)

    // Second regex expression

    // newComment.replace(/\[(.+)\]\((\/.+)\)/g, '<a href="\2">\1</a>')
    // console.log(newComment)
    // }

    const response = await axios.post(
      `${apiURL}/graphql`,
      {
        query: `
      mutation {
        createUserStoryComment(input: {
          data: {
            Comments: "${data.addComment}"
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
      },
      {
        withCredentials: true
      }
    )
    // This is the split and join I used in saveComment function used with markup="@@@____id__^^^____display__@@@^^^"

    // const saveComment = () => {
    // e.preventDefault();

    // console.log("save comment working!!!")

    // let newComment = data.addComment

    // console.log(newComment)

    // newComment = newComment.split("@@@__").join('<a href="/profile/');
    // console.log("split one working = " + newComment)

    // newComment = newComment.split("^^^__").join('">');
    // console.log("split 2 working = " + newComment)

    // newComment = newComment.split("@@@^^^").join('</a>');
    // console.log("split 3 also working = " + newComment)

    // if(newComment !== "") {
    //   newComment = newComment.trim();
    //   console.log("if working now")
    // }
    // }
    setComments([
      ...comments,
      response.data.data.createUserStoryComment.userStoryComment
    ])
    setComment('')
    // saveComment()
  }

  const addCommentReply = async (data) => {
    await axios.post(
      `${apiURL}/graphql`,
      {
        query: `
      mutation {
        createUserStoryCommentThread (input: {
          data: {
            Comments: "${data.addReply}"
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
      },
      { withCredentials: true }
    )
    setCommentReply('')
    setFetchComments((fetchComments) => !fetchComments)
    setRepliesToggled(null)
  }

  // This is the saveComment function which is using split and join with markup="@@@____id__^^^____display__@@@^^^"
  // This is just for testing. I have also made the above function above inside addComment.

  // const saveComment = async (data) => {
  // e.preventDefault();
  // console.log("save comment working!!!")
  // let newComment = data.addComment
  // console.log(newComment)
  // newComment = newComment.split("@@@__").join('<a href="/profile/');
  // newComment = newComment.split("^^^__").join(`">@`);
  // newComment = newComment.split("@@@^^^").join("</a>");
  // console.log(newComment)
  // if(newComment !== "") {
  // newComment = newComment.trim();
  // }
  // }

  // DisplayTransform function is used for changing display from username to @username
  // const displayTransform = (id, display) => {
  //   return '@' + display
  // }

  // This Render suggestion function is used to render list of usernames as links.
  // const renderSuggestion = (entry, search, highlightedDisplay, index, focused) => {
  //   return (
  //     <a href="https://github.com">
  //       {highlightedDisplay}
  //     </a>
  //   )
  // }

  return (
    <div className='comments-wrapper'>
      <h3>Comments</h3>
      {comments.length ? (
        comments.map((data, key) => {
          return (
            <div className='comment' key={key}>
              <div className='user-avatar'>
                <img
                  className='avatar'
                  src={`https://avatars.dicebear.com/api/jdenticon/${data.user.username}.svg`}
                  alt='Default User Avatar'
                ></img>
              </div>
              <div className='comment-content'>
                <Link
                  className='link link-default'
                  to={`/profile/${data.user.id}`}
                >
                  {data.user.username}
                </Link>
                <div className='metadata'>
                  <div>
                    {`${data.createdAt.slice(0, 10)}  ${data.createdAt.slice(
                      11,
                      19
                    )}`}
                  </div>
                </div>
                <p>{data.Comments}</p>
                <div className='reply-action'>
                  {state.auth && (
                    <Button
                      className='btn btn-default'
                      onClick={() => {
                        setCommentId(data.id)
                        repliesToggled === key + 1
                          ? setRepliesToggled(null)
                          : setRepliesToggled(key + 1)
                        viewRepliesToggled.find((item) => item === key + 1)
                          ? setViewRepliesToggled((viewRepliesToggled) =>
                              viewRepliesToggled.filter(
                                (item) => item !== key + 1
                              )
                            )
                          : setViewRepliesToggled((viewRepliesToggled) =>
                              viewRepliesToggled.concat(key + 1)
                            )
                      }}
                    >
                      Reply
                    </Button>
                  )}
                  {data.user_story_comment_replies.length > 0 ? (
                    <Button
                      className='btn btn-default'
                      onClick={() => {
                        viewRepliesToggled.find((item) => item === key + 1)
                          ? setViewRepliesToggled((viewRepliesToggled) =>
                              viewRepliesToggled.filter(
                                (item) => item !== key + 1
                              )
                            )
                          : setViewRepliesToggled((viewRepliesToggled) =>
                              viewRepliesToggled.concat(key + 1)
                            )
                      }}
                    >
                      View Replies ({data.user_story_comment_replies.length})
                    </Button>
                  ) : (
                    ''
                  )}
                </div>
                {viewRepliesToggled.find((item) => item === key + 1) &&
                  data.user_story_comment_replies.map((reply, key) => (
                    <div className='comment' key={key}>
                      <div className='user-avatar'>
                        <img
                          className='avatar'
                          src={`https://avatars.dicebear.com/api/jdenticon/${reply.user.username}.svg`}
                          alt='Default User Avatar'
                        ></img>
                      </div>
                      <div className='comment-content'>
                        <Link
                          className='link link-default'
                          to={`/profile/${data.user.id}`}
                        >
                          {reply.user.username}
                        </Link>
                        <div className='metadata'>
                          {
                            <div>
                              {`${reply.createdAt.slice(
                                0,
                                10
                              )}  ${reply.createdAt.slice(11, 19)}`}
                            </div>
                          }
                        </div>
                        <p>{reply.Comments}</p>
                      </div>
                    </div>
                  ))}
                {repliesToggled === key + 1 && state.auth && (
                  <form
                    className='comment-form'
                    onSubmit={handleSubmitReply(addCommentReply)}
                  >
                    <div className='field textarea'>
                      <MentionsInput
                        name='addReply'
                        inputRef={registerReply({ required: true })}
                        value={commentReply}
                        onChange={(e) => setCommentReply(e.target.value)}
                        allowSuggestionsAboveCursor={true}
                        className='mentions'
                      >
                        <Mention
                          trigger='@'
                          data={users}
                          markup='@@@____id__^^^____display__@@@^^^'
                        />
                      </MentionsInput>
                      {errorsReply.addReply && (
                        <FormError message='Reply cannot be empty' />
                      )}
                    </div>
                    <Button className='btn btn-default'>Add Reply</Button>
                  </form>
                )}
              </div>
            </div>
          )
        })
      ) : (
        <h3>No comments yet</h3>
      )}
      {state.auth && (
        <form
          className='comment-form'
          onSubmit={handleSubmitComment(addComment)}
        >
          <div className='field textarea'>
            <MentionsInput
              name='addComment'
              inputRef={registerComment({ required: true })}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              allowSuggestionsAboveCursor={true}
              className='mentions'
            >
              <Mention
                trigger='@'
                data={users}
                // displayTransform={displayTransform}
                // This markup is used for length of string. It is used with split and join in saveComment function above.
                // markup='@@@____id__^^^____display__@@@^^^'

                // This markup is for links. It is used with regex in saveComment above.
                markup='[__display__](https://localhost:3000/profile/__id__)'
                // this regex is just for matching markup links
                regex='/^\[([\w\s\d]+)\]\((https?:\/\/[\w\d./?=#]+)\)$/'

                // renderSuggestion={renderSuggestion}
              />
            </MentionsInput>
            {errorsComment.addComment && (
              <FormError message='Comment cannot be empty' />
            )}
          </div>
          <Button className='btn btn-default'>Add Comment</Button>
        </form>
      )}
    </div>
  )
}

export default Comments
