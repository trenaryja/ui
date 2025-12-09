import { BalancedGrid } from '@/components'
import { useDebouncedCycle } from '@/hooks'
import { cn } from '@/utils'
import { useClipboard, useDebouncedValue } from '@mantine/hooks'
import type { Meta, StoryObj } from '@storybook/react-vite'
import Fuse from 'fuse.js'
import { useMemo, useState } from 'react'
import * as R from 'remeda'
import glyphs from '../src/data/glyphnames.json'

const meta = { title: 'Search/Nerd Font Glyphs' } satisfies Meta
export default meta

export type GlyphFamily = {
	label: string
	char: string
}

const glyphFamilies: Record<string, GlyphFamily> = {
	'cod-': { label: 'Codicons (VS Code)', char: '' },
	'custom-': { label: 'Custom Icons', char: '' },
	'dev-': { label: 'Devicons', char: '' },
	'extra-': { label: 'Extra Icons', char: '󰑾' },
	'fa-': { label: 'Font Awesome', char: '' },
	'fae-': { label: 'Font Awesome Extension', char: '' },
	'iec-': { label: 'IEC Power Symbols', char: '⏻' },
	'indent-': { label: 'Indent Icons', char: '' },
	'indentation-': { label: 'Indentation Icons', char: '' },
	'linux-': { label: 'Linux Distros', char: '' },
	'md-': { label: 'Material Design', char: '' },
	'oct-': { label: 'Octicons (GitHub)', char: '' },
	'pl-': { label: 'Powerline', char: '' },
	'ple-': { label: 'Powerline Extra', char: '' },
	'pom-': { label: 'Pomicons', char: '' },
	'seti-': { label: 'Seti UI', char: '' },
	'weather-': { label: 'Weather', char: '' },
} as const

type Prefix = keyof typeof glyphFamilies

const raw = glyphs as Record<string, { char: string; code: string }>
const flatGlyphs = Object.entries(raw).map(([id, { char, code }]) => ({ char, id, code }))
const glyphProperties = ['char', 'id', 'code'] as const satisfies (keyof (typeof flatGlyphs)[number])[]
const clipboardTimeout = 1000

export const NerdFontGlyphs: StoryObj = {
	render: () => {
		const [query, setQuery] = useState('')
		const [debouncedQuery] = useDebouncedValue(query, 200)
		const cycle = useDebouncedCycle([...glyphProperties], clipboardTimeout + 50)
		const clipboard = useClipboard({ timeout: clipboardTimeout })
		const [lastCopiedId, setLastCopiedId] = useState<string | null>(null)
		const [activeFamilies, setActiveFamilies] = useState<Prefix[]>([])

		const searchableSet = activeFamilies.length
			? flatGlyphs.filter((x) => activeFamilies.some((prefix) => x.id.startsWith(prefix)))
			: flatGlyphs

		const fuse = useMemo(() => new Fuse(searchableSet, { keys: glyphProperties, threshold: 0.3 }), [searchableSet])

		const results = debouncedQuery.trim()
			? fuse.search(debouncedQuery).map((r) => r.item)
			: [...searchableSet].slice(0, 300)

		const togglePrefix = (prefix: Prefix) => {
			setActiveFamilies((prev) => (prev.includes(prefix) ? prev.filter((p) => p !== prefix) : [...prev, prefix]))
		}

		const clearPrefixes = () => setActiveFamilies([])

		const handleClick = (glyph: (typeof flatGlyphs)[number]) => {
			const key = cycle.value
			clipboard.copy(glyph[key])
			setLastCopiedId(glyph.id)
			cycle.increment()
		}

		return (
			<div className='full-bleed grid content-start gap-4 p-4' style={{ fontFamily: 'FiraCode NF' }}>
				<input
					className='input w-full '
					type='text'
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder='Search Nerd Font glyphs...'
				/>

				<div className='flex items-center justify-between'>
					<p className='text-sm text-base-content/50'>
						Showing {results.length} {debouncedQuery ? 'matches' : `glyphs. There are ${searchableSet.length} total.`}
					</p>

					<div className='dropdown dropdown-end'>
						<button className='btn btn-ghost btn-square btn-sm relative' tabIndex={0} type='button'>
							<span className='text-lg'></span>
							<p
								className={cn('absolute size-2 rounded-full bg-primary top-0 right-0 invisible', {
									visible: activeFamilies.length,
								})}
							/>
						</button>

						<div
							className='dropdown-content w-screen p-4 grid gap-4 shadow bg-base-300/90 backdrop-blur border border-current/5 rounded-box max-w-[calc(100vw-4rem)]  '
							tabIndex={0}
						>
							<button className='btn btn-outline' type='button' onClick={clearPrefixes}>
								Clear
							</button>
							<BalancedGrid pack className='gap-2' maxCols={3}>
								{R.entries(glyphFamilies).map(([prefix, fam]) => (
									<button
										key={prefix}
										type='button'
										onClick={() => togglePrefix(prefix)}
										className={cn(
											'btn btn-sm flex flex-col items-center gap-1 h-auto py-2',
											activeFamilies.includes(prefix) ? 'btn-primary' : 'btn-outline',
										)}
									>
										<div className='text-2xl'>{fam.char}</div>
										<div className='text-2xs font-mono truncate w-full'>{fam.label}</div>
									</button>
								))}
							</BalancedGrid>
						</div>
					</div>
				</div>

				<div className={cn('grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 ')}>
					{results.map((glyph) => (
						<button
							className='btn relative grid place-items-center h-max p-4 overflow-x-auto'
							key={glyph.id}
							type='button'
							onClick={() => handleClick(glyph)}
						>
							<div className='text-5xl font-normal'>{glyph.char}</div>
							<div className='text-xs truncate font-mono' title={glyph.id}>
								{glyph.id}
							</div>
							<div className='text-2xs text-base-content/50 font-mono'>{glyph.code}</div>
							{clipboard.copied && lastCopiedId === glyph.id && (
								<span className='absolute inset-0 grid place-items-center backdrop-blur-2xl'>
									<span className={cn({ 'text-5xl font-normal': cycle.prev === 'char' })}>{glyph[cycle.prev]}</span>
									<span className='text-sm'>Copied</span>
								</span>
							)}
						</button>
					))}
				</div>
			</div>
		)
	},
}
