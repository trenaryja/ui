import { Field, Fieldset, Range, Toggle } from '@/components'
import { cn, css } from '@/utils'
import type { DemoMeta } from '@demo'
import { useEffect, useState } from 'react'

export const meta: DemoMeta = { title: 'neu', category: 'classes' }

export const Demo = () => {
	const [distance, setDistance] = useState(5)
	const [blur, setBlur] = useState(10)
	const [intensity, setIntensity] = useState(10)
	const [angle, setAngle] = useState(45)
	const [radius, setRadius] = useState(50)
	const [curve, setCurve] = useState(50)
	const [size, setSize] = useState(200)
	const [spinning, setSpinning] = useState(false)

	useEffect(() => {
		if (!spinning) return
		let frame: number

		const animate = () => {
			setAngle((prev) => (prev + 1) % 360)
			frame = requestAnimationFrame(animate)
		}

		frame = requestAnimationFrame(animate)
		return () => cancelAnimationFrame(frame)
	}, [spinning])

	const neuVars = css({
		'--neu-distance': `${distance}px`,
		'--neu-blur': `${blur}px`,
		'--neu-intensity': `${intensity}%`,
		'--neu-angle': `${angle}deg`,
		'--neu-curve': `${curve}%`,
	})

	const liveStyle = css({
		...neuVars,
		borderRadius: `${radius}%`,
		width: `min(${size}px, 100%)`,
		aspectRatio: '1',
	})

	return (
		<div className='demo p-10 full-bleed md:grid-cols-2 *:size-full'>
			<Fieldset className='max-w-xs'>
				<Field label={`Border Radius: ${radius}%`}>
					<Range max={50} value={radius} onChange={(e) => setRadius(e.target.valueAsNumber)} />
				</Field>
				<Field label={`Size: ${size}px`}>
					<Range max={300} min={50} value={size} onChange={(e) => setSize(e.target.valueAsNumber)} />
				</Field>
				<Field label={`Distance: ${distance}px`}>
					<Range max={50} value={distance} onChange={(e) => setDistance(e.target.valueAsNumber)} />
				</Field>
				<Field label={`Blur: ${blur}px`}>
					<Range value={blur} onChange={(e) => setBlur(e.target.valueAsNumber)} />
				</Field>
				<Field label={`Intensity: ${intensity}%`}>
					<Range value={intensity} onChange={(e) => setIntensity(e.target.valueAsNumber)} />
				</Field>
				<Field label={`Curve: ${curve}%`}>
					<Range value={curve} onChange={(e) => setCurve(e.target.valueAsNumber)} />
				</Field>
				<Field label={`Angle: ${angle}°`}>
					<Range disabled={spinning} max={360} value={angle} onChange={(e) => setAngle(e.target.valueAsNumber)} />
				</Field>
				<Field label='Spin'>
					<Toggle checked={spinning} onChange={(e) => setSpinning(e.target.checked)} />
				</Field>
			</Fieldset>

			<div className='grid grid-cols-2 gap-10 place-items-center *:grid *:place-items-center'>
				<Range
					style={neuVars}
					className={cn(
						'col-span-full w-full',
						'neu neu-inset py-5 px-2 rounded-selector',
						'[&::-webkit-slider-runnable-track]:bg-transparent',
						'[&::-webkit-slider-thumb]:rounded-selector',
						'[&::-webkit-slider-thumb]:neu',
						'[&::-webkit-slider-thumb]:neu-concave',
						'[&::-webkit-slider-thumb]:neu-xs',
						'[&::-webkit-slider-thumb]:[--neu-intensity:inherit]',
						'[&::-webkit-slider-thumb]:[--neu-angle:inherit]',
						'[&::-webkit-slider-thumb]:[--neu-curve:inherit]',
						'[--range-p:0]',
					)}
				/>
				<div className='neu' style={liveStyle}>
					Normal
				</div>
				<div className='neu neu-inset' style={liveStyle}>
					Inset
				</div>
				<div className='neu neu-concave' style={liveStyle}>
					Concave
				</div>
				<div className='neu neu-convex' style={liveStyle}>
					Convex
				</div>
			</div>
		</div>
	)
}
