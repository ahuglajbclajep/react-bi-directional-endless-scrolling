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
  const ref = useRef<VirtuosoHandle>(null);
  const [rows, setRows] = useState<string[]>([]);
  const [offsetFromFirstItem, setOffsetFromFirstItem] = useState(initialIndex);

  useEffect(() => {
    (async () => {
      const newRows = await loadMoreRows(offsetFromFirstItem);
      setRows(newRows);
      setOffsetFromFirstItem(offsetFromFirstItem);
    })();
  }, []);

  const loadMoreRowsDown = useCallback(
    async (rowCount: number) => {
      const newRows = await loadMoreRows(offsetFromFirstItem + rowCount + 1);
      setRows((rows) => [...rows, ...newRows]);
    },
    [offsetFromFirstItem],
  );

  const loadMoreRowsUp = useCallback(async (index: number) => {
    const newRows = await loadMoreRows(index - CHUNK_SIZE);
    setRows((rows) => [...newRows, ...rows]);
    setOffsetFromFirstItem((prev) => prev - newRows.length);
  }, []);

  // NOTE: rows を完全に入れ替える場合は、強制的に再描画してスクロール位置をリセットする
  const [key, setKey] = useState(0);
  const scrollTo = useCallback(
    async (index: number) => {
      if (!ref.current) return;

      // NOTE: インデックスが管理範囲内ならスクロールし、範囲外なら初期状態と同じように表示する
      if (
        index >= offsetFromFirstItem &&
        index < offsetFromFirstItem + rows.length
      ) {
        ref.current.scrollToIndex({
          index: index - offsetFromFirstItem,
          align: "start",
        });
      } else {
        const newRows = await loadMoreRows(index);
        setRows(newRows);
        setOffsetFromFirstItem(index);
        setKey((prev) => prev + 1);
      }
    },
    [offsetFromFirstItem, rows.length],
  );
  useImperativeHandle(handlerRef, () => ({ scrollTo }), [scrollTo]);

  return (
    <Virtuoso
      key={key}
      ref={ref}
      style={{ height: 300 }}
      data={rows}
      firstItemIndex={offsetFromFirstItem}
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
