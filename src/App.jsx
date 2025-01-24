import { Container } from "@chakra-ui/react"
import { Navigate, Route, Routes } from "react-router-dom"
import PostPage from "./pages/PostPage"
import UserPage from "./pages/UserPage"
import Header from "./components/Header"
import HomePage from "./pages/HomePage"
import AuthPage from "./pages/AuthPage"
import { useRecoilValue } from "recoil"
import userAtom from "./atoms/userAtom"
import LogoutButton from "./components/LogoutButton"
import UpdateProfilePage from "./pages/updateProfilePage"
import CreatePost from "./components/CreatePost"


function App() {
  const user = useRecoilValue(userAtom)

  return (
     <Container maxW='620px'>
      <Header />
      <Routes>
        <Route path="/" element={user ? <HomePage /> : <Navigate to="/auth" />}/>
        <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />}/>
        <Route path="/update" element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />}/>


        <Route path="/:username" element={user ?
          (
            <>
            <UserPage />
            <CreatePost />
            </>
          ):
          (
            <userPage />
          )
        }/>
        <Route path="/:username/post/:pId" element={<PostPage />}/>
      </Routes>

     </Container>
  )
}

export default App
