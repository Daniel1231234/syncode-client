import ReactDOM from 'react-dom';

import classes from './Modal.module.css';


const Backdrop = ({ onConfirm }: any) => {
  return <div className={classes.backdrop} onClick={onConfirm} />;
};

export interface IModalProps {
  title: string
  message: string
  onConfirm?: any
  onReveal?: any
  showRevealBtn?: boolean
}


const ModalOverlay = (props: IModalProps) => {
  return (
    <div className={classes.modal}>
      <>
        <header className={classes.header}>
          <h2>{props.title}</h2>
        </header>
        <div className={classes.content}>
          <p>{props.message}</p>
        </div>
        <footer className={classes.actions}>
          <button className={classes.btnModal} onClick={props.onConfirm}>OK</button>
        </footer>
      </>
      {props.showRevealBtn && <button onClick={props.onReveal}>Reveal</button>}
    </div>
  );
};


const ErrorModal = (props: IModalProps) => {
  // Get DOM elements where the modal should be rendered
  const Elbackdrop: any = document.getElementById('backdrop-root')
  const Eloverlay: any = document.getElementById('overlay-root')
  return (
    <>
      {ReactDOM.createPortal(
        // Render the Backdrop component
        <Backdrop onConfirm={props.onConfirm} />,
        // Pass the DOM element where the Backdrop should be rendered
        Elbackdrop
      )}
      {ReactDOM.createPortal(
        // Render the ModalOverlay component
        <ModalOverlay
          title={props.title}
          message={props.message}
          onConfirm={props.onConfirm}
        />,
        // Pass the DOM element where the ModalOverlay should be rendered
        Eloverlay
      )}
    </>
  );
};

export default ErrorModal;