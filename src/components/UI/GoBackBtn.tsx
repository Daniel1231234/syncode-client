import "./GoBackBtn.css"

type Props = {
    title:string
    onAction:React.MouseEventHandler<HTMLButtonElement>
}

const GoBackBtn = ({title, onAction}: Props) => {
  return (
      <button onClick={onAction} className="goback-btn">{ title }</button>
  )
}

export default GoBackBtn