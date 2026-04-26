import { ColorPicker } from '@/components'
import type { DemoMeta } from '@demo'
import { useState } from 'react'
import type { ColorFormat } from './ColorPicker.types'

export const meta: DemoMeta = { title: 'ColorPicker', category: 'components', tags: ['color', 'input'] }

const formats: ColorFormat[] = ['oklch', 'hex', 'rgb', 'hsl']

export function Demo() {
	const [color, setColor] = useState<string>()
	const [rings, setRings] = useState(6)
	const [size, setSize] = useState(16)
	const [format, setFormat] = useState<ColorFormat>('oklch')
	const [maxChroma, setMaxChroma] = useState(0.4)

	return (
		<div className='demo'>
			{/* Controls */}
			<div className='flex flex-wrap items-end gap-6'>
				<label className='flex flex-col gap-1'>
					<span className='text-xs font-medium opacity-60'>Rings</span>
					<div className='flex items-center gap-2'>
						<input
							type='range'
							min={2}
							max={12}
							step={1}
							value={rings}
							className='range range-xs w-32'
							onChange={(e) => setRings(e.target.valueAsNumber)}
						/>
						<span className='w-4 font-mono text-sm tabular-nums'>{rings}</span>
					</div>
				</label>

				<label className='flex flex-col gap-1'>
					<span className='text-xs font-medium opacity-60'>Cell size</span>
					<div className='flex items-center gap-2'>
						<input
							type='range'
							min={8}
							max={28}
							step={2}
							value={size}
							className='range range-xs w-32'
							onChange={(e) => setSize(e.target.valueAsNumber)}
						/>
						<span className='w-6 font-mono text-sm tabular-nums'>{size}px</span>
					</div>
				</label>

				<label className='flex flex-col gap-1'>
					<span className='text-xs font-medium opacity-60'>Max chroma</span>
					<div className='flex items-center gap-2'>
						<input
							type='range'
							min={0.1}
							max={0.55}
							step={0.05}
							value={maxChroma}
							className='range range-xs w-32'
							onChange={(e) => setMaxChroma(e.target.valueAsNumber)}
						/>
						<span className='w-8 font-mono text-sm tabular-nums'>{maxChroma.toFixed(2)}</span>
					</div>
				</label>

				<label className='flex flex-col gap-1'>
					<span className='text-xs font-medium opacity-60'>Output format</span>
					<div className='flex gap-1'>
						{formats.map((f) => (
							<button
								key={f}
								type='button'
								className={`btn btn-xs ${format === f ? 'btn-primary' : 'btn-ghost'}`}
								onClick={() => setFormat(f)}
							>
								{f}
							</button>
						))}
					</div>
				</label>
			</div>

			<hr className='w-full opacity-10' />

			{/* Pickers */}
			<div className='flex flex-wrap justify-center gap-12'>
				<div className='flex flex-col items-center gap-2'>
					<span className='text-xs font-medium opacity-40'>flat-top</span>
					<ColorPicker
						rings={rings}
						size={size}
						maxChroma={maxChroma}
						format={format}
						orientation='flat'
						value={color}
						onChange={setColor}
						className='w-full max-w-xs'
					/>
				</div>

				<div className='flex flex-col items-center gap-2'>
					<span className='text-xs font-medium opacity-40'>pointy-top</span>
					<ColorPicker
						rings={rings}
						size={size}
						maxChroma={maxChroma}
						format={format}
						orientation='pointy'
						value={color}
						onChange={setColor}
						className='w-full max-w-xs'
					/>
				</div>
			</div>

			{color && (
				<div className='flex items-center gap-3 rounded-xl border border-base-content/10 p-4'>
					<div className='size-10 rounded-lg shadow-md' style={{ background: color }} />
					<div className='flex flex-col gap-0.5'>
						<span className='text-xs opacity-40'>selected ({format})</span>
						<span className='font-mono text-sm'>{color}</span>
					</div>
				</div>
			)}
		</div>
	)
}
