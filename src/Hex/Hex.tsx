import { cn } from '../utils'

export type HexProps = React.ComponentProps<'div'> & {
	flat?: boolean
}

export const Hex = ({ flat, className, children, ...props }: HexProps) => {
	return (
		<>
			<div
				className={cn(
					'overflow-clip',
					flat
						? '[clip-path:polygon(25%_0%,75%_0%,100%_50%,75%_100%,25%_100%,0%_50%)] aspect-[2/sqrt(3)]'
						: '[clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)] aspect-[sqrt(3)/2]',
					className,
				)}
				{...props}
			>
				{children}
			</div>
		</>
	)
}
