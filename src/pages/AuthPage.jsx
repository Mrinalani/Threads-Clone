import { Button, Flex } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'
import SignupCart from '../components/SignUpCard'
import LoginCard from '../components/LoginCard'
import { useRecoilValue } from 'recoil'
import authScreenAtom from '../atoms/authAtom'

const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom)
  console.log(authScreenState)
  return (
    <>
    {authScreenState === 'login' ? <LoginCard /> : <SignupCart />}
  </>
  )
}

export default AuthPage
