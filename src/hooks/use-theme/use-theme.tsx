/**
 * Based on next-themes by Paco Coursey
 * @see https://github.com/pacocoursey/next-themes
 * @license MIT - Copyright (c) 2022 Paco Coursey
 */

'use client'

import { daisyThemeNames, noop } from '@/utils'
import { useLocalStorage, useMediaQuery, useWindowEvent } from '@mantine/hooks'
import { createContext, memo, use, useEffect, useMemo } from 'react'
import { script } from './script'
import type { Attribute, ThemeProviderProps, UseThemeProps } from './types'

export type * from './types'

const colorSchemes = ['light', 'dark']
const MEDIA = '(prefers-color-scheme: dark)'
const SYSTEM_THEME = 'system'

const ThemeContext = createContext<UseThemeProps<any> | undefined>(undefined)
const defaultContext: UseThemeProps<any> = {
	setTheme: noop,
	themes: [],
	defaultLight: 'light',
	defaultDark: 'dark',
}

const disableAnimation = (nonce?: string) => {
	const css = document.createElement('style')
	if (nonce) css.setAttribute('nonce', nonce)
	css.appendChild(
		document.createTextNode(
			`*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}`,
		),
	)
	document.head.appendChild(css)

	return () => {
		// Force restyle
		;(() => window.getComputedStyle(document.body))()

		// Wait for next tick before removing
		setTimeout(() => {
			document.head.removeChild(css)
		}, 1)
	}
}

export const useTheme = <TThemes extends readonly string[] = never>() =>
	(use(ThemeContext) as UseThemeProps<TThemes>) ?? defaultContext

export const ThemeScript = memo(
	({
		forcedTheme,
		storageKey,
		attribute,
		enableSystem,
		enableColorScheme,
		defaultTheme,
		value,
		themes,
		nonce,
		scriptProps,
	}: Omit<ThemeProviderProps<any>, 'children'> & { defaultTheme: string }) => {
		const config = {
			attribute,
			storageKey,
			defaultTheme,
			forcedTheme,
			themes,
			value,
			enableSystem,
			enableColorScheme,
		}

		return (
			<script
				{...scriptProps}
				suppressHydrationWarning
				nonce={typeof window === 'undefined' ? nonce : ''}
				dangerouslySetInnerHTML={{ __html: `(${script.toString()})(${JSON.stringify(config)})` }}
			/>
		)
	},
)

const Theme = <TThemes extends readonly string[] = never>({
	forcedTheme,
	disableTransitionOnChange = false,
	enableSystem = true,
	enableColorScheme = true,
	storageKey = 'theme',
	themes = daisyThemeNames as unknown as TThemes,
	defaultTheme = enableSystem ? SYSTEM_THEME : 'dark',
	attribute = 'data-theme',
	value,
	children,
	nonce,
	scriptProps,
	defaultLight = 'light' as string,
	defaultDark = 'dark' as string,
}: ThemeProviderProps<TThemes>) => {
	const [theme, setThemeState] = useLocalStorage({
		key: storageKey,
		defaultValue: defaultTheme,
		getInitialValueInEffect: false,
	})
	const prefersDark = useMediaQuery(MEDIA, false, { getInitialValueInEffect: false })
	const systemTheme = prefersDark ? 'dark' : 'light'

	const resolvedTheme = theme === SYSTEM_THEME ? systemTheme : theme
	const attrs = !value ? themes : Object.values(value)

	// eslint-disable-next-line react-hooks/exhaustive-deps -- React Compiler handles memoization
	const applyTheme = (themeToApply: string) => {
		let resolved = themeToApply
		if (!resolved) return

		if (themeToApply === SYSTEM_THEME && enableSystem) resolved = systemTheme

		const name = value ? value[resolved] : resolved
		const enable = disableTransitionOnChange ? disableAnimation(nonce) : null
		const d = document.documentElement

		const handleAttribute = (attr: Attribute) => {
			if (attr === 'class') {
				d.classList.remove(...attrs)
				if (name) d.classList.add(name)
				return
			}

			if (!attr.startsWith('data-')) return

			if (name) d.setAttribute(attr, name)
			else d.removeAttribute(attr)
		}

		if (Array.isArray(attribute)) attribute.forEach(handleAttribute)
		else handleAttribute(attribute)

		if (enableColorScheme) {
			const isColorScheme = (val: string): val is 'dark' | 'light' => colorSchemes.includes(val)
			const fallback = isColorScheme(defaultTheme) ? defaultTheme : null
			const colorScheme = isColorScheme(resolved) ? resolved : fallback
			d.style.colorScheme = colorScheme ?? ''
		}

		enable?.()
	}

	// eslint-disable-next-line react-hooks/exhaustive-deps -- React Compiler handles memoization
	const setTheme = (newTheme: ((prevTheme: string) => string) | string) => setThemeState(newTheme)

	useEffect(() => {
		if (theme === SYSTEM_THEME && enableSystem && !forcedTheme) applyTheme(SYSTEM_THEME)
	}, [systemTheme, theme, forcedTheme, applyTheme, enableSystem])

	useWindowEvent('storage', (e) => {
		if (e.key !== storageKey) return
		if (!e.newValue) setTheme(defaultTheme)
		else {
			try {
				const parsed = JSON.parse(e.newValue)
				setThemeState(parsed)
			} catch {
				setThemeState(e.newValue)
			}
		}
	})

	useEffect(() => {
		applyTheme(forcedTheme ?? (theme || ''))
	}, [forcedTheme, theme, applyTheme])

	const providerValue = useMemo(
		() =>
			({
				theme,
				setTheme,
				forcedTheme,
				resolvedTheme: theme === SYSTEM_THEME ? resolvedTheme : theme,
				themes: enableSystem ? ([SYSTEM_THEME, ...themes] as const) : themes,
				systemTheme: (enableSystem ? resolvedTheme : undefined) as 'dark' | 'light' | undefined,
				defaultLight,
				defaultDark,
			}) as UseThemeProps<TThemes>,
		[theme, setTheme, forcedTheme, resolvedTheme, enableSystem, themes, defaultLight, defaultDark],
	)

	return (
		<ThemeContext value={providerValue}>
			<ThemeScript
				{...{
					forcedTheme,
					storageKey,
					attribute,
					enableSystem,
					enableColorScheme,
					defaultTheme,
					value,
					themes,
					nonce,
					scriptProps,
				}}
			/>

			{children}
		</ThemeContext>
	)
}

export const ThemeProvider = <TThemes extends readonly string[] = never>({
	children,
	...props
}: ThemeProviderProps<TThemes>) => {
	const context = use(ThemeContext)
	if (context) return <>{children}</>
	return <Theme<TThemes> {...props}>{children}</Theme>
}
