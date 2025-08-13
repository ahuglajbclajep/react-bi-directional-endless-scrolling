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
  // NOTE: rows[0] のデータまでの絶対的なオフセット、API がこれを必要としない場合は不要
  const offsetFromFirstItem = useRef(initialIndex);

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

  // NOTE: onScroll は rows の更新によって自身を再度呼び出すことがあるため、更新直後のスクロールをスキップする
  const skipScroll = useRef(true);
  const onScroll = useCallback(async () => {
    if (!ref.current || isLoading.current || skipScroll.current) {
      skipScroll.current = false;
      return;
    }

    if (ref.current.findEndIndex() + 1 === rows.length) {
      // NOTE: 下方向にスクロールして下限に到達した場合
      const offsetFromDataTop = offsetFromFirstItem.current + rows.length;
      const newRows = await loadMoreRows(offsetFromDataTop);
      setShift(false);
      setRows((rows) => [...rows, ...newRows]);
      skipScroll.current = true;
    } else if (ref.current.findStartIndex() <= 0) {
      // NOTE: 上方向にスクロールして上限に到達した場合
      const offsetFromDataTop = offsetFromFirstItem.current - CHUNK_SIZE;
      const newRows = await loadMoreRows(offsetFromDataTop);
      setShift(true);
      setRows((rows) => [...newRows, ...rows]);
      offsetFromFirstItem.current -= newRows.length;
      skipScroll.current = true;
    }
  }, [loadMoreRows, rows.length]);

  useEffect(() => {
    (async () => {
      // NOTE: データがないと上方向へのスクロールができないので、バッファ込みでデータを取る
      const offsetWithBuffer =
        offsetFromFirstItem.current - Math.floor(CHUNK_SIZE / 2);
      const newRows = await loadMoreRows(offsetWithBuffer);
      setShift(false);
      setRows(newRows);
      offsetFromFirstItem.current = offsetWithBuffer;
    })();
  }, [loadMoreRows]);

  // NOTE: scrollTo のための状態
  type LoadState = "preload" | "load" | "postload";
  const [loadState, setLoadState] = useState<LoadState>("load");
  const scrollTo = useCallback(
    async (index: number) => {
      if (!ref.current) return;

      // NOTE: インデックスが管理範囲内ならスクロールし、範囲外なら初期状態と同じように表示する
      const offset = offsetFromFirstItem.current;
      if (index >= offset && index < offset + rows.length) {
        ref.current.scrollToIndex(index - offset, { align: "start" });
      } else {
        offsetFromFirstItem.current = index;
        setLoadState("load");
      }
    },
    [rows.length],
  );
  // NOTE: load → postload → preload
  const offsetForJump = useRef(0); // ジャンプする位置を一時的に記憶するのに使う
  useEffect(() => {
    if (loadState !== "load") {
      return;
    }
    (async () => {
      const offsetWithBuffer =
        offsetFromFirstItem.current - Math.floor(CHUNK_SIZE / 2);
      const newRows = await loadMoreRows(offsetWithBuffer);
      setShift(false);
      setRows(newRows);
      offsetForJump.current = offsetFromFirstItem.current - offsetWithBuffer;
      offsetFromFirstItem.current = offsetWithBuffer;
      setLoadState("postload");
    })();
  }, [loadMoreRows, loadState]);
  useEffect(() => {
    if (loadState !== "postload") {
      return;
    }
    ref.current?.scrollToIndex(offsetForJump.current, { align: "start" });
    setLoadState("preload");
  }, [loadState]);
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
