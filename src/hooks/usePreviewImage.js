import { useState } from 'react'
import useShowToast from './useShowToast'

const usePreviewImage = () => {
    const [imgUrl, setImageUrl] = useState(null)
    const showToast = useShowToast

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      console.log(file)
      if(file && file.type.startsWith("image/")){
        console.log("jhj")
          const reader = new FileReader()

          reader.onloadend = () => {
            setImageUrl(reader.result)
          }

          reader.readAsDataURL(file)
      }else{
          showToast("Invalid File Type", "please select an image file", "error")
          setImageUrl(null)
      }
    }

  return {handleImageChange, imgUrl}
}

export default usePreviewImage
