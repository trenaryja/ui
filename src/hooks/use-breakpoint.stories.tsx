import { useBreakpoint } from '@/hooks'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import * as R from 'remeda'

const meta = { title: 'hooks/useBreakpoint' } satisfies Meta
export default meta

export const Default: StoryObj = {
	name: 'useBreakpoint',
	render: () => {
		const [customEnabled, setCustomEnabled] = useState(false)
		const [tablet, setTablet] = useState(40)
		const [desktop, setDesktop] = useState(60)
		const bp = useBreakpoint(customEnabled ? { tablet: `${tablet}rem`, desktop: `${desktop}rem` } : undefined)

		return (
			<div className='demo place-items-center'>
				<div className='grid gap-1 place-items-center'>
					<span className='opacity-50'>current breakpoint</span>
					<span className='text-5xl'>{bp.breakpoint ?? '(undefined)'}</span>
				</div>

				<div className='alert alert-soft'>Resize the window to see breakpoint changes.</div>

				<fieldset className='grid gap-4 place-items-center'>
					<label className='flex items-center gap-2'>
						<input
							checked={customEnabled}
							className='toggle'
							type='checkbox'
							onChange={(e) => setCustomEnabled(e.target.checked)}
						/>
						<span className='text-sm'>use custom breakpoints</span>
					</label>
					{customEnabled && (
						<div className='grid gap-3 w-full'>
							<label className='grid gap-1'>
								<span className='text-xs font-mono'>tablet ({tablet}rem)</span>
								<input
									className='range'
									max={desktop - 1}
									min={20}
									type='range'
									value={tablet}
									onChange={(e) => setTablet(e.target.valueAsNumber)}
								/>
							</label>
							<label className='grid gap-1'>
								<span className='text-xs font-mono'>desktop ({desktop}rem)</span>
								<input
									className='range'
									max={100}
									min={tablet + 1}
									type='range'
									value={desktop}
									onChange={(e) => setDesktop(e.target.valueAsNumber)}
								/>
							</label>
						</div>
					)}
				</fieldset>

				<div className='grid'>
					{R.keys(bp.breakpoints)
						.slice(1)
						.map((n) => (
							<div className='stats' key={n}>
								<div className='stat'>
									<div className='stat-title'>isAtLeast({n})</div>
									<div className='stat-value text-center'>{String(bp.isAtLeast(n))}</div>
								</div>
								<div className='stat'>
									<div className='stat-title'>isBelow({n})</div>
									<div className='stat-value text-center'>{String(bp.isBelow(n))}</div>
								</div>
							</div>
						))}
				</div>

				{R.values(bp.breakpoints)
					.slice(1)
					.map((x) => (
						<div className='fixed top-0 h-screen border-x border-current/10 -z-10' key={x} style={{ width: x }} />
					))}
			</div>
		)
	},
}
