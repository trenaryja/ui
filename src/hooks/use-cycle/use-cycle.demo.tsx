import { BalancedGrid, Button, Field, Fieldset, Range, Toggle } from '@/components'
import { useCycle as useCycleHook } from '@/hooks'
import { cn } from '@/utils'
import type { DemoMeta } from '@demo'
import { playingCards } from '@demo'
import { useState } from 'react'

export const meta: DemoMeta = { title: 'useCycle', category: 'hooks' }

export const Demo = () => {
	const [count, setCount] = useState(16)
	const items = playingCards.slice(0, Math.min(playingCards.length, count))

	const [wrap, setWrap] = useState(true)
	const [idleResetEnabled, setIdleResetEnabled] = useState(true)
	const [idleResetMs, setIdleResetMs] = useState(1000)

	const cycle = useCycleHook(items, {
		idleResetMs: idleResetEnabled ? idleResetMs : null,
		wrap,
	})

	return (
		<div className='demo'>
			<Fieldset>
				<Field label={`Item Count: ${items.length}`}>
					<Range max={playingCards.length} min={0} value={count} onChange={(e) => setCount(e.target.valueAsNumber)} />
				</Field>

				<Field label='wrap' labelPlacement='right-center'>
					<Toggle checked={wrap} onChange={(e) => setWrap(e.target.checked)} />
				</Field>

				<Field label={`reset when idle${idleResetEnabled ? ` (${idleResetMs}ms)` : ''}`} labelPlacement='right-center'>
					<Toggle checked={idleResetEnabled} onChange={(e) => setIdleResetEnabled(e.target.checked)} />
				</Field>

				{idleResetEnabled && (
					<Range
						max={3000}
						min={50}
						step={50}
						value={idleResetMs}
						onChange={(e) => setIdleResetMs(e.target.valueAsNumber)}
					/>
				)}
			</Fieldset>

			<div className='stats'>
				<div className='stat'>
					<div className='stat-title'>index</div>
					<div className='stat-value'>{cycle.index}</div>
				</div>
				<div className='stat'>
					<div className='stat-title'>value</div>
					<div className='stat-value'>{cycle.value}</div>
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
					<Button
						className={cn('btn-lg', { 'btn-soft': i === cycle.index })}
						key={item}
						onClick={() => cycle.setIndex(i)}
					>
						{item}
					</Button>
				))}
			</BalancedGrid>
		</div>
	)
}
