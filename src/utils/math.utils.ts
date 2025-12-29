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
