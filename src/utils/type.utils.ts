/**
 * Creates a type guard that checks if a value is in the allowed set.
 *
 * @param allowed - array of allowed values
 * @returns Type guard function
 *
 * @example
 * ```ts
 * const isRGB = makeTypeGuard(['red', 'green', 'blue'] as const)
 * if (isRGB(value)) {
 *   // value is 'red' | 'green' | 'blue'
 * }
 * ```
 */
export const makeTypeGuard =
	<const T extends readonly unknown[]>(allowed: T) =>
	(x: unknown): x is T[number] =>
		(allowed as readonly unknown[]).includes(x)

/**
 * Creates a discriminated union type guard for a specific prop.
 *
 * @param prop - Property name to discriminate on
 * @param allowed - Tuple of allowed values for the prop
 * @returns Type guard function
 *
 * @example
 * ```ts
 * const isClickOrKeydown = makeDiscriminatedGuard('type', ['click', 'keydown'] as const)
 * if (isClickOrKeydown(event)) {
 *   // event.type is 'click' | 'keydown'
 * }
 * ```
 */
export const makeDiscriminatedGuard = <T extends string, const Allowed extends readonly string[]>(
	prop: T,
	allowed: Allowed,
) => {
	const set = new Set<string>(allowed as readonly string[])
	return <U extends Record<T, string>>(x: U): x is Extract<U, Record<T, Allowed[number]>> => set.has(x[prop])
}

/**
 * Executes a function, with optional fallback and error handler.
 *
 * @example
 * ```ts
 * // No options - returns T | undefined
 * const valid = attempt(() => decodeURIComponent('%24')) // '$'
 * const invalid = attempt(() => decodeURIComponent('%')) // undefined
 *
 * // With error handler only - returns T | undefined
 * const a = attempt(() => new URL('bad'), {
 * 	onError: (e) => console.error('failed:', e),
 * })
 *
 * // With fallback - returns T (never undefined)
 * const b = attempt(() => new URL('bad'), {
 * 	fallback: new URL('https://example.com'),
 * })
 *
 * // With both - returns T (never undefined)
 * const c = attempt(() => new URL('bad'), {
 * 	fallback: new URL('https://example.com'),
 * 	onError: (e) => console.error('failed:', e),
 * })
 * ```
 */
export function attempt<T>(fn: () => T, options: { fallback: T; onError?: (error: unknown) => void }): T
export function attempt<T>(fn: () => T, options?: { fallback?: T; onError?: (error: unknown) => void }): T | undefined

export function attempt<T>(fn: () => T, options?: { fallback?: T; onError?: (error: unknown) => void }): T | undefined {
	try {
		return fn()
	} catch (error) {
		options?.onError?.(error)
		return options?.fallback
	}
}

/**
 * Checks if a value exists in an array using `Array.prototype.includes`.
 *
 * @example
 * ```ts
 * type RGB = 'red' | 'green' | 'blue'
 * let color: RGB | undefined
 * isIn(color, ['green', 'blue']) // ✅ array elements autocomplete
 * isIn(color, ['invalid']) // ❌ Type error
 * ```
 */
export const isIn = <T, U extends T>(x: T, array: U[]) => array.includes(x as U)

/**
 * Creates the cartesian product of two string arrays
 *
 * @example
 * ```ts
 * const y = ['top', 'bottom'] as const
 * const x = ['left', 'right'] as const
 * const corners = joinTyped(y, x, '-')
 * type Corner = (typeof corners)[number]
 * // readonly ("top-left" | "top-right" | "bottom-left" | "bottom-right")[]
 * ```
 */
export const joinTyped = <const A extends readonly string[], const B extends readonly string[], const D extends string>(
	a: A,
	b: B,
	delimiter: D,
): `${A[number]}${D}${B[number]}`[] => a.flatMap((x) => b.map((y) => `${x}${delimiter}${y}` as const))
