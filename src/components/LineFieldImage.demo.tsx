import { LineFieldImage } from '@/components'
import { picsum } from '@/stories/utils'
import type { DemoMeta } from '@demo/utils'
import { useEffect, useState } from 'react'

export const meta: DemoMeta = { title: 'LineFieldImage', category: 'components' }

export const Demo = () => {
	const [src, setSrc] = useState('')
	const [cellSize, setCellSize] = useState(10)
	const [strokeWidth, setStrokeWidth] = useState(3)
	const [matchStrokeWidth, setMatchStrokeWidth] = useState(true)
	const [showImage, setShowImage] = useState(true)
	const [loading, setLoading] = useState(true)

	const fetchRandom = async () => {
		setLoading(true)
		const newSrc = await picsum()
		setSrc(newSrc)
		setLoading(false)
	}

	useEffect(() => {
		let cancelled = false
		picsum().then((newSrc) => {
			if (!cancelled) {
				setSrc(newSrc)
				setLoading(false)
			}
		})

		return () => {
			cancelled = true
		}
	}, [])

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
						className='range w-full'
						max={50}
						min={3}
						step={1}
						type='range'
						value={cellSize}
						onChange={(e) => setCellSize(e.target.valueAsNumber)}
					/>
				</label>

				<label className='flex items-center gap-2'>
					<input
						checked={showImage}
						className='toggle'
						type='checkbox'
						onChange={(e) => setShowImage(e.target.checked)}
					/>
					<span className='text-sm'>Show background image</span>
				</label>

				<label className='flex items-center gap-2'>
					<input
						checked={matchStrokeWidth}
						className='toggle'
						type='checkbox'
						onChange={(e) => setMatchStrokeWidth(e.target.checked)}
					/>
					<span className='text-sm'>Match stroke width to cell size</span>
				</label>

				{!matchStrokeWidth && (
					<div className='flex flex-col gap-1 w-full'>
						<input
							className='range w-full'
							max={10}
							min={0.5}
							step={0.1}
							type='range'
							value={strokeWidth}
							onChange={(e) => setStrokeWidth(e.target.valueAsNumber)}
						/>
					</div>
				)}

				<button className='btn' type='button' onClick={fetchRandom}>
					{loading ? 'Loading...' : 'New Random Image'}
				</button>
			</fieldset>

			{src && (
				<LineFieldImage
					cellSize={cellSize}
					className='max-w-full h-auto'
					src={src}
					matchStrokeWidth={matchStrokeWidth}
					showImage={showImage}
					strokeWidth={strokeWidth}
				/>
			)}
		</div>
	)
}
