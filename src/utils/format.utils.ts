export const formatUSD = (value?: number, showCents = false, options?: Intl.NumberFormatOptions) => {
	const formatter = new Intl.NumberFormat(undefined, {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: showCents ? 2 : 0,
		maximumFractionDigits: showCents ? 2 : 0,
		...options,
	})

	return formatter.format(value ?? 0)
}
