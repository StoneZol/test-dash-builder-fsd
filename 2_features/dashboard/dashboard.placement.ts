import type { DashboardLayoutItem } from './dashboard.types';

export const DASHBOARD_COLS = 12;

type Size = {
  w: number;
  h: number;
};

const collides = (
  a: Pick<DashboardLayoutItem, 'x' | 'y' | 'w' | 'h'>,
  b: Pick<DashboardLayoutItem, 'x' | 'y' | 'w' | 'h'>,
) =>
  a.x < b.x + b.w &&
  a.x + a.w > b.x &&
  a.y < b.y + b.h &&
  a.y + a.h > b.y;

/**
 * First free cell for a new item: left → right, then top → bottom.
 * Fills columns before opening a new row when space allows.
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
