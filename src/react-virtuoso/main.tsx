import { createRoot } from "react-dom/client";

import Title from "../components/Title";
import ScrollPanel from "../components/ScrollPanel";
import ScrollArea from "./ScrollArea";
import { useScrollTo } from "../components/useScrollTo";
import ScriptSize from "../components/ScriptSize";

const App = () => {
  const { handler, scrollTo } = useScrollTo();

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1 flex-col sm:flex-row sm:justify-between">
        <div className="flex items-end gap-2">
          <Title
            name="react-virtuoso"
            link="https://github.com/petyosi/react-virtuoso"
          />
          <ScriptSize scriptName="react-virtuoso" />
        </div>
        <ScrollPanel scrollTo={scrollTo} />
      </div>
      <ScrollArea initialIndex={500} handlerRef={handler} />
    </div>
  );
};

createRoot(document.getElementById("react-virtuoso")!).render(<App />);
