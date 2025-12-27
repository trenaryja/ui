import type { Meta, StoryObj } from '@storybook/react-vite'
import { nest } from './utils'

const meta = { title: 'classes/hexagon' } satisfies Meta
export default meta

export const Default: StoryObj = {
	name: 'hexagon',
	render: () => {
		return (
			<div className='demo grid-cols-2'>
				<h1 className='text-3xl font-bold'>tall</h1>
				<h1 className='text-3xl font-bold'>wide</h1>

				<div className='hexagon-tall h-fit p-6 bg-base-200 grid place-items-center'>
					<span>sized to content</span>
				</div>
				<div className='hexagon-wide w-fit p-6 bg-base-200 grid place-items-center'>
					<span>sized to content</span>
				</div>

				<div className='hexagon-tall h-full bg-base-200 grid place-items-center'>
					<span>sized to container</span>
				</div>
				<div className='hexagon-wide w-full bg-base-200 grid place-items-center'>
					<span>sized to container</span>
				</div>

				{nest(6, <div className='hexagon-tall h-fit w-full bg-base-content/20 px-6' />)}
				{nest(6, <div className='hexagon-wide bg-base-content/20 px-6 flex items-end' />)}
				{nest(6, <div className='hexagon-tall bg-base-content/20 px-6' />)}
				{nest(6, <div className='hexagon-tall bg-base-content/20 p-4 animate-spin [animation-duration:600s]' />)}
			</div>
		)
	},
}
