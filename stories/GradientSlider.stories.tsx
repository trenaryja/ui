import { GradientSlider, GradientSliderProps, HueSlider } from '@/components'
import { Meta, StoryObj } from '@storybook/react-vite'
import chroma from 'chroma-js'
import { useState } from 'react'

type Story = StoryObj<typeof GradientSlider>
const meta: Meta<typeof GradientSlider> = {
	title: 'components/GradientSlider',
	component: GradientSlider,
}
export default meta

const defaultArgs: GradientSliderProps = {
	gradient: ['red', 'green', 'blue'],
}

export const Default: Story = {
	argTypes: {
		onChange: { table: { disable: true } },
	},
	args: defaultArgs,
}

export const ColorPicker: Story = {
	render: () => {
		const [hue, setHue] = useState(0)
		const [saturation, setSaturation] = useState(1)
		const [lightness, setLightness] = useState(0.5)
		const [alpha, setAlpha] = useState(1)
		const color = chroma(hue, saturation, lightness, 'hsl').alpha(alpha)
		const thumbColor = color.hex('rgb')
		return (
			<div className='flex gap-10 w-full size-fit place-self-center'>
				<div className='flex flex-col gap-5 w-full justify-between'>
					<HueSlider thumbColor={thumbColor} value={hue} onChange={(x) => setHue(x)} />
					<GradientSlider
						thumbColor={thumbColor}
						gradient={[chroma(hue, 0, lightness, 'hsl'), chroma(hue, 1, lightness, 'hsl')]}
						max={255}
						value={saturation * 255}
						onChange={(x) => setSaturation(x / 255)}
					/>
					<GradientSlider
						thumbColor={thumbColor}
						gradient={[
							chroma(hue, saturation, 0, 'hsl'),
							chroma(hue, saturation, 0.5, 'hsl'),
							chroma(hue, saturation, 1, 'hsl'),
						]}
						max={255}
						value={lightness * 255}
						onChange={(x) => setLightness(x / 255)}
					/>
					<GradientSlider
						thumbColor={thumbColor}
						gradient={['#0000', thumbColor]}
						max={255}
						value={alpha * 255}
						onChange={(x) => setAlpha(x / 255)}
					/>
				</div>
				<div className='flex flex-col w-40 items-center'>
					<svg viewBox='0 0 1 1'>
						<rect width={1} height={1} fill={color.hex()} />
					</svg>
					<p className='font-extrabold text-lg'>{color.hex()}</p>
				</div>
			</div>
		)
	},
}
