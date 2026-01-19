import { Range } from '@/components'
import { cn } from '@/utils'
import type { DemoMeta } from '@demo/utils'
import type { CSSProperties } from 'react'
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

	const neuVars = {
		'--neu-distance': `${distance}px`,
		'--neu-blur': `${blur}px`,
		'--neu-intensity': `${intensity}%`,
		'--neu-angle': `${angle}deg`,
		'--neu-curve': `${curve}%`,
	} as CSSProperties

	const liveStyle = {
		...neuVars,
		borderRadius: `${radius}%`,
		width: `${size}px`,
		height: `${size}px`,
	} as CSSProperties

	return (
		<main className='grid lg:grid-cols-2 gap-10 full-bleed'>
			<section className='grid grid-cols-2 gap-10 place-items-center *:grid *:place-items-center'>
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
			</section>

			<section className='grid grid-cols-[auto_1fr] *:not-last:w-full gap-4 '>
				<span>Border Radius: {radius}%</span>
				<Range max={50} min={0} value={radius} onChange={(e) => setRadius(e.target.valueAsNumber)} />

				<span>Size: {size}px</span>
				<Range max={300} min={50} value={size} onChange={(e) => setSize(e.target.valueAsNumber)} />

				<span>Distance: {distance}px</span>
				<Range max={50} min={0} value={distance} onChange={(e) => setDistance(e.target.valueAsNumber)} />

				<span>Blur: {blur}px</span>
				<Range max={100} min={0} value={blur} onChange={(e) => setBlur(e.target.valueAsNumber)} />

				<span>Intensity: {intensity}%</span>
				<Range max={100} min={0} value={intensity} onChange={(e) => setIntensity(e.target.valueAsNumber)} />

				<span>Curve: {curve}%</span>
				<Range max={100} min={0} value={curve} onChange={(e) => setCurve(e.target.valueAsNumber)} />

				<span>Angle: {angle}°</span>
				<Range disabled={spinning} max={360} min={0} value={angle} onChange={(e) => setAngle(e.target.valueAsNumber)} />

				<span>Spin</span>
				<input checked={spinning} className='toggle' type='checkbox' onChange={(e) => setSpinning(e.target.checked)} />
			</section>
		</main>
	)
}
