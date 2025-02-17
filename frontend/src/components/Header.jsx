import { Button, Flex, Image, useColorMode } from '@chakra-ui/react'
import React from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import { Link } from 'react-router-dom'
import {AiFillHome} from 'react-icons/ai'
import {RxAvatar} from 'react-icons/rx'
import {BsFillChatQuoteFill} from 'react-icons/bs'
import {MdOutlineSettings} from 'react-icons/md'
import { FiLogOut } from 'react-icons/fi'
import useLogout from '../hooks/useLogout'
import authScreenAtom from '../atoms/authAtom'


const Header = () => {
    const {colorMode, toggleColorMode} = useColorMode()
    const user = useRecoilValue(userAtom)
    const setAuthScreen = useSetRecoilState(authScreenAtom)
    const logout = useLogout()
  return (
    <Flex justifyContent={"space-between"} mt={6} mb={12}>

      {user && (
        <Link to={'/'}>
         <AiFillHome size={24}/>
        </Link>
      )}

{!user && (
        <Link to={"/auth"} onClick={
          (()=> {
            setAuthScreen("login")
          })
        }>
         Login
        </Link>
      )}

      <Image
         cursor={"pointer"}
         alt='logo'
         w={6}
         src={colorMode === "dark"? "light-logo.svg": "/dark-logo.svg"}
         onClick={toggleColorMode}
      />

      
{user && (
        <Flex alignItems={"center"} gap={4}>
        <Link to={`/${user.username}`}>
         <RxAvatar size={24}/>
        </Link>
        <Link to={`/chat`}>
         <BsFillChatQuoteFill size={20}/>
        </Link>
        <Link to={`/settings`}>
         <MdOutlineSettings size={20}/>
        </Link>
        <Button size={"xm"} onClick={logout}>
              <FiLogOut  size={20}/>
            </Button>
        </Flex>
      )}

{!user && (
        <Link to={"/auth"} onClick={(()=>{
          setAuthScreen("signup")
        })}>
         Sign up
        </Link>
      )}
    </Flex>
  )
}



export default Header
