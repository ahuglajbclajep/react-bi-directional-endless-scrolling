import { createRoot } from "react-dom/client";

import Title from "../components/Title";
import ScrollPanel from "../components/ScrollPanel";
import ScrollArea from "./ScrollArea";
import { useScrollTo } from "../components/useScrollTo";

const App = () => {
  const { handler, scrollTo } = useScrollTo();

  return (
    <div className="p-4 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <Title name="virtua" link="https://github.com/inokawa/virtua" />
        <ScrollPanel scrollTo={scrollTo} />
      </div>
      <ScrollArea initialIndex={500} handlerRef={handler} />
    </div>
  );
};

createRoot(document.getElementById("virtua")!).render(<App />);
