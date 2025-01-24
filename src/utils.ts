export const CHUNK_SIZE = 10;

export async function loadMoreRows(
  direction: "up" | "down",
  fromIndex: number,
) {
  await new Promise((r) => setTimeout(r, 100));
  const rows = [...Array(CHUNK_SIZE)].map((_, i) =>
    direction === "up" ? `#${fromIndex - CHUNK_SIZE + i}` : `#${fromIndex + i}`,
  );
  return rows;
}

export function indexBasedStyle(index: number) {
  // NOTE: 97 は2桁の素数の中で最大の数
  return {
    backgroundColor: `hsl(${(index * 97) % 360}, 70%, 80%)`,
    height: `${Math.max((index * 97) % 120, 32)}px`,
  };
}
