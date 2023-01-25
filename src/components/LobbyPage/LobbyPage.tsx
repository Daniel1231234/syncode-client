import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import { WebsocketContext } from '../../context/SocketContext'
import { ICodeBlock } from '../../models/ICodeBlock'
import LoadingSpinner from '../UI/Spinner'
import './LobbyPage.css'



type Props = {}
const LobbyPage = (props: Props) => {
  const {getAllBlocks, getBlockById, saveCurrBlock} = useContext(AppContext)
  const [totalCodeBlocs, setTotalCodeBlocks] = useState<ICodeBlock[]>([])
  const navigate = useNavigate()
  const socket = useContext(WebsocketContext)


  

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
      navigate(`/blocks/${blockId}`)
    } catch (err) {
      console.log(err)
  }
  }

  if (!totalCodeBlocs) return <LoadingSpinner />
  return (
    <div className="lobbyPage-container main-layout">
      <h2>Choose code block</h2>
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