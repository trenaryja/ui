import { cn } from '@/utils'

type ChartSwatchVariant = 'area' | 'line' | 'square'

export const ChartSwatch = ({
	variant = 'square',
	color,
	strokeWidth = 2,
	strokeDasharray,
	className,
}: {
	variant?: ChartSwatchVariant
	color?: string
	strokeWidth?: number
	strokeDasharray?: string
	className?: string
}) => {
	if (variant === 'square')
		return <span className={cn('size-3 shrink-0 rounded-sm', className)} style={{ background: color, color }} />

	if (variant === 'area') {
		const sw = strokeWidth
		const size = 12
		return (
			<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={cn('shrink-0', className)}>
				<rect
					x={sw / 2}
					y={sw / 2}
					width={size - sw}
					height={size - sw}
					fill={color}
					fillOpacity={0.2}
					stroke={color}
					strokeWidth={sw}
					strokeDasharray={strokeDasharray}
					rx={1}
				/>
			</svg>
		)
	}

	return (
		<svg width={24} height={10} viewBox='0 0 24 10' className={cn('shrink-0', className)}>
			<line x1={0} y1={5} x2={24} y2={5} stroke={color} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
		</svg>
	)
}
