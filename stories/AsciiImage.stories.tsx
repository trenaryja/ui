import { AsciiImage } from '@/components'
import { cn } from '@/utils'
import { characterRamps } from '@/utils/ascii'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { picsum } from './story.utils'

const meta = { title: 'components/AsciiImage' } satisfies Meta
export default meta

const first = await picsum()

export const Default: StoryObj = {
	name: 'AsciiImage',
	render: () => {
		const [src, setSrc] = useState(first)
		const [ramp, setRamp] = useState<string>(characterRamps[0])
		const [reverseRamp, setReverseRamp] = useState(false)
		const [showImage, setShowImage] = useState(false)
		const [clipText, setClipText] = useState(false)
		const [maxWidthEnabled, setMaxWidthEnabled] = useState(false)
		const [maxWidth, setMaxWidth] = useState(100)
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
						<span className='text-sm text-center'>Character ramp</span>
						<input className='input w-full font-mono' value={ramp} onChange={(e) => setRamp(e.target.value)} />
					</label>

					<label className='flex items-center gap-2'>
						<input
							checked={reverseRamp}
							className='toggle'
							type='checkbox'
							onChange={(e) => setReverseRamp(e.target.checked)}
						/>
						<span className='text-sm'>Reverse character ramp</span>
					</label>

					<label className='flex items-center gap-2'>
						<input
							checked={showImage}
							className='toggle'
							type='checkbox'
							onChange={(e) => setShowImage(e.target.checked)}
						/>
						<span className='text-sm'>Show image</span>
					</label>

					<label className='flex items-center gap-2'>
						<input
							checked={clipText}
							className='toggle'
							type='checkbox'
							onChange={(e) => setClipText(e.target.checked)}
						/>
						<span className='text-sm'>Clip text (requires show image)</span>
					</label>

					<label className='flex items-center gap-2'>
						<input
							checked={maxWidthEnabled}
							className='toggle'
							type='checkbox'
							onChange={(e) => setMaxWidthEnabled(e.target.checked)}
						/>
						<span className='text-sm'>Limit max width{maxWidthEnabled ? ` (${maxWidth} characters)` : ''}</span>
					</label>

					{maxWidthEnabled && (
						<input
							className='range w-full'
							disabled={!maxWidthEnabled}
							max={200}
							min={1}
							type='range'
							value={maxWidth}
							onChange={(e) => setMaxWidth(e.target.valueAsNumber)}
						/>
					)}

					<button className='btn' type='button' onClick={fetchRandom}>
						{loading ? 'Loading...' : 'New Random Image'}
					</button>
				</fieldset>

				<AsciiImage
					characterRamp={ramp}
					className={cn({ 'text-transparent bg-clip-text': clipText })}
					maxWidth={maxWidthEnabled ? maxWidth : undefined}
					reverseRamp={reverseRamp}
					src={src}
					showImage={showImage}
				/>
			</div>
		)
	},
}
