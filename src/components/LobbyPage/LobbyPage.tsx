import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import { WebsocketContext } from '../../context/SocketContext'
import { ICodeBlock } from '../../models/ICodeBlock'
import LoadingSpinner from '../UI/Spinner'
import './LobbyPage.css'


const LobbyPage = () => {
  const socket = useContext(WebsocketContext)
  const { getAllBlocks, getBlockById, saveCurrBlock, getCurrBlock, setShowBackBtn,showBackBtn } = useContext(AppContext)
  const [totalCodeBlocs, setTotalCodeBlocks] = useState<ICodeBlock[]>([])
  const navigate = useNavigate()

    useEffect(() => {
    setShowBackBtn(false)
  }, [showBackBtn])


  useEffect(() => {
    const currBlock = getCurrBlock()
    if (currBlock) {
      saveCurrBlock(null)
      socket.emit('leave_room', currBlock?.title)
    }

    return () => {
      socket.off('leave_room')
    }
  }, [])

  useEffect(() => {
    const loadCodeBlocks = async () => {
      try {
        const codeBlocks = await getAllBlocks()
        setTotalCodeBlocks(codeBlocks)
      } catch (err) {
        console.log(err)
      }
    }

    loadCodeBlocks()
  }, [])

  const goToCodeBlock = async (e: React.MouseEvent<HTMLElement>) => {
    try {
      const blockId = (e.target as HTMLElement).id
      const chosenBlock = await getBlockById(blockId)
      saveCurrBlock(chosenBlock)
      socket.emit('join_room', chosenBlock.title)
      navigate(`/blocks/${blockId}`, {replace:true})
    } catch (err) {
      console.log(err)
    }
  }
    if (!totalCodeBlocs) return <LoadingSpinner />
  return (
    <div className="lobbyPage-container main-layout" style={{
      backgroundImage: `url(${"https://www.linkpicture.com/q/LPic63d1bb30ab3611761177744.jpg"})`,
      backgroundSize:'cover'
    }}>
      <h2 className='lobby-heading'>Choose Code Block</h2>
      <div className='block-list'>
        {totalCodeBlocs.map((block) => {
          return <div
            onClick={goToCodeBlock}
            id={block._id}
            key={block._id}>{block?.title}</div>
        })}
      </div>
    </div>
  )
}

export default LobbyPage