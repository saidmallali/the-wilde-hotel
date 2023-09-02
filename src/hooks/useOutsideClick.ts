import { useRef, useEffect, MouseEvent, MutableRefObject } from "react";

export function useOutsideClick(handler: () => void): MutableRefObject<null> {
  const refEL = useRef(null);

  useEffect(
    function () {
      function handleClick(e: MouseEvent<Element, MouseEvent> | TouchEvent) {
        const divElement = refEL.current! as HTMLElement;
        if (divElement && !divElement.contains(e.target as Node)) handler();
        console.log("clicked");
      }

      document.addEventListener("click", handleClick, true);

      return () => document.removeEventListener("click", handleClick, true);
    },
    [handler]
  );

  return refEL;
}
