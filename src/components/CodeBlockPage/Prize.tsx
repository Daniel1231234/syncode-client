import prizeSvg from "../../assets/prize.svg"


const Prize = () => {
  return (
    <div className='prize-wrapper'>
    <img src={prizeSvg} style={{ width: '100%' }} />
    <h3 style={{ textAlign: 'center', fontSize: '2rem' }}>You did it!</h3>
  </div>
  )
}

export default Prize