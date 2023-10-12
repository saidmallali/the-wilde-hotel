import {
  cloneElement,
  useContext,
  useState,
  ReactNode,
  createContext,
  ReactElement,
  JSXElementConstructor,
} from "react";
import { HiXMark } from "react-icons/hi2";
import styled from "styled-components";
import { createPortal } from "react-dom";
import { useOutsideClick } from "../hooks/useOutsideClick";

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 2rem;
  transition: all 0.5s;
  max-height: 100vh;
  overflow: scroll;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    /* Sometimes we need both */
    /* fill: var(--color-grey-500);
    stroke: var(--color-grey-500); */
    color: var(--color-grey-500);
  }
`;
interface ContextInt {
  open: (arg: string) => void;
  close: () => void;
  openName: string;
}

const IntialState = {
  openName: "",
  open,
  close,
};

const ModalContext = createContext<ContextInt>(IntialState);

interface ModalProps {
  children: ReactNode;
}

function Modal({ children }: ModalProps) {
  const [openName, setOpenName] = useState("");

  const close = () => setOpenName("");

  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ open, close, openName }}>
      {children}
    </ModalContext.Provider>
  );
}

interface OpenProps {
  children: ReactNode;
  opens: string;
}
function Open({ opens: opensWindowName, children }: OpenProps) {
  const { open } = useContext(ModalContext);

  return cloneElement(
    children as ReactElement<any, string | JSXElementConstructor<any>>,
    { onClick: () => open(opensWindowName) }
  );
}

interface WindowProps {
  children: ReactNode;
  name: string;
}
const Window = ({ children, name }: WindowProps) => {
  const { openName, close } = useContext(ModalContext);

  const refEL = useOutsideClick(close);

  if (name !== openName) return null;
  return createPortal(
    <Overlay>
      <StyledModal ref={refEL}>
        <Button onClick={close}>
          <HiXMark />
        </Button>
        <div>
          {cloneElement(
            children as ReactElement<any, string | JSXElementConstructor<any>>,
            { onClose: close }
          )}
        </div>
      </StyledModal>
    </Overlay>,
    document.body
  );
};

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
