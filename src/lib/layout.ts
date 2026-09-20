/**
 * Scattered grid: one image per row at a shifting column, and every third row
 * gets a second image. Empty cells are -1 (rendered as spacers).
 */
export function buildLayout(count: number, cols: number): number[][] {
  const rows: number[][] = []
  let i = 0
  let r = 0
  while (i < count) {
    const row: number[] = new Array(cols).fill(-1)
    const a = (r * 2 + (r % 2)) % cols
    row[a] = i++
    if (r % 3 === 0 && i < count) {
      let b = (a + 2) % cols
      if (b === a) b = (a + 1) % cols
      row[b] = i++
    }
    rows.push(row)
    r++
  }
  return rows
}
