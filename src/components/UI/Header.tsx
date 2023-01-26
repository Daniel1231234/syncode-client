import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import { WebsocketContext } from '../../context/SocketContext'
import GoBackBtn from './GoBackBtn'
import './Header.css'


const Header = () => {
    const { getCurrBlock, saveCurrBlock, showBackBtn } = useContext(AppContext)
    const socket = useContext(WebsocketContext);
    const navigate = useNavigate()
    const currBlock = getCurrBlock()
    
    const leaveRoom = () => {        
        socket.emit('leave_room', currBlock?.title)
        saveCurrBlock(null)
        navigate('/')
    }


    return (
        <div className="header-container main-layout">
            <div className="header">
                <div className="logo">Sync<span>Code</span></div>
            </div>
            {showBackBtn && <GoBackBtn title='Back' onAction={leaveRoom} />}
        </div>
    )
}

export default Header