import { useState } from "react"
import { Route, Routes } from "react-router-dom"
import CodeBlockPage from "./components/CodeBlockPage/CodeBlockPage"
import LobbyPage from "./components/LobbyPage/LobbyPage"
import Header from "./components/UI/Header"
import LoadingSpinner from "./components/UI/Spinner"
import { AppContextProvider } from "./context/AppContext"
import RootBoundary from "./RootBoundary"




const App: React.FC = () => {
  const [showBackBtn, setShowBackBtn] = useState(false)
  return (
    <AppContextProvider>
      <Header showBackBtn={showBackBtn} />
      <Routes>
        <Route path="/" errorElement={<RootBoundary />} element={<LobbyPage showBackBtn={showBackBtn} setShowBackBtn={setShowBackBtn} />} />
        <Route path="/blocks/:blockId" errorElement={<RootBoundary />} element={<CodeBlockPage showBackBtn={showBackBtn} setShowBackBtn={setShowBackBtn} />} />
      </Routes>
    </AppContextProvider>
  )
}

export default App
