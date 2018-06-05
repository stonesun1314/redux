// export const REQUEST_POSTS = 'REQUEST_POSTS'
// export const RECEIVE_POSTS = 'RECEIVE_POSTS'
// export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT'
// export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT'

// export const selectSubreddit = subreddit => ({
//   type: SELECT_SUBREDDIT,
//   subreddit
// })

// export const invalidateSubreddit = subreddit => ({
//   type: INVALIDATE_SUBREDDIT,
//   subreddit
// })

// export const requestPosts = subreddit => ({
//   type: REQUEST_POSTS,
//   subreddit
// })

// export const receivePosts = (subreddit, json) => ({
//   type: RECEIVE_POSTS,
//   subreddit,
//   posts: json.data.children.map(child => child.data),
//   receivedAt: Date.now()
// })

// const fetchPosts = subreddit => dispatch => {
//   dispatch(requestPosts(subreddit))
//   return fetch(`https://www.reddit.com/r/${subreddit}.json`)
//     .then(response => response.json())
//     .then(json => dispatch(receivePosts(subreddit, json)))
// }

// const shouldFetchPosts = (state, subreddit) => {
//   const posts = state.postsBySubreddit[subreddit]
//   if (!posts) {
//     return true
//   }
//   if (posts.isFetching) {
//     return false
//   }
//   return posts.didInvalidate
// }

// export const fetchPostsIfNeeded = subreddit => (dispatch, getState) => {
//   if (shouldFetchPosts(getState(), subreddit)) {
//     return dispatch(fetchPosts(subreddit))
//   }
// }

//===================================================
import fetch from 'cross-fetch'
// import { error } from 'util';

export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT'    //sync
export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT'    //sync
export const REQUEST_POSTS = 'REQUEST_POSTS'        //async
export const RECEIVE_POSTS = 'RECEIVE_POSTS'        //async

export function selectSubreddiit(subreddit){
  return {
    type:SELECT_SUBREDDIT,
    subreddit
  }
}

export function invalidateSubreddiit(subreddit){
  return {
    type:INVALIDATE_SUBREDDIT,
    subreddit
  }
}

//当需要获取指定 subreddit 的帖子的时候，需要 dispatch REQUEST_POSTS action,,异步
export function requestPosts(subreddit){
  return {
    type:REQUEST_POSTS,
    subreddit
  }
}

//当收到请求响应时，我们会 dispatch RECEIVE_POSTS：
export function receivePosts(subreddit,json){
  return {
    type:RECEIVE_POSTS,
    subreddit,
    posts:json.data.children.map(child=>child.data),
    receivedAt:Date.now()
  }
}


//来看一下我们写的第一个 thunk action创建函数!
//虽然内部操作不同，你可以像其它action创建函数一样使用它:
//store.dispatch(fetchPosts('reactjs'))
export function fetchPosts(subreddit){
  //Thunk middleware 知道如何处理函数
  //这里把dispatch 方法通过参数的形式传给函数,
  //以此来让它自己也能 dispatch action。

  return function(dispatch){
    //thunk middleware 调用的函数可以有返回值,
    //它会被当做 dispatch 方法的返回值传递。

    //这个案例中，我们返回一个等待处理的 promise。
    //这并不是 redux middleware所必须的，但这对于我们而言很方便。

    return fetch(`http://www.subreddit.com/r/${subreddit}.json`)
    .then(
      response => response.json(),
      //不要使用 catch，因为会捕获
      // 在 dispatch 和渲染中出现的任何错误
      //导致 ‘Unexpected batch number’错误。
      // https://github.com/facebook/react/issues/6895
      error => console.log('An error occurred.',error)
    ).then(json=>
      //可以多次dispatch!
      //这里，使用API请求结果来更新应用 state
      dispatch(receivePosts(subreddit,json))
    )
  }
}
