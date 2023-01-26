import { AppRouter } from "./AppRouter"
import { AppContextProvider } from "./context/AppContext"
import { socket, WebsocketProvider } from "./context/SocketContext"



const App: React.FC = () => {

  return (
    <WebsocketProvider value={socket}>
      <AppContextProvider>
        <AppRouter />
      </AppContextProvider>
    </WebsocketProvider>
  )
}

export default App
