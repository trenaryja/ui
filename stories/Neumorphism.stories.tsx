import { cn } from '@/utils'
import { Meta, StoryObj } from '@storybook/react-vite'
import { ComponentProps, CSSProperties, useEffect, useState } from 'react'

type Story = StoryObj
const meta: Meta = {
	title: 'classes/neu',
}
export default meta

export const Default: Story = {
	name: 'neu',
	render: () => {
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
					<Range min={0} max={50} value={radius} onValueChange={(x) => setRadius(x)} />

					<span>Size: {size}px</span>
					<Range min={50} max={300} value={size} onValueChange={(x) => setSize(x)} />

					<span>Distance: {distance}px</span>
					<Range min={0} max={50} value={distance} onValueChange={(x) => setDistance(x)} />

					<span>Blur: {blur}px</span>
					<Range min={0} max={100} value={blur} onValueChange={(x) => setBlur(x)} />

					<span>Intensity: {intensity}%</span>
					<Range min={0} max={100} value={intensity} onValueChange={(x) => setIntensity(x)} />

					<span>Curve: {curve}%</span>
					<Range min={0} max={100} value={curve} onValueChange={(x) => setCurve(x)} />

					<span>Angle: {angle}°</span>
					<Range min={0} max={360} value={angle} onValueChange={(x) => setAngle(x)} disabled={spinning} />

					<span>Spin</span>
					<input
						type='checkbox'
						className='toggle'
						checked={spinning}
						onChange={(e) => setSpinning(e.target.checked)}
					/>
				</section>
			</main>
		)
	},
}

const Range = ({
	onValueChange,
	className,
	...props
}: ComponentProps<'input'> & { onValueChange?: (value: number) => void }) => (
	<input
		type='range'
		className={cn('range', className)}
		onChange={(e) => onValueChange?.(Number(e.target.value))}
		{...props}
	/>
)
