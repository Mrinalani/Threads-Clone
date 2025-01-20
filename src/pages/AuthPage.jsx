import React from 'react'
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
