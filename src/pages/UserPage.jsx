import React, { useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader'
import UserPost from '../components/UserPost'
import { useParams } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';

const UserPage = () => {
  const [user, setUser] = useState(null);
  const {username} = useParams()
  const showToast = useShowToast()

  useEffect(() =>{
     const getUser = async() => {
      try {
        const res = await fetch(`/api/users/profile/${username}`)
        const data = await res.json()
        console.log(data)

        if(data.error){
          console.log("dbcjh", data.error)
          showToast("Error", data.error, "error")
          return
        }
        setUser(data)    
      } catch (error) {
        showToast("Error", error, "error")  
      }
     }
     getUser()
  },[username, showToast])

  if(!user) return null;
  return (
    <>
      <UserHeader user = {user}/>
      <UserPost likes={120} replies={481} postImg={"/post1.png"} postTitle={"Lets talk about threads"} />
      <UserPost likes={2000} replies={12} postImg={"/post2.png"} postTitle={"Nice tutorial"} />
      <UserPost likes={1200} replies={677} postImg={"/post3.png"} postTitle={"I love this guy"} />
      <UserPost likes={5100} replies={4746} postTitle={"This is my first thread"} />
    </>
  )
}

export default UserPage
