import { AsciiImage } from '@/components'
import { cn } from '@/utils'
import { characterRamps } from '@/utils/ascii'
import { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

const meta: Meta = { title: 'components/AsciiImage' }
export default meta

const picsum = async (size = 500) => await fetch(`https://picsum.photos/${size}`).then((res) => res.url)
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
							type='checkbox'
							className='toggle'
							checked={reverseRamp}
							onChange={(e) => setReverseRamp(e.target.checked)}
						/>
						<span className='text-sm'>Reverse character ramp</span>
					</label>

					<label className='flex items-center gap-2'>
						<input
							type='checkbox'
							className='toggle'
							checked={showImage}
							onChange={(e) => setShowImage(e.target.checked)}
						/>
						<span className='text-sm'>Show image</span>
					</label>

					<label className='flex items-center gap-2'>
						<input
							type='checkbox'
							className='toggle'
							checked={clipText}
							onChange={(e) => setClipText(e.target.checked)}
						/>
						<span className='text-sm'>Clip text (requires show image)</span>
					</label>

					<label className='flex items-center gap-2'>
						<input
							type='checkbox'
							className='toggle'
							checked={maxWidthEnabled}
							onChange={(e) => setMaxWidthEnabled(e.target.checked)}
						/>
						<span className='text-sm'>Limit max width{maxWidthEnabled ? ` (${maxWidth} characters)` : ''}</span>
					</label>

					{maxWidthEnabled && (
						<label className='flex flex-col gap-1 w-full'>
							<input
								type='range'
								className='range w-full'
								disabled={!maxWidthEnabled}
								min={1}
								max={200}
								value={maxWidth}
								onChange={(e) => setMaxWidth(e.target.valueAsNumber)}
							/>
						</label>
					)}

					<button className='btn' onClick={fetchRandom}>
						{loading ? 'Loading...' : 'New Random Image'}
					</button>
				</fieldset>

				<AsciiImage
					src={src}
					characterRamp={ramp}
					showImage={showImage}
					maxWidth={maxWidthEnabled ? maxWidth : undefined}
					reverseRamp={reverseRamp}
					className={cn({ 'text-transparent bg-clip-text': clipText })}
				/>
			</div>
		)
	},
}
