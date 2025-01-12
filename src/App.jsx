import { Button, Container } from "@chakra-ui/react"
import { Route, Routes } from "react-router-dom"
import PostPage from "./pages/PostPage"
import UserPage from "./pages/UserPage"
import Header from "./components/Header"
import HomePage from "./pages/HomePage"


function App() {

  return (
     <Container maxW='620px'>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/:username" element={<UserPage />}/>
        <Route path="/:username/post/:pId" element={<PostPage />}/>
      </Routes>
     </Container>
  )
}

export default App
