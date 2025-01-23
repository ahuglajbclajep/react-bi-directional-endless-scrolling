export const CHUNK_SIZE = 10;

export async function loadMoreRows(direction: "up" | "down", index: number) {
  await new Promise((r) => setTimeout(r, 500));
  const rows = [...Array(CHUNK_SIZE)].map((_, i) =>
    direction === "up" ? `#${index - CHUNK_SIZE + i}` : `#${index + i}`,
  );
  return rows;
}
