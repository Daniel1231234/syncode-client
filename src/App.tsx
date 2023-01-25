import { useState } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import { AppRouter } from "./AppRouter"
import CodeBlockPage from "./components/CodeBlockPage/CodeBlockPage"
import LobbyPage from "./components/LobbyPage/LobbyPage"
import Header from "./components/UI/Header"
import { AppContextProvider } from "./context/AppContext"
import { socket, WebsocketProvider } from "./context/SocketContext"



const App: React.FC = () => {

  return (
    <WebsocketProvider value={socket}>
    <AppContextProvider>
      <Header  />
        <AppRouter />
    </AppContextProvider>
    </WebsocketProvider>
  )
}

export default App
