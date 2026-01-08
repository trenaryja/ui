import { Button, ColorButton } from '@/components'
import type { ButtonStyle } from '@/stories/utils'
import { buttonStyles } from '@/stories/utils'
import { cn, daisyThemeColors, tailwindPalette } from '@/utils'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

const meta = { title: 'components/ColorButton' } satisfies Meta
export default meta

export const Default: StoryObj = {
	name: 'ColorButton',
	render: () => {
		const [disabled, setDisabled] = useState(false)
		const [active, setActive] = useState(false)
		const [styles, setStyles] = useState<ButtonStyle[]>([])

		const toggleStyle = (style: ButtonStyle) =>
			setStyles((prev) => (prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]))

		const classNames = ['truncate', styles, { 'btn-active': active }]

		return (
			<div className='demo full-bleed'>
				<div className='flex flex-wrap gap-4'>
					<label className='flex items-center gap-2'>
						<input
							checked={disabled}
							className='toggle'
							type='checkbox'
							onChange={(e) => setDisabled(e.target.checked)}
						/>
						<span className='text-sm'>Disabled</span>
					</label>

					<label className='flex items-center gap-2'>
						<input checked={active} className='toggle' type='checkbox' onChange={(e) => setActive(e.target.checked)} />
						<span className='text-sm'>Active</span>
					</label>
				</div>

				<div className='flex flex-wrap gap-2'>
					{buttonStyles.map((style) => (
						<Button
							className={cn({ 'btn-primary': styles.includes(style) })}
							key={style}
							onClick={() => toggleStyle(style)}
						>
							{style}
						</Button>
					))}
				</div>

				<hr className='w-full opacity-25' />

				<div className='flex gap-4'>
					<Button className={cn(classNames)} disabled={disabled} type='button'>
						Default Button
					</Button>
					<ColorButton className={cn(classNames)} disabled={disabled}>
						Default ColorButton
					</ColorButton>
				</div>

				<div className='grid grid-cols-4 gap-4'>
					{daisyThemeColors.map((color) => (
						<ColorButton className={cn(classNames)} disabled={disabled} key={color} color={color}>
							{color}
						</ColorButton>
					))}
				</div>

				<div className='grid grid-cols-11 gap-2'>
					{tailwindPalette.map((color) => (
						<ColorButton
							className={cn('text-xs', classNames)}
							disabled={disabled}
							key={color.fullName}
							color={color.fullName}
						>
							{color.fullName}
						</ColorButton>
					))}
				</div>
			</div>
		)
	},
}
