import type { DemoMeta } from '@demo'
import { renderToStaticMarkup } from 'react-dom/server'
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

import { SearchableGrid } from './SearchableGrid'

export const meta: DemoMeta = { title: 'React Icons', category: 'search' }

const iconSample = (Icon: IconType) => <Icon className='text-2xl' />

const iconFamilies = {
	ai: { label: 'Ant Design', pack: AiIcons, sample: iconSample(AiIcons.AiOutlineSearch) },
	bi: { label: 'BoxIcons', pack: BiIcons, sample: iconSample(BiIcons.BiSearch) },
	bs: { label: 'Bootstrap Icons', pack: BsIcons, sample: iconSample(BsIcons.BsSearch) },
	cg: { label: 'css.gg', pack: CgIcons, sample: iconSample(CgIcons.CgSearch) },
	ci: { label: 'Circum Icons', pack: CiIcons, sample: iconSample(CiIcons.CiSearch) },
	di: { label: 'Devicons', pack: DiIcons, sample: iconSample(DiIcons.DiReact) },
	fa: { label: 'Font Awesome 5', pack: FaIcons, sample: iconSample(FaIcons.FaSearch) },
	fa6: { label: 'Font Awesome 6', pack: Fa6Icons, sample: iconSample(Fa6Icons.FaMagnifyingGlass) },
	fc: { label: 'Flat Color Icons', pack: FcIcons, sample: iconSample(FcIcons.FcSearch) },
	fi: { label: 'Feather', pack: FiIcons, sample: iconSample(FiIcons.FiSearch) },
	gi: { label: 'Game Icons', pack: GiIcons, sample: iconSample(GiIcons.GiMagnifyingGlass) },
	go: { label: 'Github Octicons', pack: GoIcons, sample: iconSample(GoIcons.GoSearch) },
	gr: { label: 'Grommet', pack: GrIcons, sample: iconSample(GrIcons.GrSearch) },
	hi: { label: 'Heroicons v1', pack: HiIcons, sample: iconSample(HiIcons.HiSearch) },
	hi2: { label: 'Heroicons v2', pack: Hi2Icons, sample: iconSample(Hi2Icons.HiMagnifyingGlass) },
	im: { label: 'IcoMoon Free', pack: ImIcons, sample: iconSample(ImIcons.ImSearch) },
	io: { label: 'Ionicons 4', pack: IoIcons, sample: iconSample(IoIcons.IoIosSearch) },
	io5: { label: 'Ionicons 5', pack: Io5Icons, sample: iconSample(Io5Icons.IoSearch) },
	lia: { label: 'Line Awesome', pack: LiaIcons, sample: iconSample(LiaIcons.LiaSearchSolid) },
	lu: { label: 'Lucide', pack: LuIcons, sample: iconSample(LuIcons.LuSearch) },
	md: { label: 'Material Design', pack: MdIcons, sample: iconSample(MdIcons.MdSearch) },
	pi: { label: 'Phosphor', pack: PiIcons, sample: iconSample(PiIcons.PiMagnifyingGlass) },
	ri: { label: 'Remix', pack: RiIcons, sample: iconSample(RiIcons.RiSearch2Fill) },
	rx: { label: 'Radix Icons', pack: RxIcons, sample: iconSample(RxIcons.RxMagnifyingGlass) },
	si: { label: 'Simple Icons', pack: SiIcons, sample: iconSample(SiIcons.SiReact) },
	sl: { label: 'Simple Line', pack: SlIcons, sample: iconSample(SlIcons.SlMagnifier) },
	tb: { label: 'Tabler', pack: TbIcons, sample: iconSample(TbIcons.TbSearch) },
	tfi: { label: 'Themify', pack: TfiIcons, sample: iconSample(TfiIcons.TfiSearch) },
	ti: { label: 'Typicons', pack: TiIcons, sample: iconSample(TiIcons.TiCogOutline) },
	vsc: { label: 'VSCode Codicons', pack: VscIcons, sample: iconSample(VscIcons.VscSearch) },
	wi: { label: 'Weather Icons', pack: WiIcons, sample: iconSample(WiIcons.WiAlien) },
} as const

type Prefix = keyof typeof iconFamilies

type IconItem = {
	id: string
	label: string
	family: Prefix
	Icon: IconType
}

const flattenPack = (family: Prefix, pack: Record<string, IconType>): IconItem[] =>
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

type CopyKey = 'jsx' | 'name' | 'svg'

const copyKeys: CopyKey[] = ['jsx', 'name', 'svg']

export function Demo() {
	return (
		<SearchableGrid<IconItem, Prefix, CopyKey>
			items={flatIcons}
			families={iconFamilies}
			getSearchText={(icon) => `${icon.id} ${icon.label}`}
			getFamily={(icon) => icon.family}
			placeholder='Search React Icons...'
			copyKeys={copyKeys}
			getCopyValue={(icon, key) => {
				switch (key) {
					case 'jsx':
						return `<${icon.id} />`

					case 'name':
						return icon.id

					case 'svg':
						return renderToStaticMarkup(<icon.Icon />)
				}
			}}
			getItemId={(icon) => `${icon.family}-${icon.id}`}
			renderItem={(icon) => (
				<>
					<icon.Icon className='text-5xl' />
					<div className='text-xs truncate font-mono'>{icon.id}</div>
					<div className='text-base-content/50 font-mono'>{icon.family}</div>
				</>
			)}
			renderCopiedOverlay={(icon, copiedKey) => (
				<span className='font-mono'>
					{copiedKey === 'jsx' ? `<${icon.id} />` : copiedKey === 'name' ? icon.id : 'SVG'}
				</span>
			)}
			settingsIcon={<FaIcons.FaCog />}
			debounceMs={250}
		/>
	)
}
