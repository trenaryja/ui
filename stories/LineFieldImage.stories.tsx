import { LineFieldImage } from '@/components'
import { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { picsum } from './story.utils'

const meta: Meta = { title: 'components/LineFieldImage' }
export default meta

const first = await picsum()

export const Default: StoryObj = {
	name: 'LineFieldImage',
	render: () => {
		const [src, setSrc] = useState(first)
		const [cellSize, setCellSize] = useState(10)
		const [strokeWidth, setStrokeWidth] = useState(3)
		const [matchStrokeWidth, setMatchStrokeWidth] = useState(true)
		const [showImage, setShowImage] = useState(true)
		const [loading, setLoading] = useState(false)

		const fetchRandom = async () => {
			setLoading(true)
			const newSrc = await picsum()
			setSrc(newSrc)
			setLoading(false)
		}

		return (
			<div className='demo pt-10 full-bleed'>
				<fieldset className='grid gap-4 w-full max-w-md p-4' disabled={loading}>
					<label className='flex flex-col gap-1 w-full'>
						<span className='text-sm text-center'>Image URL</span>
						<input className='input w-full' value={src} onChange={(e) => setSrc(e.target.value)} />
					</label>

					<label className='flex flex-col gap-1 w-full'>
						<span className='text-sm text-center'>Cell Size ({cellSize}px)</span>
						<input
							type='range'
							className='range w-full'
							min={3}
							max={50}
							step={1}
							value={cellSize}
							onChange={(e) => setCellSize(e.target.valueAsNumber)}
						/>
					</label>

					<label className='flex items-center gap-2'>
						<input
							type='checkbox'
							className='toggle'
							checked={showImage}
							onChange={(e) => setShowImage(e.target.checked)}
						/>
						<span className='text-sm'>Show background image</span>
					</label>

					<label className='flex items-center gap-2'>
						<input
							type='checkbox'
							className='toggle'
							checked={matchStrokeWidth}
							onChange={(e) => setMatchStrokeWidth(e.target.checked)}
						/>
						<span className='text-sm'>Match stroke width to cell size</span>
					</label>

					{!matchStrokeWidth && (
						<label className='flex flex-col gap-1 w-full'>
							<input
								type='range'
								className='range w-full'
								min={0.5}
								max={10}
								step={0.1}
								value={strokeWidth}
								onChange={(e) => setStrokeWidth(e.target.valueAsNumber)}
							/>
						</label>
					)}

					<button className='btn' onClick={fetchRandom}>
						{loading ? 'Loading...' : 'New Random Image'}
					</button>
				</fieldset>

				<LineFieldImage
					src={src}
					cellSize={cellSize}
					strokeWidth={strokeWidth}
					matchStrokeWidth={matchStrokeWidth}
					showImage={showImage}
					className='max-w-full h-auto'
				/>
			</div>
		)
	},
}
