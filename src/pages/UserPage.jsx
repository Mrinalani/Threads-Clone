import React from 'react'
import UserHeader from '../components/UserHeader'
import UserPost from '../components/UserPost'

const UserPage = () => {
  return (
    <>
      <UserHeader />
      <UserPost likes={120} replies={481} postImg={"/post1.png"} postTitle={"Lets talk about threads"} />
      <UserPost likes={2000} replies={12} postImg={"/post2.png"} postTitle={"Nice tutorial"} />
      <UserPost likes={1200} replies={677} postImg={"/post3.png"} postTitle={"I love this guy"} />
      <UserPost likes={5100} replies={4746} postTitle={"This is my first thread"} />
    </>
  )
}

export default UserPage
