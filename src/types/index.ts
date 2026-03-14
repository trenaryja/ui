/**
 * Creates a classNames prop type for component styling overrides.
 * @example
 * type Props = ClassNames<'container' | 'item'>
 * // Results in: { classNames?: Partial<Record<'container' | 'item', string>> }
 */
export type ClassNames<TSlot extends string> = { classNames?: Partial<Record<TSlot, string>> }
