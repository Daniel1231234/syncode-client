import { Suspense } from "react"
import {  Route, Routes } from "react-router-dom"
import CodeBlockPage from "./components/CodeBlockPage/CodeBlockPage"
import LobbyPage from "./components/LobbyPage/LobbyPage"
import Header from "./components/UI/Header"
import LoadingSpinner from "./components/UI/Spinner"
import { AppContextProvider } from "./context/AppContext"




const App: React.FC = () => {
  return (
      <AppContextProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <Header />
          <Routes>
            <Route path="/" element={<LobbyPage />} />
            <Route path="/blocks/:blockId" element={<CodeBlockPage />} />
          </Routes>
        </Suspense>
      </AppContextProvider>
  )
}

export default App
