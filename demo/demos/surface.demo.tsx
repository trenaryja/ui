import { cn } from '@/utils'
import type { DemoMeta } from '@demo'

export const meta: DemoMeta = { title: 'surface', category: 'classes' }

// Explicit class names for Tailwind to detect at build time
const surfaceVariants = [
	{ color: 'base-100', className: 'surface-base-100' },
	{ color: 'base-200', className: 'surface-base-200' },
	{ color: 'base-300', className: 'surface-base-300' },
	{ color: 'base-content', className: 'surface-base-content' },
	{ color: 'primary', className: 'surface-primary' },
	{ color: 'secondary', className: 'surface-secondary' },
	{ color: 'accent', className: 'surface-accent' },
	{ color: 'neutral', className: 'surface-neutral' },
	{ color: 'info', className: 'surface-info' },
	{ color: 'success', className: 'surface-success' },
	{ color: 'warning', className: 'surface-warning' },
	{ color: 'error', className: 'surface-error' },
] as const

const SurfaceCard = ({ title, className }: { title: string; className?: string }) => (
	<div className={cn('surface p-4', className)}>
		<h3 className='text-xl font-bold'>{title}</h3>
		<p>A dimensional panel with depth, shadows, and noise texture.</p>
		<div className='flex gap-2'>
			<button type='button' className='btn btn-sm'>
				Button
			</button>
			<button type='button' className='btn btn-sm btn-ghost'>
				Action
			</button>
		</div>
	</div>
)

export const Demo = () => {
	return (
		<div className='demo'>
			<SurfaceCard title='Default' />

			<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
				{surfaceVariants.map(({ color, className }) => (
					<SurfaceCard key={color} title={color} className={className} />
				))}
			</div>

			<section className='grid gap-4'>
				<h2 className='text-lg font-semibold'>Nested Surfaces</h2>
				<div className='surface surface-base-300 p-6'>
					<p className='mb-4'>Outer surface (base-300)</p>
					<div className='surface surface-base-200 p-4'>
						<p className='mb-4'>Middle surface (base-200)</p>
						<div className='surface surface-base-100 p-4'>
							<p>Inner surface (base-100)</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}
