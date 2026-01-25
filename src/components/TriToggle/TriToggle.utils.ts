import type { TriToggleValue } from './TriToggle'

/**
 * Serializes a TriToggle value to a string for form submission.
 *
 * @param value - The TriToggle value (true, false, null, or undefined)
 * @returns A string representation: "true", "false", or "null"
 *
 * @example
 * serializeTriToggleValue(true) // "true"
 * serializeTriToggleValue(false) // "false"
 * serializeTriToggleValue(null) // "null"
 * serializeTriToggleValue(undefined) // "null"
 */
export function serializeTriToggleValue(value: TriToggleValue): string {
	if (value === true) return 'true'
	if (value === false) return 'false'
	return 'null'
}

/**
 * Parses a serialized TriToggle value back to its proper type.
 *
 * @param value - The serialized value from FormData (string, null, or FormDataEntryValue)
 * @returns The parsed boolean or null value
 *
 * @example
 * parseTriToggleValue('true') // true
 * parseTriToggleValue('false') // false
 * parseTriToggleValue('null') // null
 * parseTriToggleValue(null) // null
 */
export function parseTriToggleValue(value: string | FormDataEntryValue | null): boolean | null {
	if (value === 'true') return true
	if (value === 'false') return false
	return null
}
