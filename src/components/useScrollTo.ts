import { useRef, useCallback } from "react";

export type Handle = {
  scrollTo: (index: number) => void;
};

export type HandlerRef = React.RefObject<Handle | null>;

export const useScrollTo = () => {
  const handler = useRef<Handle>(null);
  const scrollTo = useCallback(
    (index: number) => handler.current?.scrollTo(index),
    [],
  );
  return { handler, scrollTo };
};
