import { AsciiVideo, Field, Fieldset, Input, Range, Select, Toggle } from '@/components'
import { characterRamps } from '@/utils'
import type { DemoMeta } from '@demo'
import { useState } from 'react'

export const meta: DemoMeta = { title: 'AsciiVideo', category: 'components' }

const srcs = [
	'https://upload.wikimedia.org/wikipedia/commons/transcoded/a/ab/Geometric_--_Free_Vj_Loops.webm/Geometric_--_Free_Vj_Loops.webm.720p.vp9.webm',
	'https://videos.pexels.com/video-files/6491987/6491987-uhd_2732_1440_25fps.mp4',
	'https://videos.pexels.com/video-files/5823521/5823521-hd_1080_1920_25fps.mp4',
	'https://videos.pexels.com/video-files/8259633/8259633-uhd_1440_2732_25fps.mp4',
	'https://videos.pexels.com/video-files/4727540/4727540-uhd_2560_1440_25fps.mp4',
	'https://videos.pexels.com/video-files/853889/853889-hd_1920_1080_25fps.mp4',
	'https://videos.pexels.com/video-files/7565457/7565457-hd_2048_1080_25fps.mp4',
	'https://videos.pexels.com/video-files/2539559/2539559-hd_1920_1080_24fps.mp4',
]

export const Demo = () => {
	const [src, setSrc] = useState(srcs[0])
	const [ramp, setRamp] = useState<string>(characterRamps[0])
	const [reverseRamp, setReverseRamp] = useState(false)
	const [maxWidthEnabled, setMaxWidthEnabled] = useState(true)
	const [maxWidth, setMaxWidth] = useState(200)

	return (
		<div className='demo'>
			<Fieldset className='size-full max-w-xs'>
				<Field label='Select Video'>
					<Select value={src} onChange={(e) => setSrc(e.target.value)}>
						{srcs.map((s, i) => (
							<option key={s} value={s}>
								Video {i + 1}
							</option>
						))}
					</Select>
				</Field>

				<Field label='Or enter custom Video URL'>
					<Input value={src} onChange={(e) => setSrc(e.target.value)} />
				</Field>

				<Field label='Character ramp'>
					<Input value={ramp} onChange={(e) => setRamp(e.target.value)} />
				</Field>

				<Field label='Reverse character ramp' labelPlacement='right-center'>
					<Toggle checked={reverseRamp} onChange={(e) => setReverseRamp(e.target.checked)} />
				</Field>

				<Field label={`Limit max width${maxWidthEnabled ? ` (${maxWidth} chars)` : ''}`} labelPlacement='right-center'>
					<Toggle checked={maxWidthEnabled} onChange={(e) => setMaxWidthEnabled(e.target.checked)} />
				</Field>

				{maxWidthEnabled && (
					<Range max={200} min={1} value={maxWidth} onChange={(e) => setMaxWidth(e.target.valueAsNumber)} />
				)}
			</Fieldset>

			<AsciiVideo
				characterRamp={ramp}
				maxWidth={maxWidthEnabled ? maxWidth : undefined}
				reverseRamp={reverseRamp}
				src={src}
			/>
		</div>
	)
}
