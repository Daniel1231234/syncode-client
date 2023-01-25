import './CodeBlockPage.css'
import { useState } from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import { ICodeBlock } from '../../models/ICodeBlock'
import AceEditor from 'react-ace'
import {  WebsocketContext } from '../../context/SocketContext'
import { socketService } from '../../services/socketService'

type Props = {}
const CodeBlockPage = (props: Props) => {
  const socket = useContext(WebsocketContext);
  const { setIsMentor, isMentor, codeBlock, getCurrBlock} = useContext(AppContext)
  const currBlock = JSON.parse(JSON.stringify(getCurrBlock()))
  const [studentCode, setStudentCode] = useState<string>(currBlock.code)
  const [connectedUsers, setConnectedUsers] = useState(null);

  useEffect(() => {
    if (!socket) return
    socket.on('joined_users', (data: any) => {
      const { joinedUsers } = data
      if (joinedUsers === 1) setIsMentor(true)
      else if (joinedUsers === 2) setIsMentor(false)
      console.log(joinedUsers)

    })
    
    return () => {
      socket.off('joined_users')
    }
    }, [socket])
  // useEffect(() => {
  //   if (!socket) return
  //   socket.on('joined_users', (data: any) => {
  //     console.log(data.joinedUsers)
  //     setConnectedUsers(data.joinedUsers)
  //     data.joinedUsers === 1 ? setIsMentor(true) : setIsMentor(false)
  //   })
    
  //   return () => {
  //     socket.off('joined_users')
  //   }
  //   }, [socket, connectedUsers])
  
  useEffect(() => {
    if (!socket) return
    socket.on('code_updated', (data: any) => {
      // console.log(data.code, ' code_updated')
      setStudentCode(data.code)
      // console.log(studentCode)
    })
    
    return () => {
      socket.off('code_updated')
    }
  }, [socket])



  
  const onCodeChange = (val: string) => {
    setStudentCode(val)
    const updatedCode = JSON.parse(JSON.stringify(val))
    socket.emit('update_code', {code: updatedCode})
  }
  
  const onCheckAnswer = () => {
    const updatedCodeBlock = Object.assign({}, currBlock, { code: studentCode })
    console.log(updatedCodeBlock)

  }


  return (
    <div className='main-layout codeblock-page'>
      <h2>{currBlock?.title}</h2>
      <div>{currBlock?.problem }</div>
      <div className='editor-wrapper'>
        <AceEditor className='editor'
          mode="javascript"
          theme="monokai"
          onChange={onCodeChange}
          setOptions={{ useWorker: false }}
          value={studentCode || ''}
          highlightActiveLine={true}
          enableLiveAutocompletion={true}
          fontSize={12}
          height="400px"
          width="400px"
          readOnly={isMentor}
          />
      </div>
      <div className='button-group'>
        <button onClick={onCheckAnswer} className='code-submit-btn'>Check my answer!</button>
      </div>
    </div>
  )
}

export default CodeBlockPage