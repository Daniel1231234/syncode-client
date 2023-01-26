import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import { WebsocketContext } from '../../context/SocketContext'
import { ICodeBlock } from '../../models/ICodeBlock'
import LoadingSpinner from '../UI/Spinner'
import './LobbyPage.css'


const LobbyPage: React.FC = () => {
  const socket = useContext(WebsocketContext)
  const { getAllBlocks, getBlockById, saveCurrBlock, setShowBackBtn } = useContext(AppContext)
  const [totalCodeBlocs, setTotalCodeBlocks] = useState<ICodeBlock[]>([])
  const navigate = useNavigate()


  useEffect(() => {
    //set state for showBackBtn to false
    setShowBackBtn(false)
    // async function to load code blocks from an API
    const loadCodeBlocks = async () => {
      try {
        const codeBlocks = await getAllBlocks()
        setTotalCodeBlocks(codeBlocks)
      } catch (err) {
        console.log(err)
      }
    }
    // call loadCodeBlocks function to fetch code blocks
    loadCodeBlocks()
  }, [])




  const goToCodeBlock = async (e: React.MouseEvent<HTMLElement>) => {
    try {
      // get the id of the clicked element
      const blockId = (e.target as HTMLElement).id
      // fetch the block data by id
      const chosenBlock = await getBlockById(blockId)
      // save the chosen block to the current block state and local storage
      saveCurrBlock(chosenBlock)
      // emit 'join_room' event to the socket with the title of the block
      socket.emit('join_room', chosenBlock.title)
      // navigate to the block page with the blockId passed as parameter and replace the current location in history
      navigate(`/blocks/${blockId}`, { replace: true })
    } catch (err) {
      console.log(err)
    }
  }


  if (!totalCodeBlocs) return <LoadingSpinner />
  return (
    <div className="lobbyPage-container main-layout" style={{
      backgroundImage: `url(${"https://www.linkpicture.com/q/LPic63d1bb30ab3611761177744.jpg"})`,
      backgroundSize: 'cover'
    }}>
      <h2 className='lobby-heading'>Choose Code Block</h2>
      <div className='block-list'>
        {totalCodeBlocs.map((block: ICodeBlock) => {
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