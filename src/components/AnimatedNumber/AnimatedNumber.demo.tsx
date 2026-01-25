import type { DemoMeta } from '@demo/utils'
import { useEffect, useState } from 'react'
import { AnimatedNumber } from './AnimatedNumber'

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
			<h3>Basic Counter</h3>
			<AnimatedNumber className='text-5xl' value={count} />

			<h3>Currency (Intl.NumberFormat)</h3>
			<div className='flex items-center gap-4'>
				<AnimatedNumber className='text-4xl' value={price} format={{ style: 'currency', currency: 'USD' }} />
				<button type='button' className='btn btn-sm' onClick={() => setPrice(Math.random() * 1000)}>
					Randomize
				</button>
			</div>

			<h3>Continuous Mode</h3>
			<div className='flex items-center gap-4'>
				<AnimatedNumber className='text-4xl' value={progress} continuous suffix='%' />
				<button type='button' className='btn btn-sm' onClick={() => setProgress(Math.floor(Math.random() * 100))}>
					Random Progress
				</button>
			</div>

			<h3>Timer (digits config)</h3>
			<div className='flex items-center gap-4'>
				<span className='text-4xl tabular-nums'>
					<AnimatedNumber value={Math.floor(seconds / 10)} digits={{ 0: { max: 5 } }} />
					<AnimatedNumber value={seconds % 10} />
				</span>
				<span className='text-base-content/60'>Wraps 59 → 00</span>
			</div>
		</div>
	)
}
