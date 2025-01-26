import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useImperativeHandle,
} from "react";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";

import { loadMoreRows, CHUNK_SIZE, indexBasedStyle } from "../utils";
import type { HandlerRef } from "../components/useScrollTo";

type Props = {
  initialIndex: number;
  handlerRef: HandlerRef;
};

const ScrollArea = ({ initialIndex, handlerRef }: Props) => {
  const [rows, setRows] = useState<string[]>([]);
  const [firstItemIndex, setFirstItemIndex] = useState(initialIndex);

  useEffect(() => {
    (async () => {
      const newRows = await loadMoreRows("down", initialIndex);
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
  useImperativeHandle(handlerRef, () => ({ scrollTo }), [scrollTo]);

  return (
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
  );
};

export default ScrollArea;
