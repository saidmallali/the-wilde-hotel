import { MouseEventHandler } from "react";
import {
  ReactNode,
  createContext,
  useState,
  SetStateAction,
  Dispatch,
  useContext,
} from "react";
import { createPortal } from "react-dom";
import { HiEllipsisVertical } from "react-icons/hi2";
import styled from "styled-components";
import { useOutsideClick } from "../hooks/useOutsideClick";

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;
interface Position {
  x: number;
  y: number;
}

interface Props {
  position: Position;
  children: ReactNode;
}

const StyledList = styled.ul<Props>`
  position: fixed;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  right: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

interface MenusProps {
  children: ReactNode;
}

// const intialValue = {
//   openId: "",
//   open: () => null,
//   close: () => null,
// };
// Dispatch<SetStateAction<string>>
interface ContextINterface {
  openId: string;
  open: Dispatch<SetStateAction<string>>;
  close: Dispatch<SetStateAction<string>>;
  position: Position;
  setPosition: Dispatch<SetStateAction<Position>>;
}
const MenusContext = createContext<ContextINterface>({} as ContextINterface);

function Menus({ children }: MenusProps) {
  const [openId, setOpenId] = useState("");
  const [position, setPosition] = useState({} as Position);
  const close = setOpenId;
  const open = setOpenId;

  return (
    <MenusContext.Provider
      value={{ openId, close, open, position, setPosition }}
    >
      {children}
    </MenusContext.Provider>
  );
}

interface ToggoleProps {
  id: string;
}
function Toggle({ id }: ToggoleProps) {
  const { openId, close, open, setPosition } = useContext(MenusContext);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = (e?.target as HTMLElement)
      ?.closest("button")
      ?.getBoundingClientRect();
    let actualPositon;
    if (rect) {
      actualPositon = {
        x: window.innerWidth - rect.width - rect.x,
        y: rect.y + rect.height + 5,
      };
    }

    setPosition(actualPositon as Position);
    console.log(rect);
    openId === "" || openId !== id ? open(id) : close("");
  };
  return (
    <StyledToggle onClick={handleClick}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}

interface ListProps {
  id: string;
  children: ReactNode;
}
function List({ id, children }: ListProps) {
  const { openId, position, close } = useContext(MenusContext);
  function handelClose() {
    close("");
  }
  const ref = useOutsideClick(handelClose);
  if (openId !== id) return null;
  return createPortal(
    <StyledList ref={ref} position={position}>
      {children}
    </StyledList>,
    document.body
  );
}

interface ButtonProps {
  children: ReactNode;
  icon: ReactNode;
  onClick?: () => void;
}
function Button({ children, icon, onClick }: ButtonProps) {
  const { close } = useContext(MenusContext);
  function handelClick() {
    onClick?.();
    close("");
  }
  return (
    <li>
      <StyledButton onClick={handelClick}>
        {icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
