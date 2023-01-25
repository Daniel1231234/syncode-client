import './CodeBlockPage.css'
import { useState } from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import AceEditor from 'react-ace'
import { WebsocketContext } from '../../context/SocketContext'
import prizeSvg from "../../assets/prize.svg"
import { useNavigate } from 'react-router-dom'

type Props = {
  setShowBackBtn: any
  showBackBtn:boolean
}
const CodeBlockPage = ({setShowBackBtn, showBackBtn}: Props) => {
  const socket = useContext(WebsocketContext);
  const { setIsMentor, isMentor, getCurrBlock, checkIfMatch } = useContext(AppContext)
  const currBlock = JSON.parse(JSON.stringify(getCurrBlock()))
  const [studentCode, setStudentCode] = useState<string>(currBlock.code)
  const [isMatch, setIsMatch] = useState(false)
  const [width, setWidth] = useState(window.innerWidth);


  useEffect(() => {
  window.addEventListener("resize", () => {
    setWidth(window.innerWidth);
  });
  }, []);
  

  useEffect(() => {
    setShowBackBtn(true)
  }, [showBackBtn])


  useEffect(() => {
    if (!socket) return
    socket.on('joined_users', (data: any) => {
      const { joinedUsers } = data
      if (joinedUsers === 1) setIsMentor(true)
      console.log(joinedUsers)
    })

    return () => {
      socket.off('joined_users')
    }
  }, [socket, isMentor, currBlock])


  useEffect(() => {
    if (!socket) return
    socket.on('code_updated', (data: any) => {
      setStudentCode(data.code)
    })

    return () => {
      socket.off('code_updated')
    }
  }, [socket])




  const onCodeChange = (val: string) => {
    setStudentCode(val)
    const updatedCode = JSON.parse(JSON.stringify(val))
    socket.emit('update_code', { code: updatedCode })
  }

  const onCheckAnswer = () => {
    const updatedCodeBlock = Object.assign({}, currBlock, { code: studentCode })
    // console.log(updatedCodeBlock)
    const solution = updatedCodeBlock.solution
    const isMatch = checkIfMatch(studentCode, solution)
    setIsMatch(isMatch)

  }

  const editorWidth = width < 700 ? "300px" : "400px";

  if (isMatch) return <div className='centerDiv'>
    <img src={prizeSvg} style={{ width: '100%' }} />
    <h3 style={{textAlign:'center', fontSize:'2rem'}}>You did it!</h3>
  </div>

  return (
    <div className='main-layout codeblock-page'>
      <h2>{currBlock?.title}</h2>
      <div className='code-block-content'>
        <div className='left-container'>
         <p  className='challenge-desc'>{currBlock?.problem}</p> 
        <button onClick={onCheckAnswer} className='code-submit-btn'>Check my answer!</button>
        </div>
        <div className='editor-wrapper'>
          <AceEditor className='editor'
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
            readOnly={isMentor}
          />
          </div>
      </div>
    </div>
  )
}

export default CodeBlockPage



