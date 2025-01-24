import { useState, useCallback, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";

import { loadMoreRows, CHUNK_SIZE, indexBasedStyle } from "../utils";
import Title from "../components/Title";
import ScrollButton from "../components/ScrollButton";

const INITIAL_ITEM_INDEX = 500;

const App = () => {
  const [rows, setRows] = useState<string[]>([]);
  const [firstItemIndex, setFirstItemIndex] = useState(INITIAL_ITEM_INDEX);

  useEffect(() => {
    (async () => {
      const newRows = await loadMoreRows("down", INITIAL_ITEM_INDEX);
      setRows(newRows);
    })();
  }, []);

  const loadMoreRowsDown = useCallback(
    async (rowCount: number) => {
      const newRows = await loadMoreRows("down", firstItemIndex + rowCount + 1);
      setRows((rows) => [...rows, ...newRows]);
    },
    [rows, firstItemIndex],
  );

  const loadMoreRowsUp = useCallback(
    async (index: number) => {
      const newRows = await loadMoreRows("up", index);
      setRows((rows) => [...newRows, ...rows]);
      setFirstItemIndex((prev) => prev - CHUNK_SIZE);
    },
    [rows],
  );

  const ref = useRef<VirtuosoHandle>(null);
  const onClick = useCallback(() => {
    if (!ref.current) return;
    ref.current.scrollToIndex({
      index: 0,
      align: "center",
      behavior: "auto",
    });
  }, []);

  return (
    <div className="p-4 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <Title
          name="react-virtuoso"
          link="https://github.com/petyosi/react-virtuoso"
        />
        <ScrollButton onClick={onClick} />
      </div>
      <Virtuoso
        ref={ref}
        style={{ height: 300 }}
        data={rows}
        firstItemIndex={firstItemIndex}
        startReached={loadMoreRowsUp}
        endReached={loadMoreRowsDown}
        itemContent={(index, rows) => {
          return (
            <div key={index} style={indexBasedStyle(index)}>
              {rows}
            </div>
          );
        }}
      />
    </div>
  );
};

createRoot(document.getElementById("react-virtuoso")!).render(<App />);
