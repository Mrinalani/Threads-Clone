import{ useEffect, useState } from 'react'
import useShowToast from './useShowToast';
import { useParams } from 'react-router-dom';

const useGetUserProfile = () => {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);
    const showToast = useShowToast()
    const {username} = useParams();

    useEffect(()=>{
        const getUser = async() => {
            try {
              const res = await fetch(`/api/users/profile/${username}`)
              const data = await res.json()
      
              if(data.error){
                showToast("Error", data.error, "error")
                return
              }
              if(data.isFrozen){
              setUser(null);
              return;
              }
              setUser(data)    
              console.log("bdjhdbhjbh", data)
            } catch (error) {
              showToast("Error", error, "error")  
            }finally{
              setLoading(false)
            }
           }

           getUser()
    },[username, showToast])


  return {loading, user}
}

export default useGetUserProfile
