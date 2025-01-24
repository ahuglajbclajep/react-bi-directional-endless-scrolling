import { useState, useCallback, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

import { Virtualizer, type VirtualizerHandle } from "virtua";

import { loadMoreRows as loadMoreRows_, CHUNK_SIZE } from "../utils";
import { Title } from "../Components";

const INITIAL_ITEM_INDEX = 500;

const App = () => {
  const [rows, setRows] = useState<string[]>([]);
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
    console.log(isLoading.current);
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

  return (
    <div className="p-4 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <Title name="virtua" link="https://github.com/inokawa/virtua" />
      </div>
      <div className="h-[300px] overflow-y-auto">
        <Virtualizer ref={ref} onScroll={onScroll} shift={shift}>
          {rows.map((row) => {
            const index = Number(row.split("#")[1]);
            return (
              <div
                key={index}
                style={{
                  backgroundColor: `hsl(${(index * 97) % 360}, 70%, 80%)`,
                  height: `${Math.max((index * 97) % 120, 32)}px`,
                }}
              >
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
