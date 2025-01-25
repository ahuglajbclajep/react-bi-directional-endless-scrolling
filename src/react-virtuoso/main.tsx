import { useState, useCallback, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";

import { loadMoreRows, CHUNK_SIZE, indexBasedStyle } from "../utils";
import Title from "../components/Title";
import ScrollPanel from "../components/ScrollPanel";

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

  // NOTE: rows を完全に入れ替える場合は、強制的に再描画してスクロール位置をリセットする
  const [key, setKey] = useState(0);

  const ref = useRef<VirtuosoHandle>(null);
  const scrollTo = useCallback(
    async (index: number) => {
      if (!ref.current) return;

      // NOTE: インデックスが管理範囲内ならスクロールし、範囲外なら初期状態と同じように表示する
      if (index >= firstItemIndex && index < firstItemIndex + rows.length) {
        ref.current.scrollToIndex({
          index: index - firstItemIndex,
          align: "start",
        });
      } else {
        const newRows = await loadMoreRows("down", index);
        setRows(newRows);
        setFirstItemIndex(index);
        setKey((prev) => prev + 1);
      }
    },
    [firstItemIndex, rows],
  );

  return (
    <div className="p-4 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <Title
          name="react-virtuoso"
          link="https://github.com/petyosi/react-virtuoso"
        />
        <ScrollPanel scrollTo={scrollTo} />
      </div>
      <Virtuoso
        key={key}
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
        // SEE: https://github.com/petyosi/react-virtuoso/issues/1117
        skipAnimationFrameInResizeObserver
      />
    </div>
  );
};

createRoot(document.getElementById("react-virtuoso")!).render(<App />);
