import { Button, Text } from '@chakra-ui/react'
import React from 'react'

const SettingsPage = () => {
    const freezeAccount = async() => {
        
    }
  return (
    <>
      <Text my={1} fontWeight={"bold"}>Freeze Your Account</Text>
      <Text my={1}>You can un freeze your account anytime by logging in.</Text>
       <Button size={"sm"} colorScheme='red' onClick={freezeAccount}>Freeze</Button>
    </>
  )
}

export default SettingsPage
