import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useImperativeHandle,
} from "react";
import { Virtualizer, type VirtualizerHandle } from "virtua";

import {
  loadMoreRows as loadMoreRows_,
  CHUNK_SIZE,
  indexBasedStyle,
} from "../utils";
import type { HandlerRef } from "../components/useScrollTo";

type Props = {
  initialIndex: number;
  handlerRef: HandlerRef;
};

const ScrollArea = ({ initialIndex, handlerRef }: Props) => {
  const ref = useRef<VirtualizerHandle>(null);
  const [rows, setRows] = useState<string[]>([]);
  // NOTE: API が絶対的なインデックスを必要としない場合は不要
  const firstItemIndex = useRef(initialIndex);

  // SEE: https://github.com/inokawa/virtua/blob/0.39.3/docs/react/interfaces/VirtualizerProps.md#shift
  const [shift, setShift] = useState(false);

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

  type LoadState = "preload" | "load" | "postload";
  const [loadState, setLoadState] = useState<LoadState>("load");
  useEffect(() => {
    if (loadState !== "load") return;

    (async () => {
      const firstItemIndexWithBuffer = firstItemIndex.current - CHUNK_SIZE / 2;
      const newRows = await loadMoreRows("down", firstItemIndexWithBuffer);
      setShift(false);
      setRows(newRows);
      firstItemIndex.current = firstItemIndexWithBuffer;
      setLoadState("postload");
    })();
  }, [loadMoreRows, loadState]);
  useEffect(() => {
    if (loadState !== "postload") return;

    ref.current?.scrollToIndex(CHUNK_SIZE / 2, { align: "start" });
    setLoadState("postload");
  }, [loadState]);

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
    } else if (ref.current.findStartIndex() <= 0) {
      const newRows = await loadMoreRows("up", firstItemIndex.current);
      setShift(true);
      setRows((rows) => [...newRows, ...rows]);
      firstItemIndex.current = firstItemIndex.current - CHUNK_SIZE;
    }
  }, [loadMoreRows, rows.length]);

  const scrollTo = useCallback(
    async (index: number) => {
      if (!ref.current) return;

      // NOTE: インデックスが管理範囲内ならスクロールし、範囲外なら初期状態と同じように表示する
      const firstItemIndex_ = firstItemIndex.current;
      if (index >= firstItemIndex_ && index < firstItemIndex_ + rows.length) {
        ref.current.scrollToIndex(index - firstItemIndex_, { align: "start" });
      } else {
        firstItemIndex.current = index;
        setLoadState("load");
      }
    },
    [rows.length],
  );
  useImperativeHandle(handlerRef, () => ({ scrollTo }), [scrollTo]);

  return (
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
  );
};

export default ScrollArea;
