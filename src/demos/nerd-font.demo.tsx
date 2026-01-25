import glyphs from '@/data/glyphnames.json'
import type { DemoMeta } from '@demo/utils'
import * as R from 'remeda'

import { SearchableGrid } from './SearchableGrid'

export const meta: DemoMeta = { title: 'Nerd Font Glyphs', category: 'search' }

const nfClass = "font-['FiraCode_NF']"
const nfSample = (char: string) => <span className={`text-2xl ${nfClass}`}>{char}</span>

const glyphFamilies = {
	'cod-': { label: 'Codicons (VS Code)', sample: nfSample('') },
	'custom-': { label: 'Custom Icons', sample: nfSample('') },
	'dev-': { label: 'Devicons', sample: nfSample('') },
	'extra-': { label: 'Extra Icons', sample: nfSample('󰑾') },
	'fa-': { label: 'Font Awesome', sample: nfSample('') },
	'fae-': { label: 'Font Awesome Extension', sample: nfSample('') },
	'iec-': { label: 'IEC Power Symbols', sample: nfSample('⏻') },
	'indent-': { label: 'Indent Icons', sample: nfSample('') },
	'indentation-': { label: 'Indentation Icons', sample: nfSample('') },
	'linux-': { label: 'Linux Distros', sample: nfSample('') },
	'md-': { label: 'Material Design', sample: nfSample('󰇉') },
	'oct-': { label: 'Octicons (GitHub)', sample: nfSample('') },
	'pl-': { label: 'Powerline', sample: nfSample('') },
	'ple-': { label: 'Powerline Extra', sample: nfSample('') },
	'pom-': { label: 'Pomicons', sample: nfSample('') },
	'seti-': { label: 'Seti UI', sample: nfSample('') },
	'weather-': { label: 'Weather', sample: nfSample('') },
} as const

type Prefix = keyof typeof glyphFamilies

type GlyphItem = {
	char: string
	id: string
	code: string
}

type CopyKey = keyof GlyphItem

const flatGlyphs: GlyphItem[] = R.pipe(
	glyphs,
	R.entries(),
	R.map(([id, { char, code }]) => ({ char, id, code })),
)

const copyKeys: CopyKey[] = ['char', 'id', 'code']

const getFamily = (item: GlyphItem): Prefix | undefined =>
	R.keys(glyphFamilies).find((prefix) => item.id.startsWith(prefix))

export function Demo() {
	return (
		<SearchableGrid<GlyphItem, Prefix, CopyKey>
			items={flatGlyphs}
			families={glyphFamilies}
			getSearchText={(item) => `${item.id} ${item.code}`}
			getFamily={getFamily}
			placeholder='Search Nerd Font glyphs...'
			copyKeys={copyKeys}
			getCopyValue={(item, key) => item[key]}
			getItemId={(item) => item.id}
			className={nfClass}
			renderItem={(item) => (
				<>
					<div className='text-5xl font-normal'>{item.char}</div>
					<div className='text-xs truncate font-mono' title={item.id}>
						{item.id}
					</div>
					<div className='text-2xs text-base-content/50 font-mono'>{item.code}</div>
				</>
			)}
			renderCopiedOverlay={(item, copiedKey) => (
				<span className={copiedKey === 'char' ? 'text-5xl font-normal' : ''}>{item[copiedKey]}</span>
			)}
			settingsIcon={<span className={`text-lg ${nfClass}`}></span>}
		/>
	)
}
