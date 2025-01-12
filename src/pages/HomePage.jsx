import { Button, Flex } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div>
      <Link to={"/bchdhc"}>
      <Flex>
        <Button mx={"auto"}>Visit Profile Page</Button>
      </Flex>
      
      </Link>
    </div>
  )
}

export default HomePage
