import { Button, Field, Fieldset, Input, LineFieldImage, Range, Toggle } from '@/components'
import type { DemoMeta } from '@demo'
import { usePicsumImage } from '@demo'
import { useState } from 'react'

export const meta: DemoMeta = { title: 'LineFieldImage', category: 'components' }

export const Demo = () => {
	const { src, setSrc, loading, fetchRandom } = usePicsumImage()
	const [cellSize, setCellSize] = useState(10)
	const [strokeWidth, setStrokeWidth] = useState(3)
	const [matchStrokeWidth, setMatchStrokeWidth] = useState(true)
	const [showImage, setShowImage] = useState(true)

	return (
		<div className='demo'>
			<Fieldset className='size-full max-w-xs' disabled={loading}>
				<Field label='Image URL'>
					<Input value={src} onChange={(e) => setSrc(e.target.value)} />
				</Field>

				<Field label={`Cell Size (${cellSize}px)`}>
					<Range max={50} min={3} step={1} value={cellSize} onChange={(e) => setCellSize(e.target.valueAsNumber)} />
				</Field>

				<Field label='Show background image'>
					<Toggle checked={showImage} onChange={(e) => setShowImage(e.target.checked)} />
				</Field>

				<Field label='Match stroke width to cell size'>
					<Toggle checked={matchStrokeWidth} onChange={(e) => setMatchStrokeWidth(e.target.checked)} />
				</Field>

				{!matchStrokeWidth && (
					<Range
						max={10}
						min={0.5}
						step={0.1}
						value={strokeWidth}
						onChange={(e) => setStrokeWidth(e.target.valueAsNumber)}
					/>
				)}

				<Button onClick={fetchRandom}>{loading ? 'Loading...' : 'New Random Image'}</Button>
			</Fieldset>

			{src && (
				<LineFieldImage
					cellSize={cellSize}
					src={src}
					matchStrokeWidth={matchStrokeWidth}
					showImage={showImage}
					strokeWidth={strokeWidth}
				/>
			)}
		</div>
	)
}
