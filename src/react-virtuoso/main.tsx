import { useState, useCallback, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import { loadMoreRows, CHUNK_SIZE } from "../utils";
import { Title, ScrollButton } from "../Components";

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

  const loadMoreRowsUp = useCallback(
    async (index: number) => {
      const newRows = await loadMoreRows("up", index);
      setRows((rows) => [...newRows, ...rows]);
      setFirstItemIndex((prev) => prev - CHUNK_SIZE);
    },
    [rows],
  );

  const loadMoreRowsDown = useCallback(
    async (lastIndex: number) => {
      const newRows = await loadMoreRows(
        "down",
        firstItemIndex + lastIndex + 1,
      );
      setRows((rows) => [...rows, ...newRows]);
    },
    [rows, firstItemIndex],
  );

  const virtuoso = useRef<VirtuosoHandle>(null);
  const onClick = useCallback(() => {
    if (!virtuoso.current) return;
    virtuoso.current.scrollToIndex({
      index: 0,
      align: "center",
      behavior: "smooth",
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
        ref={virtuoso}
        style={{ height: 400 }}
        data={rows}
        firstItemIndex={firstItemIndex}
        startReached={loadMoreRowsUp}
        endReached={loadMoreRowsDown}
        itemContent={(index, rows) => {
          return (
            <div
              key={index}
              style={{
                backgroundColor: `hsl(${(index * 97) % 360}, 70%, 80%)`,
                height: `${Math.max((index * 97) % 120, 32)}px`,
              }}
            >
              {rows}
            </div>
          );
        }}
      />
    </div>
  );
};

createRoot(document.getElementById("react-virtuoso")!).render(<App />);
