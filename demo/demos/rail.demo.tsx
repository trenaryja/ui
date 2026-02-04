import { Fieldset } from '@/components'
import { cn } from '@/utils'
import type { DemoMeta } from '@demo'
import {
	LuHouse,
	LuMail,
	LuPanelLeftClose,
	LuPanelLeftOpen,
	LuPanelRightClose,
	LuPanelRightOpen,
	LuSettings,
	LuUser,
} from 'react-icons/lu'

export const meta: DemoMeta = { title: 'rail', category: 'classes' }

const NavItem = ({
	icon: Icon,
	iconOpen: IconOpen,
	label,
	htmlFor,
	className,
}: {
	icon: React.ComponentType<{ className?: string }>
	iconOpen?: React.ComponentType<{ className?: string }>
	label?: string
	htmlFor?: string
	className?: string
}) => {
	const isToggle = !label && htmlFor
	return (
		<label
			htmlFor={htmlFor}
			className={cn('btn btn-block btn-ghost transition-all justify-start is-rail-close:gap-0', className)}
			tabIndex={0}
		>
			{isToggle && <span className='transition-all is-rail-open:grow' />}
			{IconOpen ? (
				<div className='swap is-rail-open:swap-active'>
					<IconOpen className='swap-on shrink-0' />
					<Icon className='swap-off shrink-0' />
				</div>
			) : (
				<Icon className='shrink-0' />
			)}
			{label && (
				<span className='overflow-hidden whitespace-nowrap transition-all is-rail-close:w-0 is-rail-close:opacity-0'>
					{label}
				</span>
			)}
		</label>
	)
}

const DefaultExample = () => (
	<Fieldset legend='Default'>
		<div className='rail surface p-2 overflow-hidden'>
			<input type='checkbox' className='rail-toggle' id='rail-default' />
			<aside className='surface surface-base-300 grid gap-1 p-1 h-full transition-all duration-300'>
				<NavItem icon={LuPanelLeftOpen} iconOpen={LuPanelLeftClose} htmlFor='rail-default' />
				<NavItem icon={LuHouse} label='Home' />
				<NavItem icon={LuUser} label='Profile' />
				<NavItem icon={LuMail} label='Messages' />
				<NavItem icon={LuSettings} label='Settings' />
			</aside>
			<main className='prose p-4'>
				<p>Click the chevron to toggle the rail.</p>
			</main>
		</div>
	</Fieldset>
)

const ComposabilityExample = () => (
	<Fieldset legend='Composability' className='p-0!'>
		<p className='p-4 pb-0 text-sm opacity-60'>Rail works inside any container, not just full-page layouts.</p>
		<div className='p-4 grid md:grid-cols-2 gap-4'>
			<div className='card bg-base-200 shadow-lg'>
				<div className='card-body p-0'>
					<div className='rail h-64'>
						<input type='checkbox' className='rail-toggle' id='rail-card-1' />
						<aside className='flex flex-col bg-base-300 h-full rounded-l-box'>
							<nav className='flex flex-col gap-1 p-2'>
								<NavItem icon={LuPanelLeftOpen} iconOpen={LuPanelLeftClose} htmlFor='rail-card-1' />
								<NavItem icon={LuHouse} label='Dashboard' />
								<NavItem icon={LuSettings} label='Settings' />
							</nav>
						</aside>
						<main className='flex-1 p-4'>
							<h3 className='font-semibold'>Card with Rail</h3>
							<p className='text-sm opacity-60 mt-2'>This rail is scoped to just this card.</p>
						</main>
					</div>
				</div>
			</div>
			<div className='card bg-base-200 shadow-lg'>
				<div className='card-body p-0'>
					<div className='rail rail-end h-64'>
						<input type='checkbox' className='rail-toggle' id='rail-card-2' />
						<aside className='flex flex-col bg-base-300 h-full rounded-r-box'>
							<nav className='flex flex-col gap-1 p-2'>
								<NavItem
									icon={LuPanelRightOpen}
									iconOpen={LuPanelRightClose}
									htmlFor='rail-card-2'
									className='flex-row-reverse'
								/>
								<NavItem icon={LuMail} label='Inbox' />
								<NavItem icon={LuUser} label='Contacts' />
							</nav>
						</aside>
						<main className='flex-1 p-4'>
							<h3 className='font-semibold'>Another Card</h3>
							<p className='text-sm opacity-60 mt-2'>With rail on the right side.</p>
						</main>
					</div>
				</div>
			</div>
		</div>
	</Fieldset>
)

const CustomContentExample = () => (
	<Fieldset legend='Custom Content'>
		<p className='text-sm opacity-60 mb-4'>Rail items can be anything - initials, images, or custom components.</p>
		<div className='rail h-64 border border-base-300 rounded-box overflow-hidden'>
			<input type='checkbox' className='rail-toggle' id='rail-custom' />
			<aside className='flex flex-col bg-base-200 h-full'>
				<nav className='flex flex-col gap-1 p-2'>
					<NavItem icon={LuPanelLeftOpen} iconOpen={LuPanelLeftClose} htmlFor='rail-custom' />
					<button
						type='button'
						className='flex items-center gap-3 rounded-btn px-2 py-2 hover:bg-base-300 transition-colors'
					>
						<div className='avatar placeholder'>
							<div className='bg-primary text-primary-content w-8 rounded-full'>
								<span className='text-sm'>JT</span>
							</div>
						</div>
						<span className='is-rail-close:w-0 is-rail-close:opacity-0 overflow-hidden whitespace-nowrap transition-all duration-300'>
							Justin Trenary
						</span>
					</button>
					<button
						type='button'
						className='flex items-center gap-3 rounded-btn px-2 py-2 hover:bg-base-300 transition-colors'
					>
						<div className='w-8 h-8 rounded bg-linear-to-br from-primary to-secondary shrink-0' />
						<span className='is-rail-close:w-0 is-rail-close:opacity-0 overflow-hidden whitespace-nowrap transition-all duration-300'>
							Project Alpha
						</span>
					</button>
					<button
						type='button'
						className='flex items-center gap-3 rounded-btn px-2 py-2 hover:bg-base-300 transition-colors'
					>
						<div className='badge badge-error w-8 justify-center shrink-0'>5</div>
						<span className='is-rail-close:w-0 is-rail-close:opacity-0 overflow-hidden whitespace-nowrap transition-all duration-300'>
							Notifications
						</span>
					</button>
				</nav>
			</aside>
			<main className='flex-1 p-4 bg-base-100'>
				<p className='text-sm opacity-60'>Avatars, images, badges - anything works as the visible part.</p>
			</main>
		</div>
	</Fieldset>
)

export function Demo() {
	return (
		<div className='demo full-bleed-container *:w-full'>
			<DefaultExample />
			<ComposabilityExample />
			<CustomContentExample />
		</div>
	)
}
