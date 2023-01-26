import './CodeBlockPage.css'
import { useState } from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import AceEditor from 'react-ace'
import { WebsocketContext } from '../../context/SocketContext'
import prizeSvg from "../../assets/prize.svg"


const CodeBlockPage = () => {
  const socket = useContext(WebsocketContext);
  const { getCurrBlock, checkIfMatch, setShowBackBtn, showBackBtn } = useContext(AppContext)
  const currBlock = JSON.parse(JSON.stringify(getCurrBlock()))
  const [studentCode, setStudentCode] = useState<string>(currBlock.code)
  const [isMatch, setIsMatch] = useState(false)
  const [width, setWidth] = useState(window.innerWidth);
  const [connectedUsers, setConnectedUsers] = useState<string[] | []>([])
  const [mentor, setMentor] = useState<string | undefined>()

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  useEffect(() => {
    setShowBackBtn(true)
  }, [showBackBtn])


  useEffect(() => {
    if (!socket) return
    socket.on('joined_users', (data: any) => {
      setConnectedUsers(data)
      if (data.length === 1) setMentor(data[0])
    })

    return () => {
      socket.off('joined_users')
    }
  }, [socket, connectedUsers])


  useEffect(() => {
    if (!socket) return
    socket.on('code_updated', (data: any) => {
      setStudentCode(data)
    })

    return () => {
      socket.off('code_updated')
    }
  }, [socket])




  const onCodeChange = (val: string) => {
    setStudentCode(val)
    const updatedCode = JSON.parse(JSON.stringify(val))
    const data = { updatedCode, currBlock }
    socket.emit('update_code', data)
  }

  const onCheckAnswer = () => {
    const updatedCodeBlock = Object.assign({}, currBlock, { code: studentCode })
    const solution = updatedCodeBlock.solution
    const isMatch = checkIfMatch(studentCode, solution)
    setIsMatch(isMatch)
  }

  const editorWidth = width < 700 ? "300px" : "400px";

  if (isMatch) return <div className='prize-wrapper'>
    <img src={prizeSvg} style={{ width: '100%' }} />
    <h3 style={{ textAlign: 'center', fontSize: '2rem' }}>You did it!</h3>
  </div>

  return (
    <div className='main-layout codeblock-page'>
      <h2>{currBlock?.title}</h2>
      <div className='code-block-content'>
        <div className='left-container'>
          <p style={{ color: 'rgb(153, 217, 234)' }}>{mentor ? 'Readonly mode' : 'Editable mode'}</p>
          <p className='challenge-desc'>{currBlock?.problem}</p>
          <button onClick={onCheckAnswer} className='code-submit-btn'>Submit</button>
        </div>
        <div className='right-container'>
          <AceEditor 
            mode="javascript"
            theme="monokai"
            onChange={onCodeChange}
            setOptions={{ useWorker: false }}
            value={studentCode || ''}
            highlightActiveLine={true}
            enableLiveAutocompletion={true}
            debounceChangePeriod={300}
            fontSize={12}
            height="400px"
            width={editorWidth}
            readOnly={mentor ? true : false}
          />
        </div>
      </div>
    </div>
  )
}

export default CodeBlockPage



