/**
 * Computes the greatest common divisor of two integers
 * @returns The largest positive integer that divides both a and b without leaving a remainder
 */
export const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))

/**
 * Computes the least common multiple of two integers.
 * @returns The smallest positive integer that is divisible by both a and b
 */
export const lcm = (a: number, b: number) => (a * b) / gcd(a, b)

const GOLDEN_ANGLE = 137.508

/**
 * Generates `n` perceptually distinct colors by rotating the hue of a base color
 * using the golden angle (137.508°) in oklch color space.
 */
export const generateColors = (n: number, base = 'var(--color-base-content)'): string[] =>
	Array.from({ length: n }, (_, i) => {
		const offset = Math.round(GOLDEN_ANGLE * i) % 360
		return `oklch(from ${base} l max(c, 0.15) calc(h + ${offset}))`
	})
