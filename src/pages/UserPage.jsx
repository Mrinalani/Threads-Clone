import React, { useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader'
import UserPost from '../components/UserPost'
import { useParams } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import { Flex, Spinner } from '@chakra-ui/react';
import Post from '../components/Post';
import useGetUserProfile from '../hooks/useGetUserProfile';
import { useRecoilState } from 'recoil';
import postAtom from '../atoms/postAtom';

const UserPage = () => {
  const [posts, setPosts] = useRecoilState(postAtom);
  const {username} = useParams()
  const showToast = useShowToast()
  const [fetchingPosts, setfetchingPosts] = useState(true)
  const {loading, user} = useGetUserProfile()

  useEffect(() =>{
  
     const getPosts = async() => {
      if(!user) return
       try {
        console.log(username)
        const res = await fetch(`/api/posts/user/${username}`)
        const data = await res.json()

        if(data.error){
          showToast("Error", data.error, "error")
          return
        }
        setPosts(data)
        console.log(data)
       } catch (error) {
        showToast("Error", error, "error")  
        setPosts("")
       }finally{
        setfetchingPosts(false)
       }
     }


     getPosts()
  },[username, showToast, setPosts, user])

  if(!user && loading){
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"}/>
      </Flex>
    )
  }



if(!user && !loading) return <h1>User not Found</h1>;
  return (
    <>
      <UserHeader user = {user}/>
      {!fetchingPosts && posts.length === 0 && <h1>User has no posts</h1>} 
      {fetchingPosts && (
         <Flex justifyContent={"center"} my={12}>
         <Spinner size={"xl"}/>
       </Flex>
      )}

      {posts.map((post)=>(
         <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
      {/* <UserPost likes={120} replies={481} postImg={"/post1.png"} postTitle={"Lets talk about threads"} />
      <UserPost likes={2000} replies={12} postImg={"/post2.png"} postTitle={"Nice tutorial"} />
      <UserPost likes={1200} replies={677} postImg={"/post3.png"} postTitle={"I love this guy"} />
      <UserPost likes={5100} replies={4746} postTitle={"This is my first thread"} /> */}
    </>
  )
}

export default UserPage
