import { Button, Flex, Spinner } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useShowToast from '../hooks/useShowToast'
import Post from '../components/Post'

const HomePage = () => {
  const showToast = useShowToast()
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const getFeedPosts = async() => {
      setLoading(true)
      try {
        const res = await fetch('/api/posts/feed')

        const data = await res.json();
        if(data.error){
          showToast("Error", data.error, "Error")
          return;
        }
        console.log(data)
        setPosts(data)
        
      } catch (error) {
        showToast("Error", error, "error")
      }finally{
        setLoading(false)
      }
    }
    getFeedPosts()
  },[showToast])

  console.log("posts",posts)
  return (
    <>
      {loading && (
        <Flex justify={"center"}>
          <Spinner size={"xl"}/>
        </Flex>
      )}

      {!loading && posts.length === 0 && (
        <h1>Follow some users to see the posts</h1>
      )}

      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
      
    </>
  )
}

export default HomePage
