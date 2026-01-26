import { Button, Fieldset } from '@/components'
import type { DemoMeta } from '@demo/utils'
import { GiButtonFinger } from 'react-icons/gi'

export const meta: DemoMeta = { title: 'Button', category: 'components', tags: ['input'] }

export function Demo() {
	return (
		<div className='demo [&_legend]:text-center'>
			<Fieldset legend='Default' className='flex justify-center'>
				<Button>Button</Button>
			</Fieldset>

			<Fieldset legend='Colors' className='flex flex-wrap gap-2 items-center'>
				<Button className='btn-neutral'>Neutral</Button>
				<Button className='btn-primary'>Primary</Button>
				<Button className='btn-secondary'>Secondary</Button>
				<Button className='btn-accent'>Accent</Button>
				<Button className='btn-info'>Info</Button>
				<Button className='btn-success'>Success</Button>
				<Button className='btn-warning'>Warning</Button>
				<Button className='btn-error'>Error</Button>
			</Fieldset>

			<Fieldset legend='Styles' className='flex flex-wrap gap-2 items-center'>
				<Button className='btn-outline'>Outline</Button>
				<Button className='btn-dash'>Dash</Button>
				<Button className='btn-soft'>Soft</Button>
				<Button className='btn-ghost'>Ghost</Button>
				<Button className='btn-link'>Link</Button>
			</Fieldset>

			<Fieldset legend='Behaviors' className='flex flex-wrap gap-2 items-center'>
				<Button className='btn-active'>Active</Button>
				<Button className='btn-disabled' tabIndex={-1} aria-disabled='true'>
					Disabled (class)
				</Button>
				<Button disabled>Disabled (attr)</Button>
			</Fieldset>

			<Fieldset legend='Sizes' className='flex flex-wrap gap-2 items-center'>
				<Button className='btn-xs'>Extra Small</Button>
				<Button className='btn-sm'>Small</Button>
				<Button className='btn-md'>Medium</Button>
				<Button className='btn-lg'>Large</Button>
				<Button className='btn-xl'>Extra Large</Button>
			</Fieldset>

			<Fieldset legend='Modifiers' className='flex flex-wrap gap-2 items-center'>
				<Button className='btn-wide'>Wide</Button>
				<Button className='btn-square'>
					<GiButtonFinger className='size-[1.2em]' />
				</Button>
				<Button className='btn-circle'>
					<GiButtonFinger className='size-[1.2em]' />
				</Button>
				<Button className='btn-block'>Block</Button>
			</Fieldset>
		</div>
	)
}
