import { describe, expect, test } from 'bun:test';
import { distance, levelConfig, MAX_DOTS, nearest, placeDots } from './game';

describe('levelConfig', () => {
	test('grows dots and time per level, capping the dots', () => {
		expect(levelConfig(1)).toEqual({ dots: 5, seconds: 30 });
		expect(levelConfig(2)).toEqual({ dots: 8, seconds: 35 });
		expect(levelConfig(100).dots).toBe(MAX_DOTS);
	});
});

describe('nearest', () => {
	const points = [
		{ x: 0, y: 0 },
		{ x: 10, y: 0 },
		{ x: 0, y: 12 },
		{ x: 100, y: 0 }
	];

	test('accepts near ties and skips visited dots', () => {
		expect(nearest(points, 0, new Set())).toEqual([1, 2]);
		expect(nearest(points, 0, new Set([1, 2]))).toEqual([3]);
	});
});

describe('placeDots', () => {
	for (const [width, height] of [
		[320, 420],
		[568, 220],
		[1440, 760]
	]) {
		test(`fits ${MAX_DOTS} separated dots in ${width}x${height}`, () => {
			const { points, spacing } = placeDots(MAX_DOTS, width, height);
			expect(points).toHaveLength(MAX_DOTS);
			for (const [i, a] of points.entries()) {
				expect(a.x >= 0 && a.x <= width && a.y >= 0 && a.y <= height).toBe(true);
				for (const b of points.slice(i + 1)) {
					expect(distance(a, b)).toBeGreaterThanOrEqual(spacing);
				}
			}
		});
	}
});
