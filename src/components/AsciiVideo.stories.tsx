import { AsciiVideo } from '@/components'
import { characterRamps } from '@/utils'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

const meta = { title: 'components/AsciiVideo' } satisfies Meta
export default meta

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

export const Default: StoryObj = {
	name: 'AsciiVideo',
	render: () => {
		const [src, setSrc] = useState(srcs[0])
		const [ramp, setRamp] = useState<string>(characterRamps[0])
		const [reverseRamp, setReverseRamp] = useState(false)
		const [maxWidth, setMaxWidth] = useState(200)

		return (
			<div className='demo pt-10 full-bleed'>
				<fieldset className='grid gap-4 w-full max-w-md p-4'>
					<label className='flex flex-col gap-1 w-full'>
						<span className='text-sm text-center'>Select Video</span>
						<select className='select w-full' value={src} onChange={(e) => setSrc(e.target.value)}>
							{srcs.map((s, i) => (
								<option key={s} value={s}>
									Video {i + 1}
								</option>
							))}
						</select>
					</label>

					<label className='flex flex-col gap-1 w-full'>
						<span className='text-sm text-center'>Or enter custom Video URL</span>
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

					<div className='flex flex-col gap-1 w-full'>
						<input
							className='range w-full'
							max={200}
							min={1}
							type='range'
							value={maxWidth}
							onChange={(e) => setMaxWidth(e.target.valueAsNumber)}
						/>
					</div>
				</fieldset>

				<AsciiVideo characterRamp={ramp} maxWidth={maxWidth} reverseRamp={reverseRamp} src={src} />
			</div>
		)
	},
}
