import "./CustomBtn.css"

type Props = {
    title:string
    onAction:React.MouseEventHandler<HTMLButtonElement>
}

const CustomBtn = ({title, onAction}: Props) => {
  return (
      <button onClick={onAction} className="customBtn">{ title }</button>
  )
}

export default CustomBtn