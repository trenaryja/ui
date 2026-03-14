'use client'

import type { FunctionalClassName } from '@/utils'
import { cn, cnFn } from '@/utils'
import { flip, FloatingPortal, offset, shift, useFloating } from '@floating-ui/react'
import type { ComponentType, ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { Tooltip } from 'recharts'
import type { ChartTooltipComponents, ChartTooltipProps } from './charts.types'
import { ChartSwatch } from './ChartSwatch'

export type ChartTooltipFormatters = {
	title?: (label: ReactNode) => ReactNode
	value?: (value: ReactNode, item: TooltipItem) => ReactNode
	label?: (label: string, item: TooltipItem) => ReactNode
}

export type ChartTooltipClassNames = {
	container?: FunctionalClassName<TooltipData>
	title?: FunctionalClassName<TooltipData>
	row?: FunctionalClassName<TooltipItem>
	swatch?: FunctionalClassName<TooltipItem>
	label?: FunctionalClassName<TooltipItem>
	value?: FunctionalClassName<TooltipItem>
}

export type TooltipItem = {
	key: string
	color?: string
	swatch?: ReactNode
	label?: string
	value: ReactNode
}

export type TooltipData = {
	title?: ReactNode
	items: TooltipItem[]
}

const TooltipPortal = ({ active, children }: { active?: boolean; children: ReactNode }) => {
	const posRef = useRef({ x: 0, y: 0 })
	const { refs, floatingStyles, update } = useFloating({
		placement: 'top',
		middleware: [offset(8), flip(), shift({ padding: 8 })],
	})
	const { setFloating } = refs

	useEffect(() => {
		refs.setReference({
			getBoundingClientRect: () => DOMRect.fromRect({ x: posRef.current.x, y: posRef.current.y, width: 0, height: 0 }),
		})
	}, [refs])

	useEffect(() => {
		if (!active) return
		update()

		const handler = (e: PointerEvent) => {
			posRef.current = { x: e.clientX, y: e.clientY }
			update()
		}

		document.addEventListener('pointermove', handler)
		return () => document.removeEventListener('pointermove', handler)
	}, [active, update])

	if (!active) return null

	return (
		<FloatingPortal>
			<div ref={setFloating} style={floatingStyles} className='z-50 pointer-events-none'>
				{children}
			</div>
		</FloatingPortal>
	)
}

const DefaultSwatch = ({ item, className }: { item: TooltipItem; className?: string }) => (
	<>{item.swatch ?? (item.color && <ChartSwatch color={item.color} className={className} />)}</>
)

const DefaultRow = ({
	item,
	classNames,
	formatters,
	Swatch,
}: {
	item: TooltipItem
	classNames?: ChartTooltipClassNames
	formatters?: ChartTooltipFormatters
	Swatch: ComponentType<{ item: TooltipItem; className?: string }>
}) => {
	const label = item.label && formatters?.label ? formatters.label(item.label, item) : item.label
	const value = formatters?.value ? formatters.value(item.value, item) : item.value
	return (
		<div className={cn('flex items-center gap-1', cnFn(classNames?.row, item))}>
			<Swatch item={item} className={cnFn(classNames?.swatch, item)} />
			{label && <span className={cn('opacity-50', cnFn(classNames?.label, item))}>{label}:</span>}
			<span className={cn('font-bold', cnFn(classNames?.value, item))}>{value}</span>
		</div>
	)
}

const DefaultTooltipContent = ({
	data,
	classNames,
	formatters,
	components,
}: {
	data: TooltipData
	classNames?: ChartTooltipClassNames
	formatters?: ChartTooltipFormatters
	components?: Exclude<ChartTooltipComponents, ComponentType<any>> | undefined
}) => {
	const Container = components?.container
	const Title = components?.title
	const Row = components?.row
	const Swatch = components?.swatch ?? DefaultSwatch

	const title = formatters?.title ? formatters.title(data.title) : data.title
	const containerClassName = cn('bg-base-300 p-2 rounded-box shadow-lg text-sm', cnFn(classNames?.container, data))

	const children = (
		<>
			{title != null &&
				(Title ? (
					<Title data={data} className={cnFn(classNames?.title, data)} />
				) : (
					<p className={cn('font-bold opacity-50', cnFn(classNames?.title, data))}>{title}</p>
				))}
			{data.items.map((item) =>
				Row ? (
					<Row key={item.key} item={item} className={cnFn(classNames?.row, item)}>
						<Swatch item={item} className={cnFn(classNames?.swatch, item)} />
					</Row>
				) : (
					<DefaultRow key={item.key} item={item} classNames={classNames} formatters={formatters} Swatch={Swatch} />
				),
			)}
		</>
	)

	return Container ? (
		<Container data={data} className={containerClassName}>
			{children}
		</Container>
	) : (
		<div className={containerClassName}>{children}</div>
	)
}

export const ChartTooltip = ({
	resolve,
	classNames,
	formatters,
	components,
}: {
	resolve: (props: ChartTooltipProps) => TooltipData | null
	classNames?: ChartTooltipClassNames
	formatters?: ChartTooltipFormatters
	components?: ChartTooltipComponents
}) => {
	const isFullReplacement = typeof components === 'function'

	const renderContent = (raw: ChartTooltipProps): ReactNode | null => {
		const data = resolve(raw)

		if (isFullReplacement) {
			const Component = components
			return <Component data={data} raw={raw} />
		}

		if (!data) return null

		return <DefaultTooltipContent data={data} classNames={classNames} formatters={formatters} components={components} />
	}

	return (
		<Tooltip
			wrapperStyle={{ display: 'none' }}
			content={(props) => (
				<TooltipPortal active={(props as { active?: boolean }).active}>
					{renderContent(props as unknown as ChartTooltipProps)}
				</TooltipPortal>
			)}
		/>
	)
}
