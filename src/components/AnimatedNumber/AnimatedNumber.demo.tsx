import { AnimatedNumber, Field, Fieldset } from '@/components'
import type { DemoMeta } from '@demo'
import { useEffect, useState } from 'react'

export const meta: DemoMeta = { title: 'AnimatedNumber', category: 'components' }

export function Demo() {
	const [count, setCount] = useState(0)
	const [price, setPrice] = useState(1234.56)
	const [progress, setProgress] = useState(0)
	const [seconds, setSeconds] = useState(0)

	useEffect(() => {
		const interval = setInterval(() => {
			setCount((v) => v + 1)
			setSeconds((s) => (s + 1) % 60)
		}, 1000)

		return () => clearInterval(interval)
	}, [])

	return (
		<div className='demo'>
			<Fieldset className='max-w-xs size-full'>
				<Field label='Basic Counter'>
					<AnimatedNumber className='text-5xl' value={count} />
				</Field>

				<Field label='Currency (Intl.NumberFormat)'>
					<div className='flex items-center gap-4'>
						<AnimatedNumber className='text-4xl' value={price} format={{ style: 'currency', currency: 'USD' }} />
						<button type='button' className='btn btn-sm' onClick={() => setPrice(Math.random() * 1000)}>
							Randomize
						</button>
					</div>
				</Field>

				<Field label='Continuous Mode'>
					<div className='flex items-center gap-4'>
						<AnimatedNumber className='text-4xl' value={progress} continuous suffix='%' />
						<button type='button' className='btn btn-sm' onClick={() => setProgress(Math.floor(Math.random() * 100))}>
							Random Progress
						</button>
					</div>
				</Field>

				<Field label='Timer (digits config)'>
					<div className='flex items-center gap-4'>
						<span className='text-4xl tabular-nums'>
							<AnimatedNumber value={Math.floor(seconds / 10)} digits={{ 0: { max: 5 } }} />
							<AnimatedNumber value={seconds % 10} />
						</span>
						<span className='text-base-content/60'>Wraps 59 → 00</span>
					</div>
				</Field>
			</Fieldset>
		</div>
	)
}
