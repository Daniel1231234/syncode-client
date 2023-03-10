import './CodeBlockPage.css'
import { useState } from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import AceEditor from 'react-ace'
import { WebsocketContext } from '../../context/SocketContext'
import ErrorModal, { IModalProps } from '../UI/Modal'
import { ICodeBlock } from '../../models/ICodeBlock'
import Prize from './Prize'


// This component is the page where the student can interact with the code block.
// It uses the useState, useContext, and useEffect hooks from React to update the state,
// handle context and manage side effects respectively
const CodeBlockPage: React.FC = () => {
  const socket = useContext(WebsocketContext);
  const { getCurrBlock, checkIfMatch, setShowBackBtn } = useContext(AppContext)
  const currBlock: ICodeBlock = JSON.parse(JSON.stringify(getCurrBlock()))
  const [studentCode, setStudentCode] = useState<string>(currBlock.code)
  const [isMatch, setIsMatch] = useState(false)
  const [width, setWidth] = useState(window.innerWidth);
  const [connectedUsers, setConnectedUsers] = useState<string[] | []>([])
  const [mentor, setMentor] = useState<string | undefined>()
  const [wrongSolution, setWrongSolution] = useState<IModalProps | null>(null)
  const [revealAnswer, setRevealAnswer] = useState(false)

  // useEffect to handle window resizing
  useEffect(() => {
    const handleResize = () :void => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  // listen for 'joined_users' event from socket
  // when event is received, update the connectedUsers state and if there's only one user, 
  // set that user as the mentor
  useEffect(() => {
    setShowBackBtn(true)
    if (!socket) return
    socket.on('joined_users', (data: string[] | []) => {
      
      if (data) setConnectedUsers(data)
      if (data.length === 1) {
        setMentor(data[0])
      }
    })

    // cleanup function to remove the event listener when component unmounts
    return () => {
      socket.off('joined_users')
    }
  }, [socket, connectedUsers, mentor])


  useEffect(() => {
    if (!socket) return
    socket.on('code_updated', (data: string) => {
      setStudentCode(data)
    })
    // clean up function to remove the event listener when component unmounts
    return () => {
      socket.off('code_updated')
    }
  }, [socket])



  // called when the code in the AceEditor is changed.
  const onCodeChange = (val: string) => {
    setStudentCode(val)
    const updatedCode = JSON.parse(JSON.stringify(val))
    const data = { updatedCode, currBlock:currBlock.title }
    socket.emit('update_code', data)
  }

  // updates the current code block with the student's code and then checks if it matches the solution
  const onCheckAnswer = () => {
    const updatedCodeBlock = Object.assign({}, currBlock, { code: studentCode })
    const solution = updatedCodeBlock.solution
    const isMatch = checkIfMatch(studentCode, solution)
    if (!isMatch) {
      // open err modal
      setWrongSolution({ title: 'Wrong answer', message: 'Please Try again...' })
    }
    setIsMatch(isMatch)
  }


  if (isMatch) return <Prize />
  return (
    <div className='main-layout codeblock-page'>
      {wrongSolution && <ErrorModal
        title={wrongSolution.title}
        message={wrongSolution.message}
        onConfirm={() => setWrongSolution(null)} />}
      <h2>{currBlock?.title}</h2>
      <div className='code-block-content'>
        <div className='left-container'>
          <p style={{ color: 'rgb(153, 217, 234)', textAlign: 'center' }}>{mentor ? 'Readonly mode' : 'Editable mode'}</p>
          <p className='challenge-desc'>{currBlock?.problem}</p>
          <button onClick={onCheckAnswer} className='code-submit-btn'>Submit</button>
          <button className='reveal-answer-btn' onClick={() => setRevealAnswer(!revealAnswer)}>{!revealAnswer ? 'Reveal ' : 'Hide '}Solution</button>
          {revealAnswer && <AceEditor mode="javascript"
            theme="monokai"
            onChange={onCodeChange}
            setOptions={{ useWorker: false }}
            value={currBlock?.solution || ''}
            fontSize={12}
            height="400px"
            width={width < 700 ? "300px" : "400px"}
            readOnly />}
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
            width={width < 700 ? "300px" : "400px"}
            readOnly={mentor ? true : false}
          />
        </div>
      </div>
    </div>
  )
}

export default CodeBlockPage



