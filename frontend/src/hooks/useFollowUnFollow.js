import { useState } from 'react'
import useShowToast from './useShowToast'
import { useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom';

const useFollowUnFollow = (user) => {
    const currentUser = useRecoilValue(userAtom);
    const [following, setFollowing] = useState(user.followers.includes(currentUser?._id))
      const [updating, setUpdating] = useState(false)
      const showToast = useShowToast();
      const handleUnFollowFollow = async() => {
        try {
          if(!currentUser){
            showToast("Error", `Please Login to follow`, "error")
          }
          if(updating) return;
          setUpdating(true)
          const res = await fetch(`/api/users/follow/${user._id}`,{
            method: "POST",
            headers: {
              "content-Types": "/application/json"
            }
          })
    
          const data = await res.json();
          if(data.error){
            showToast("Error", data.error, "Error")
            return
          }
          if(following){
            showToast("Success", `UnFollowed ${user.name}`, "Success")
            user.followers.pop();
          }else{
            showToast("Success", `Followed ${user.name}`, "Success")
            user.followers.push(currentUser?._id)
          }
    
          setFollowing(!following)
          console.log(data)
        } catch (error) {
          showToast("Error", error, "Error")
        }finally{
          setUpdating(false)
        }
    
      }
  return {handleUnFollowFollow, following, updating}
}

export default useFollowUnFollow
