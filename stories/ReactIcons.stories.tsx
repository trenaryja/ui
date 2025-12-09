import { BalancedGrid } from '@/components'
import { useDebouncedCycle } from '@/hooks'
import { cn } from '@/utils'
import { useClipboard, useDebouncedValue } from '@mantine/hooks'
import type { Meta, StoryObj } from '@storybook/react-vite'
import Fuse from 'fuse.js'
import { useMemo, useState } from 'react'
import type { IconType } from 'react-icons/lib'
import * as R from 'remeda'

import * as AiIcons from 'react-icons/ai'
import * as BiIcons from 'react-icons/bi'
import * as BsIcons from 'react-icons/bs'
import * as CgIcons from 'react-icons/cg'
import * as CiIcons from 'react-icons/ci'
import * as DiIcons from 'react-icons/di'
import * as FaIcons from 'react-icons/fa'
import * as Fa6Icons from 'react-icons/fa6'
import * as FcIcons from 'react-icons/fc'
import * as FiIcons from 'react-icons/fi'
import * as GiIcons from 'react-icons/gi'
import * as GoIcons from 'react-icons/go'
import * as GrIcons from 'react-icons/gr'
import * as HiIcons from 'react-icons/hi'
import * as Hi2Icons from 'react-icons/hi2'
import * as ImIcons from 'react-icons/im'
import * as IoIcons from 'react-icons/io'
import * as Io5Icons from 'react-icons/io5'
import * as LiaIcons from 'react-icons/lia'
import * as LuIcons from 'react-icons/lu'
import * as MdIcons from 'react-icons/md'
import * as PiIcons from 'react-icons/pi'
import * as RiIcons from 'react-icons/ri'
import * as RxIcons from 'react-icons/rx'
import * as SiIcons from 'react-icons/si'
import * as SlIcons from 'react-icons/sl'
import * as TbIcons from 'react-icons/tb'
import * as TfiIcons from 'react-icons/tfi'
import * as TiIcons from 'react-icons/ti'
import * as VscIcons from 'react-icons/vsc'
import * as WiIcons from 'react-icons/wi'

const meta = { title: 'Search/React Icons' } satisfies Meta
export default meta

const iconFamilies = {
	ai: { label: 'Ant Design', pack: AiIcons },
	bi: { label: 'BoxIcons', pack: BiIcons },
	bs: { label: 'Bootstrap Icons', pack: BsIcons },
	cg: { label: 'css.gg', pack: CgIcons },
	ci: { label: 'Circum Icons', pack: CiIcons },
	di: { label: 'Devicons', pack: DiIcons },
	fa: { label: 'Font Awesome 5', pack: FaIcons },
	fa6: { label: 'Font Awesome 6', pack: Fa6Icons },
	fc: { label: 'Flat Color Icons', pack: FcIcons },
	fi: { label: 'Feather', pack: FiIcons },
	gi: { label: 'Game Icons', pack: GiIcons },
	go: { label: 'Github Octicons', pack: GoIcons },
	gr: { label: 'Grommet', pack: GrIcons },
	hi: { label: 'Heroicons v1', pack: HiIcons },
	hi2: { label: 'Heroicons v2', pack: Hi2Icons },
	im: { label: 'IcoMoon Free', pack: ImIcons },
	io: { label: 'Ionicons 4', pack: IoIcons },
	io5: { label: 'Ionicons 5', pack: Io5Icons },
	lia: { label: 'Line Awesome', pack: LiaIcons },
	lu: { label: 'Lucide', pack: LuIcons },
	md: { label: 'Material Design', pack: MdIcons },
	pi: { label: 'Phosphor', pack: PiIcons },
	ri: { label: 'Remix', pack: RiIcons },
	rx: { label: 'Radix Icons', pack: RxIcons },
	si: { label: 'Simple Icons', pack: SiIcons },
	sl: { label: 'Simple Line', pack: SlIcons },
	tb: { label: 'Tabler', pack: TbIcons },
	tfi: { label: 'Themify', pack: TfiIcons },
	ti: { label: 'Typicons', pack: TiIcons },
	vsc: { label: 'VSCode Codicons', pack: VscIcons },
	wi: { label: 'Weather Icons', pack: WiIcons },
} as const

type Prefix = keyof typeof iconFamilies

const flattenPack = (family: Prefix, pack: Record<string, IconType>) =>
	Object.entries(pack).map(([id, Icon]) => ({
		id,
		label: id
			.replace(/^[A-Z][a-z]{0,2}/, '')
			.replace(/([a-z])([A-Z])/g, '$1 $2')
			.toLowerCase(),
		family,
		Icon,
	}))

const flatIcons = R.flatMap(R.entries(iconFamilies), ([family, { pack }]) => flattenPack(family, pack))
const clipboardTimeout = 1000

export const ReactIcons: StoryObj = {
	render: () => {
		const [query, setQuery] = useState('')
		const [debouncedQuery] = useDebouncedValue(query, 250)
		const cycle = useDebouncedCycle(['jsx', 'name'], clipboardTimeout + 50)
		const clipboard = useClipboard({ timeout: clipboardTimeout })
		const [lastCopiedId, setLastCopiedId] = useState<string | null>(null)
		const [activeFamilies, setActiveFamilies] = useState<Prefix[]>([])

		const searchableSet = activeFamilies.length ? flatIcons.filter((x) => activeFamilies.includes(x.family)) : flatIcons

		const fuse = useMemo(
			() =>
				new Fuse(searchableSet, {
					keys: ['id', 'label'],
					threshold: 0.3,
				}),
			[searchableSet],
		)

		const results = debouncedQuery.trim()
			? fuse
					.search(debouncedQuery)
					.map((r) => r.item)
					.slice(0, 2500)
			: [...searchableSet].slice(0, 300)

		const togglePrefix = (prefix: Prefix) =>
			setActiveFamilies((prev) => (prev.includes(prefix) ? prev.filter((p) => p !== prefix) : [...prev, prefix]))

		const clearPrefixes = () => setActiveFamilies([])

		const handleClick = (icon: (typeof flatIcons)[number]) => {
			const str = cycle.value === 'jsx' ? `<${icon.id} />` : icon.id
			clipboard.copy(str)
			setLastCopiedId(icon.id)
			cycle.increment()
		}

		return (
			<div className='full-bleed grid content-start gap-4 p-4'>
				<input
					className='input w-full '
					type='text'
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder='Search React Icons...'
				/>

				<div className='flex items-center justify-between'>
					<p className='text-sm text-base-content/50'>
						Showing {results.length} {debouncedQuery ? 'matches' : `icons. Total ${searchableSet.length}.`}
					</p>

					<div className='dropdown dropdown-end'>
						<button className='btn btn-ghost btn-square btn-sm relative' tabIndex={0} type='button'>
							<FaIcons.FaCog />
							<span
								className={cn('absolute size-2 rounded-full bg-primary top-0 right-0 invisible', {
									visible: activeFamilies.length,
								})}
							/>
						</button>

						<div
							className='dropdown-content w-screen p-4 grid gap-4 shadow bg-base-300/90 backdrop-blur border border-current/5 rounded-box max-w-[calc(100vw-4rem)]'
							tabIndex={0}
						>
							<button className='btn btn-outline' type='button' onClick={clearPrefixes}>
								Clear
							</button>
							<BalancedGrid pack className='gap-2' maxCols={3}>
								{R.entries(iconFamilies).map(([prefix, { label, pack }]) => {
									const [Sample] = Object.values(pack)
									return (
										<button
											key={prefix}
											type='button'
											onClick={() => togglePrefix(prefix as Prefix)}
											className={cn(
												'btn btn-sm flex flex-col items-center gap-1 h-auto py-2',
												activeFamilies.includes(prefix as Prefix) ? 'btn-primary' : 'btn-outline',
											)}
										>
											<Sample className='text-2xl' />
											<div className='text-2xs font-mono truncate w-full'>{label}</div>
										</button>
									)
								})}
							</BalancedGrid>
						</div>
					</div>
				</div>

				<div className={cn('grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6')}>
					{results.map((icon) => (
						<button
							className='btn relative grid place-items-center h-max p-4 overflow-hidden'
							key={icon.id}
							type='button'
							onClick={() => handleClick(icon)}
						>
							<icon.Icon className='text-5xl' />
							<div className='text-xs truncate font-mono'>{icon.id}</div>
							<div className='text-base-content/50 font-mono'>{icon.family}</div>
							{clipboard.copied && lastCopiedId === icon.id && (
								<span className='absolute inset-0 grid place-items-center backdrop-blur-2xl'>
									<span className='font-mono'>{cycle.prev === 'jsx' ? `<${icon.id} />` : icon.id}</span>
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
