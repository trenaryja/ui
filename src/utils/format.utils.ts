export type FormatNumberOptions = Intl.NumberFormatOptions & {
	/** Returned when the input is null, undefined, or non-finite. Defaults to '—'. */
	fallback?: string
	/** 'parens' wraps negative values like accounting style: -12.3% → (12.3%). */
	negativeStyle?: 'minus' | 'parens'
	/** Shorthand for setting both minimumFractionDigits and maximumFractionDigits. */
	decimals?: number
}

export type FormatPercentOptions = FormatNumberOptions & {
	/** 'fraction' (default): 0.5 → 50%. 'whole': 50 → 50%. */
	inputMode?: 'fraction' | 'whole'
}

export type FormatCurrencyOptions = FormatNumberOptions & {
	/** ISO 4217 currency code. Defaults to 'USD'. */
	currency?: string
}

const formatWithIntl = (
	value: number | null | undefined,
	intl: Intl.NumberFormatOptions,
	options: FormatNumberOptions = {},
) => {
	const {
		fallback = '—',
		negativeStyle = 'minus',
		decimals,
		minimumFractionDigits = decimals,
		maximumFractionDigits = decimals,
		...rest
	} = options

	if (value == null || !Number.isFinite(value)) return fallback

	const formatter = new Intl.NumberFormat(undefined, {
		...intl,
		minimumFractionDigits,
		maximumFractionDigits,
		...rest,
	})

	if (value >= 0 || negativeStyle === 'minus') return formatter.format(value)
	return `(${formatter
		.formatToParts(Math.abs(value))
		.map((p) => p.value)
		.join('')})`
}

export const formatPercent = (value?: number | null, options?: FormatPercentOptions) => {
	const scaled = value == null || options?.inputMode !== 'whole' ? value : value / 100
	return formatWithIntl(scaled, { style: 'percent' }, options)
}

export const formatCurrency = (value?: number | null, options?: FormatCurrencyOptions) =>
	formatWithIntl(value, { style: 'currency', currency: options?.currency ?? 'USD' }, options)
