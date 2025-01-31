import { Avatar, Box, Flex, Image, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Actions from './Actions'
import useShowToast from '../hooks/useShowToast'

import {formatDistanceToNow} from 'date-fns'
import { DeleteIcon } from '@chakra-ui/icons'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import postAtom from '../atoms/postAtom'

const Post = ({post, postedBy}) => {
  const [user, setuser] = useState(null)
  const showToast = useShowToast()
  const navigate = useNavigate()
  const currentuser = useRecoilValue(userAtom)
  const [posts, setPosts] = useRecoilState(postAtom);

  useEffect(()=>{
    const getUser = async() => {
        try {
            const res = await fetch(`/api/users/profile/${postedBy}`)

            const data = await res.json();
            if(data.error){
              showToast("Error", data.error, "Error")
              return;
            }
            setuser(data)
            
        } catch (error) {
            showToast("Error", error, "error")
            setuser(null)
        }
    }
    getUser()
  },[])

  const handleDeletePost = async(e) => {
    try {
      e.preventDefault();
      if(!window.confirm("are you sure you want to delete a post")) return;

      const res = await fetch(`/api/posts/${post._id}`,{
        method: "DELETE"
      })
      const data = await res.json()
      if(data.error){
        showToast("Error", data.error, "Error")
        return;
      }
      showToast("Success", "Post deleted successfully", "success")
      setPosts(posts.filter((p)=>p._id != post._id))
    } catch (error) {
      showToast("Error", error, "error")
    }
  }
  return (
    <Link to={`/${user?.username}/post/${post._id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
            <Avatar size={"md"} name={user?.name} src={user?.profilePic || undefined}
            onClick={(e) => {
              e.preventDefault();
                 navigate(`/${user.username}`)
            }}
            
            />
            <Box w='1px' h={"full"} bg='gray.light' my={2}></Box>
            <Box position={"relative"} w={"full"}>
                 {post.replies.length === 0 && <Text textAlign={"center"}>🙄</Text>}
                {post.replies[0] && (
                    <Avatar 
                    size="xs" name={user?.name} src={post.replies[0].userProfilePic || "https://bit.ly/sage-adebayo"}
                    position={"absolute"}
                    top={"0px"}
                    left={"15px"}
                    padding={"2px"}
                 />
                )}
                

                {post.replies[1] && (
                     <Avatar 
                     size="xs" name={user?.name} src={post.replies[1].userProfilePic || "https://bit.ly/sage-adebayo"}
                     position={"absolute"}
                     bottom={"0px"}
                     right={"-5px"}
                     padding={"2px"}
                  />
                )}
                
                {post.replies[2] && (
                     <Avatar 
                     size="xs" name={user?.name} src={post.replies[2].userProfilePic || "https://bit.ly/sage-adebayo"}
                     position={"absolute"}
                     bottom={"0px"}
                     left={"4px"}
                     padding={"2px"}
                  />
                )}
            </Box>
        </Flex>
        <Flex flex={1} flexDirection={'column'} gap={2}>
        <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
                <Text fontSize={"sm"} fontWeight={"bold"} onClick={(e) => {
                      e.preventDefault();
                         navigate(`/${user.username}`)
                    }}>{user?.username}</Text>
                <Image src='/verified.png' w={4} h={4} ml={1}></Image>
            </Flex>
            <Flex gap={4} alignItems={"center"}>
                <Text fontSize={"xs"} w={36} textAlign={"right"} color={"gray.light"}>
                  {formatDistanceToNow(new Date(post.createdAt))} ago
                </Text>

                {currentuser?._id === user?._id && (
                                  <DeleteIcon size={20} onClick={handleDeletePost} />

                )}
            </Flex>
        </Flex >
        <Text fontSize={"sm"}>{post.text}</Text>
        {post.img && (
        <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
        <Image src={post.img} w={"full"}/>
       </Box>
         )}
        
        <Flex gap={3} my={1}>
        <Actions post={post}/>
        </Flex>

        {/* <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"} fontSize={"sm"}>{post.replies.length} replies</Text>
          <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
          <Text color={"gray.light"} fontSize={"sm"}>{post.likes.length} likes</Text>
        </Flex> */}
        </Flex>
      </Flex>
    </Link>
  )
}

export default Post
