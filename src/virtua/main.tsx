import { createRoot } from "react-dom/client";

import Title from "../components/Title";
import ScrollPanel from "../components/ScrollPanel";
import ScrollArea from "./ScrollArea";
import { useScrollTo } from "../components/useScrollTo";
import ScriptSize from "../components/ScriptSize";

const App = () => {
  const { handler, scrollTo } = useScrollTo();

  return (
    <div className="p-4 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <div className="flex items-end gap-2">
          <Title name="virtua" link="https://github.com/inokawa/virtua" />
          <ScriptSize scriptName="virtua" />
        </div>
        <ScrollPanel scrollTo={scrollTo} />
      </div>
      <ScrollArea initialIndex={500} handlerRef={handler} />
    </div>
  );
};

createRoot(document.getElementById("virtua")!).render(<App />);
