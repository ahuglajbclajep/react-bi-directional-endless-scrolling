import { useState, useCallback, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

import { Virtualizer, type VirtualizerHandle } from "virtua";

import {
  loadMoreRows as loadMoreRows_,
  CHUNK_SIZE,
  indexBasedStyle,
} from "../utils";
import Title from "../components/Title";
import ScrollPanel from "../components/ScrollPanel";

const INITIAL_ITEM_INDEX = 500;

const App = () => {
  const [rows, setRows] = useState<string[]>([]);
  // SEE: https://github.com/inokawa/virtua/blob/0.39.3/docs/react/interfaces/VirtualizerProps.md#shift
  const [shift, setShift] = useState(false);

  // NOTE: API が絶対的なインデックスを必要としない場合は不要
  const firstItemIndex = useRef(INITIAL_ITEM_INDEX);

  // NOTE: 同じ引数で何度も関数が呼ばれる挙動があるので、ロード中であるというフラグを作る
  const isLoading = useRef(false);
  const loadMoreRows = useCallback(
    async (...params: Parameters<typeof loadMoreRows_>) => {
      isLoading.current = true;
      const newRows = await loadMoreRows_(...params);
      isLoading.current = false;
      return newRows;
    },
    [],
  );

  useEffect(() => {
    (async () => {
      const newRows = await loadMoreRows("down", firstItemIndex.current);
      setShift(false);
      setRows(newRows);
    })();
  }, []);

  const ref = useRef<VirtualizerHandle>(null);
  const onScroll = useCallback(async () => {
    if (!ref.current || isLoading.current) return;

    const rowCount = rows.length;
    if (ref.current.findEndIndex() + 1 === rowCount) {
      const newRows = await loadMoreRows(
        "down",
        firstItemIndex.current + rowCount,
      );
      setShift(false);
      setRows((rows) => [...rows, ...newRows]);
    } else if (ref.current.findStartIndex() === 0) {
      const newRows = await loadMoreRows("up", firstItemIndex.current);
      setShift(true);
      setRows((rows) => [...newRows, ...rows]);
      firstItemIndex.current = firstItemIndex.current - CHUNK_SIZE;
    }
  }, [rows]);

  const scrollTo = useCallback(
    async (index: number) => {
      if (!ref.current) return;

      const firstItemIndex_ = firstItemIndex.current;
      if (index >= firstItemIndex_ && index < firstItemIndex_ + rows.length) {
        ref.current.scrollToIndex(index - firstItemIndex_, { align: "start" });
      } else {
        const newRows = await loadMoreRows("down", index);
        setShift(false);
        setRows(newRows);
        firstItemIndex.current = index;
      }
    },
    [rows],
  );

  return (
    <div className="p-4 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <Title name="virtua" link="https://github.com/inokawa/virtua" />
        <ScrollPanel scrollTo={scrollTo} />
      </div>
      <div className="h-[300px] overflow-y-auto">
        <Virtualizer ref={ref} onScroll={onScroll} shift={shift}>
          {rows.map((row) => {
            const index = Number(row.split("#")[1]);
            return (
              <div key={index} style={indexBasedStyle(index)}>
                {row}
              </div>
            );
          })}
        </Virtualizer>
      </div>
    </div>
  );
};

createRoot(document.getElementById("virtua")!).render(<App />);
