import { Button, Flex } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'

const AuthPage = () => {
  return (
    <div>
    <Link to={""}>
    <Flex>
      <Button mx={"auto"}>Auth Page</Button>
    </Flex>
    
    </Link>
  </div>
  )
}

export default AuthPage
