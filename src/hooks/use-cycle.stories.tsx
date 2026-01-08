import { BalancedGrid, Button } from '@/components'
import { useCycle as useCycleHook } from '@/hooks'
import { playingCards } from '@/stories/utils'
import { cn } from '@/utils'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useMemo, useState } from 'react'

const meta = { title: 'hooks/useCycle' } satisfies Meta
export default meta

export const Default: StoryObj = {
	name: 'useCycle',
	render: () => {
		const [count, setCount] = useState(16)
		const items = useMemo(() => playingCards.slice(0, Math.min(playingCards.length, count)), [count])

		const [wrap, setWrap] = useState(true)
		const [idleResetEnabled, setIdleResetEnabled] = useState(true)
		const [idleResetMs, setIdleResetMs] = useState(1000)

		const cycle = useCycleHook(items, {
			idleResetMs: idleResetEnabled ? idleResetMs : null,
			wrap,
		})

		return (
			<div className='demo place-items-center'>
				<fieldset className='grid gap-4 w-full place-items-center'>
					<span className='text-sm text-center'>Item Count: {items.length}</span>
					<input
						className='range'
						max={playingCards.length}
						min={0}
						type='range'
						value={count}
						onChange={(e) => setCount(e.target.valueAsNumber)}
					/>

					<label className='flex items-center gap-2'>
						<input checked={wrap} className='toggle' type='checkbox' onChange={(e) => setWrap(e.target.checked)} />
						<span className='text-sm'>wrap</span>
					</label>

					<label className='flex items-center gap-2'>
						<input
							checked={idleResetEnabled}
							className='toggle'
							type='checkbox'
							onChange={(e) => setIdleResetEnabled(e.target.checked)}
						/>
						<span className='text-sm'>reset when idle {idleResetEnabled ? ` (${idleResetMs}ms)` : ''}</span>
					</label>

					{idleResetEnabled && (
						<input
							className='range'
							max={3000}
							min={50}
							step={50}
							type='range'
							value={idleResetMs}
							onChange={(e) => setIdleResetMs(e.target.valueAsNumber)}
						/>
					)}
				</fieldset>

				<div className='stats'>
					<div className='stat'>
						<div className='stat-title'>index</div>
						<div className='stat-value font-mono'>{cycle.index}</div>
					</div>
					<div className='stat'>
						<div className='stat-title'>value</div>
						<div className='stat-value font-mono'>{cycle.value}</div>
					</div>
				</div>

				<div className='grid grid-cols-3 gap-4 *:h-full *:border-none'>
					<Button className='stat' disabled={!items.length} onClick={cycle.decrement}>
						<div className='stat-value text-base'>decrement</div>
						<div className='stat-desc'>prev: {String(cycle.prev ?? '(empty)')}</div>
					</Button>
					<Button disabled={!items.length} onClick={cycle.reset}>
						reset
					</Button>
					<Button className='stat' disabled={!items.length} onClick={cycle.increment}>
						<div className='stat-value text-base'>increment</div>
						<div className='stat-desc'>next: {String(cycle.next ?? '(empty)')}</div>
					</Button>
				</div>

				<BalancedGrid pack className='w-fit gap-2' maxCols={4}>
					{items.map((item, i) => (
						<button
							className={cn('btn btn-lg', { 'btn-soft': i === cycle.index })}
							key={item}
							type='button'
							onClick={() => cycle.setIndex(i)}
						>
							{item}
						</button>
					))}
				</BalancedGrid>
			</div>
		)
	},
}
