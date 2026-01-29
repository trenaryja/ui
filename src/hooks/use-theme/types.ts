import type { DaisyThemeName } from '@/utils'
import type { Dispatch, PropsWithChildren, ScriptHTMLAttributes, SetStateAction } from 'react'
import type { LiteralUnion } from 'type-fest'

type DataAttribute = `data-${string}`

type ScriptProps = Record<DataAttribute, unknown> & ScriptHTMLAttributes<HTMLScriptElement>

export type ThemeName<TCustomThemes extends readonly string[] = never> = LiteralUnion<
	'system' | DaisyThemeName | TCustomThemes[number],
	string
>

export type UseThemeProps<TThemes extends readonly string[] = never> = {
	/** List of all available theme names */
	themes: readonly string[]
	/** Forced theme name for the current page */
	forcedTheme?: ThemeName<TThemes> | undefined
	/** Update the theme */
	setTheme: Dispatch<SetStateAction<ThemeName<TThemes>>>
	/** Active theme name */
	theme?: ThemeName<TThemes> | undefined
	/** If `enableSystem` is true and the active theme is "system", this returns whether the system preference resolved to "dark" or "light". Otherwise, identical to `theme` */
	resolvedTheme?: ThemeName<TThemes> | undefined
	/** If enableSystem is true, returns the System theme preference ("dark" or "light"), regardless what the active theme is */
	systemTheme?: 'dark' | 'light' | undefined
	/** Default light theme to use when toggling (defaults to 'light') */
	defaultLight: ThemeName<TThemes>
	/** Default dark theme to use when toggling (defaults to 'dark') */
	defaultDark: ThemeName<TThemes>
}

export type Attribute = 'class' | DataAttribute

export type ThemeProviderProps<TThemes extends readonly string[] = never> = PropsWithChildren<{
	/** List of theme names to use (defaults to all DaisyUI themes). Pass a readonly array for full type inference. */
	themes?: TThemes | undefined
	/** Forced theme name for the current page */
	forcedTheme?: ThemeName<TThemes> | undefined
	/** Whether to switch between dark and light themes based on prefers-color-scheme */
	enableSystem?: boolean | undefined
	/** Disable all CSS transitions when switching themes */
	disableTransitionOnChange?: boolean | undefined
	/** Whether to indicate to browsers which color scheme is used (dark or light) for built-in UI like inputs and buttons */
	enableColorScheme?: boolean | undefined
	/** Key used to store theme setting in localStorage */
	storageKey?: string | undefined
	/** Default theme name (defaults to 'system' if enableSystem is true, otherwise 'dark') */
	defaultTheme?: ThemeName<TThemes> | undefined
	/** HTML attribute modified based on the active theme. Accepts `class`, `data-*` (meaning any data attribute, `data-mode`, `data-color`, etc.), or an array which could include both */
	attribute?: Attribute | Attribute[] | undefined
	/** Mapping of theme name to HTML attribute value. Object where key is the theme name and value is the attribute value */
	value?: Record<string, string> | undefined
	/** Nonce string to pass to the inline script and style elements for CSP headers */
	nonce?: string
	/** Props to pass the inline script */
	scriptProps?: ScriptProps
	/** Default light theme to use when toggling (defaults to 'light') */
	defaultLight?: ThemeName<TThemes> | undefined
	/** Default dark theme to use when toggling (defaults to 'dark') */
	defaultDark?: ThemeName<TThemes> | undefined
}>
