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
	<const TAllowed extends readonly unknown[]>(allowed: TAllowed) =>
	(x: unknown): x is TAllowed[number] =>
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
export const makeDiscriminatedGuard = <TProp extends string, const TAllowed extends readonly string[]>(
	prop: TProp,
	allowed: TAllowed,
) => {
	const set = new Set<string>(allowed as readonly string[])
	return <TRecord extends Record<TProp, string>>(x: TRecord): x is Extract<TRecord, Record<TProp, TAllowed[number]>> =>
		set.has(x[prop])
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
export function attempt<TResult>(
	fn: () => TResult,
	options: { fallback: TResult; onError?: (error: unknown) => void },
): TResult
export function attempt<TResult>(
	fn: () => TResult,
	options?: { fallback?: TResult; onError?: (error: unknown) => void },
): TResult | undefined

export function attempt<TResult>(
	fn: () => TResult,
	options?: { fallback?: TResult; onError?: (error: unknown) => void },
): TResult | undefined {
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
export const isIn = <TValue, TElement extends TValue>(x: TValue, array: TElement[]) => array.includes(x as TElement)

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
export const joinTyped = <
	const TFirst extends readonly string[],
	const TSecond extends readonly string[],
	const TDelimiter extends string,
>(
	a: TFirst,
	b: TSecond,
	delimiter: TDelimiter,
): `${TFirst[number]}${TDelimiter}${TSecond[number]}`[] =>
	a.flatMap((x) => b.map((y) => `${x}${delimiter}${y}` as const))

/**
 * Maps a nullable optional boolean to one of three values.
 *
 * @example
 * ```ts
 * boolMap(value, ['Yes', 'No', 'Not Sure'])
 * boolMap(isEnabled, ['On', 'Off', 'Default'])
 * ```
 */
export const boolMap = <TResult>(
	value: boolean | null | undefined,
	[onTrue, onFalse, onNullOrUndefined]: [TResult, TResult, TResult],
) => (value === true ? onTrue : value === false ? onFalse : onNullOrUndefined)

/** A stable empty object. Useful as a default for optional object props to avoid re-renders. */
export const EMPTY_OBJ = {} as const

/** A no-op function that does nothing. Useful for default callbacks and placeholders. */
export const noop = () => undefined

/** Returns a Promise that resolves after the specified number of milliseconds. */
export const wait = (ms: number) =>
	new Promise<void>((resolve) => {
		setTimeout(resolve, ms)
	})
