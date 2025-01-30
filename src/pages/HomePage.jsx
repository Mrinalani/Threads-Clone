import { Box, Button, Flex, Spinner } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useShowToast from '../hooks/useShowToast'
import Post from '../components/Post'
import { useRecoilState } from 'recoil'
import postAtom from '../atoms/postAtom'
import SuggestedUsers from '../components/SuggestedUsers'

const HomePage = () => {
  const showToast = useShowToast()
  const [posts, setPosts] = useRecoilState(postAtom);
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const getFeedPosts = async() => {
      setLoading(true)
      setPosts([])
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
  },[showToast, setPosts])

  console.log("posts",posts)
  return (
    <Flex gap={10} alignItems={"flex-start"}>
      <Box flex={70}>
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
      </Box>
      <Box flex={30} display={{base: "none", md: "block"}}>
        <SuggestedUsers />
      </Box>
      
    </Flex>
  )
}

export default HomePage
