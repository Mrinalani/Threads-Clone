import { Button, Container } from "@chakra-ui/react"
import { Route, Routes } from "react-router-dom"
import PostPage from "./assets/pages/PostPage"
import UserPage from "./assets/pages/UserPage"
import Header from "./components/Header"


function App() {

  return (
     <Container maxW='620px'>
      <Header />
      <Routes>
        <Route path="/:username" element={<UserPage />}/>
        <Route path="/:username/post/:pId" element={<PostPage />}/>
      </Routes>
     </Container>
  )
}

export default App
