import { AsciiImage, Button, Field, Fieldset, Input, Range, Toggle } from '@/components'
import { characterRamps, cn } from '@/utils'
import type { DemoMeta } from '@demo'
import { usePicsumImage } from '@demo'
import { useState } from 'react'

export const meta: DemoMeta = { title: 'AsciiImage', category: 'components' }

export const Demo = () => {
	const { src, setSrc, loading, fetchRandom } = usePicsumImage()
	const [ramp, setRamp] = useState<string>(characterRamps[0])
	const [reverseRamp, setReverseRamp] = useState(false)
	const [showImage, setShowImage] = useState(false)
	const [clipText, setClipText] = useState(false)
	const [maxWidthEnabled, setMaxWidthEnabled] = useState(false)
	const [maxWidth, setMaxWidth] = useState(100)

	return (
		<div className='demo'>
			<Fieldset className='max-w-xs size-full' disabled={loading}>
				<Field label='Image URL'>
					<Input value={src} onChange={(e) => setSrc(e.target.value)} />
				</Field>

				<Field label='Character ramp'>
					<Input value={ramp} onChange={(e) => setRamp(e.target.value)} />
				</Field>

				<Field label='Reverse character ramp' labelPlacement='right-center'>
					<Toggle checked={reverseRamp} onChange={(e) => setReverseRamp(e.target.checked)} />
				</Field>

				<Field label='Show image' labelPlacement='right-center'>
					<Toggle checked={showImage} onChange={(e) => setShowImage(e.target.checked)} />
				</Field>

				<Field label='Clip text (requires show image)' labelPlacement='right-center'>
					<Toggle checked={clipText} onChange={(e) => setClipText(e.target.checked)} />
				</Field>

				<Field label={`Limit max width${maxWidthEnabled ? ` (${maxWidth} chars)` : ''}`} labelPlacement='right-center'>
					<Toggle checked={maxWidthEnabled} onChange={(e) => setMaxWidthEnabled(e.target.checked)} />
				</Field>

				{maxWidthEnabled && (
					<Range max={200} min={1} value={maxWidth} onChange={(e) => setMaxWidth(e.target.valueAsNumber)} />
				)}

				<Button onClick={fetchRandom}>{loading ? 'Loading...' : 'New Random Image'}</Button>
			</Fieldset>

			{src && (
				<AsciiImage
					characterRamp={ramp}
					className={cn({ 'text-transparent bg-clip-text': clipText })}
					maxWidth={maxWidthEnabled ? maxWidth : undefined}
					reverseRamp={reverseRamp}
					src={src}
					showImage={showImage}
				/>
			)}
		</div>
	)
}
