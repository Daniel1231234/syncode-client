import { Routes, Route, Navigate } from "react-router-dom"
import CodeBlockPage from "./components/CodeBlockPage/CodeBlockPage"
import LobbyPage from "./components/LobbyPage/LobbyPage"
import Header from "./components/UI/Header"

export const AppRouter = () => {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<LobbyPage />} />
                <Route path="/blocks/:blockId" element={<CodeBlockPage />} />
                <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
        </>
    )
}