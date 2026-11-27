export type Point = { x: number; y: number };

export const FIRST_DOTS = 5;
export const DOTS_PER_LEVEL = 3;
export const MAX_DOTS = 50;
export const FIRST_TIME_LIMIT = 30;
export const SECONDS_PER_LEVEL = 5;
/** Distances this close (px) cannot be told apart by eye, so both count as nearest. */
export const TIE_TOLERANCE = 3;

export function levelConfig(level: number) {
	return {
		dots: Math.min(FIRST_DOTS + (level - 1) * DOTS_PER_LEVEL, MAX_DOTS),
		seconds: FIRST_TIME_LIMIT + (level - 1) * SECONDS_PER_LEVEL
	};
}

export function distance(a: Point, b: Point) {
	return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Indices of the unvisited dots that count as nearest to `from`. */
export function nearest(points: Point[], from: number, visited: ReadonlySet<number>) {
	const left = points.map((_, i) => i).filter((i) => i !== from && !visited.has(i));
	const min = Math.min(...left.map((i) => distance(points[from], points[i])));
	return left.filter((i) => distance(points[from], points[i]) <= min + TIE_TOLERANCE);
}

/**
 * Scatter `count` dots over a board, keeping them apart. The spacing shrinks when
 * the board is too crowded, so this always terminates, even on tiny screens.
 */
export function placeDots(
	count: number,
	width: number,
	height: number,
	random: () => number = Math.random
) {
	const margin = 24;
	let spacing = 56;
	let points: Point[] = [];
	let misses = 0;

	while (points.length < count) {
		const point = {
			x: margin + random() * Math.max(width - margin * 2, 0),
			y: margin + random() * Math.max(height - margin * 2, 0)
		};
		if (points.every((p) => distance(p, point) >= spacing)) {
			points.push(point);
		} else if (++misses > 200) {
			spacing *= 0.9;
			points = [];
			misses = 0;
		}
	}

	return { points, spacing };
}
