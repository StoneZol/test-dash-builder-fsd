import type { DashboardLayoutItem } from './dashboard.types';

/** Grid column count shared with `react-grid-layout` in the Dashboard widget. */
export const DASHBOARD_COLS = 12;

type Size = {
  w: number;
  h: number;
};

/** Axis-aligned rectangle intersection on the grid. */
const collides = (
  a: Pick<DashboardLayoutItem, 'x' | 'y' | 'w' | 'h'>,
  b: Pick<DashboardLayoutItem, 'x' | 'y' | 'w' | 'h'>,
) =>
  a.x < b.x + b.w &&
  a.x + a.w > b.x &&
  a.y < b.y + b.h &&
  a.y + a.h > b.y;

/**
 * Finds the first free cell for a new layout item.
 * Scans left → right, then top → bottom, so free columns fill before a new row.
 *
 * @param layout - Current grid items
 * @param size - Desired `w` / `h` (width is clamped to `cols`)
 * @param cols - Grid width in columns (default {@link DASHBOARD_COLS})
 * @returns Top-left `{ x, y }` for the new item
 */
export const findNextLayoutPosition = (
  layout: DashboardLayoutItem[],
  size: Size,
  cols = DASHBOARD_COLS,
): { x: number; y: number } => {
  const w = Math.min(size.w, cols);
  const h = size.h;
  const maxY =
    layout.reduce((max, item) => Math.max(max, item.y + item.h), 0) + h;

  for (let y = 0; y <= maxY; y += 1) {
    for (let x = 0; x <= cols - w; x += 1) {
      const candidate = { x, y, w, h };
      const hasCollision = layout.some((item) => collides(candidate, item));

      if (!hasCollision) {
        return { x, y };
      }
    }
  }

  return {
    x: 0,
    y: layout.reduce((max, item) => Math.max(max, item.y + item.h), 0),
  };
};
