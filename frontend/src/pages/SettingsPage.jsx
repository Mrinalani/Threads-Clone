import { Button, Text } from '@chakra-ui/react'
import React from 'react'
import useShowToast from '../hooks/useShowToast'
import useLogout from '../hooks/useLogout';

const SettingsPage = () => {
    const showToast = useShowToast();
    const logout = useLogout()
    const freezeAccount = async() => {
        if(!window.confirm("Are you sure you you want to freez your account")) return;
        try {
            const res = await fetch('/api/users/freez',{
                method: "Put",
                headers: {
                    "content-Type": "application/json"
                }
            })

          const data = await res.json()
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
              }

            if(data.success){
              await logout()
              showToast("Success", "Your account has been frozen", "success")
            }
            
        } catch (error) {
            showToast("Error", error, "error")
        }
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
