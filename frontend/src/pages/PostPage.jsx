import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import postAtom from "../atoms/postAtom";

const PostPage = () => {
  const { loading, user } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postAtom)
  const showToast = useShowToast();
  const { pId } = useParams();
  const currentuser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const post = posts[0]

  useEffect(() => {
    const getPost = async () => {
      setPosts([])

      try {
        const res = await fetch(`/api/posts/${pId}`);
        const data = await res.json();

        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts([data]);
      } catch (error) {
        showToast("Error", error, "error");
      }
    };
    getPost();
  }, [showToast, pId]);


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
      navigate(`/${user.username}`)
    } catch (error) {
      showToast("Error", error, "error")
    }
  }
  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!post) return null;

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar
            src={user?.profilePic || "zuck.avatar.png"}
            size={"md"}
            name="Mark"
          />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {user?.username}
            </Text>
            <Image src="/verified.png" w={4} h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"xs"} w={36} textAlign={"right"} color={"gray.light"}>
            {formatDistanceToNow(new Date(post.createdAt))} ago
          </Text>

          {currentuser?._id === user?._id && (
            <DeleteIcon size={20} onClick={handleDeletePost} />
          )}
        </Flex>
      </Flex>
      <Text my={3}>{post.text}</Text>
      {post.img && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={post.img} w={"full"} />
        </Box>
      )}
      <Flex>
        <Actions post={post} />
      </Flex>
    
      <Divider my={4} />
      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Divider my={4} />
      {post.replies.map((reply)=> (
          <Comment
          key={reply._id}
          reply={reply}
          lastReply={reply._id === post.replies[post.replies.length -1]._id}
        />
      ))}
      
    </>
  );
};

export default PostPage;
