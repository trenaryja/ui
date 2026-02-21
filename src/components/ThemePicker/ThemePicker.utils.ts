import type { ThemeName } from '@/hooks'

/**
 * Smart toggle logic for 2-way theme switching
 * Handles system theme resolution intelligently
 *
 * @param options - Toggle options
 * @returns The next theme to switch to
 */
export const getNextToggleTheme = <T extends readonly string[]>(options: {
	currentTheme: ThemeName<T> | undefined
	systemTheme: 'dark' | 'light' | undefined
	defaultLight: ThemeName<T>
	defaultDark: ThemeName<T>
}): ThemeName<T> => {
	const { currentTheme, systemTheme, defaultLight, defaultDark } = options

	// If current is system, toggle to opposite of system preference
	if (currentTheme === 'system' && systemTheme) return systemTheme === 'dark' ? defaultLight : defaultDark

	// If current is light-ish, go to dark
	if (currentTheme === defaultLight || currentTheme === 'light') return defaultDark

	// If current is dark-ish, go to light
	if (currentTheme === defaultDark || currentTheme === 'dark') return defaultLight

	// For any other theme, toggle based on system preference
	return systemTheme === 'dark' ? defaultLight : defaultDark
}

/**
 * Resolve theme to light/dark for icon display
 *
 * @param theme - The current theme value
 * @param systemTheme - The resolved system preference
 * @returns 'light', 'dark', or 'system'
 */
export const resolveThemeMode = (
	theme: string | undefined,
	systemTheme: 'dark' | 'light' | undefined,
): 'dark' | 'light' | 'system' => {
	if (theme === 'system') return 'system'
	if (!theme || !systemTheme) return 'system'

	// Check if it's a known light/dark value
	if (theme === 'light' || theme === 'dark') return theme

	// Default to system for custom themes
	return 'system'
}

/**
 * Filter themes by search query
 *
 * @param themes - Array of theme names to filter
 * @param query - Search query string
 * @returns Filtered array of theme names
 */
export const filterThemes = (themes: readonly string[], query: string): readonly string[] => {
	const normalized = query.trim().toLowerCase()
	if (!normalized) return themes
	return themes.filter((theme) => theme.toLowerCase().includes(normalized))
}
