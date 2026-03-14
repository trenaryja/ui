import type { ToastPosition } from '@/components'
import { Button, Checkbox, Input, Radio, RadioGroup, Range, Select, TextArea, Toggle, TriToggle } from '@/components'
import type { Arrow } from '@/utils'
import { durationUnits, joinTyped } from '@/utils'
import { capitalize } from 'remeda'
import { faker } from '@faker-js/faker'
import type { JSXElementConstructor, ReactElement, ReactNode } from 'react'
import { createElement, useEffect, useState } from 'react'

export * from './meta'

const densityOptions = ['Low', 'Med', 'High'] as const
export type Density = (typeof densityOptions)[number]

export type ChartData = { label: string; name: string; date: string; a: number; b: number; c: number }
export type DemoSeries = { key: 'a'; label: string } | { key: 'b'; label: string } | { key: 'c'; label: string }
export type ChartDataResult = { data: ChartData[]; series: [DemoSeries, DemoSeries, DemoSeries] }

export const randChartData = (count: number, options?: { sparse?: boolean }): ChartDataResult => {
	const nouns = faker.helpers.uniqueArray(faker.word.noun, count)
	const start = new Date('2024-01-01')
	const dates = options?.sparse
		? faker.date.betweens({ from: start, to: '2024-12-31', count }).map((d) => d.toISOString().slice(0, 10))
		: Array.from({ length: count }, (_, i) => {
				const d = new Date(start)
				d.setDate(d.getDate() + i)
				return d.toISOString().slice(0, 10)
			})

	return {
		data: nouns.map((noun, i) => ({
			label: `Day ${i + 1}`,
			name: capitalize(noun),
			date: dates[i],
			a: faker.number.int({ min: 20, max: 100 }),
			b: faker.number.int({ min: 20, max: 100 }),
			c: faker.number.int({ min: 20, max: 100 }),
		})),
		series: faker.helpers.uniqueArray(faker.word.noun, 3).map((noun, i) => ({
			key: (['a', 'b', 'c'] as const)[i],
			label: capitalize(noun),
		})) as [DemoSeries, DemoSeries, DemoSeries],
	}
}

type ChartCardProps = {
	title: string
	onRandomize?: (density: Density) => void
	children: (key: number) => ReactNode
}

export const ChartCard = ({ title, onRandomize, children }: ChartCardProps) => {
	const [key, setKey] = useState(0)
	const [density, setDensity] = useState<Density>(densityOptions[0])

	return (
		<div className='size-full [&_.chart]:h-64!'>
			<div className='flex items-center gap-3 pb-3 justify-between'>
				<span>{title}</span>
				<RadioGroup
					variant='btn'
					options={[...densityOptions]}
					value={density}
					classNames={{ item: 'btn-xs btn-ghost' }}
					onChange={(e) => {
						const d = e.target.value satisfies string as Density
						setDensity(d)
						onRandomize?.(d)
					}}
				/>
				<div className='flex gap-1'>
					<Button className='btn-xs btn-ghost w-fit' onClick={() => setKey((k) => k + 1)}>
						Re-render
					</Button>
					{onRandomize && (
						<Button className='btn-xs btn-ghost w-fit' onClick={() => onRandomize(density)}>
							Randomize
						</Button>
					)}
				</div>
			</div>
			{children(key)}
		</div>
	)
}

export const picsum = async (size = 500) => await fetch(`https://picsum.photos/${size}`).then((res) => res.url)

export const usePicsumImage = (size?: number) => {
	const [src, setSrc] = useState('')
	const [loading, setLoading] = useState(true)

	const fetchRandom = async () => {
		setLoading(true)
		const newSrc = await picsum(size)
		setSrc(newSrc)
		setLoading(false)
	}

	useEffect(() => {
		let cancelled = false
		picsum(size).then((newSrc) => {
			if (!cancelled) {
				setSrc(newSrc)
				setLoading(false)
			}
		})

		return () => {
			cancelled = true
		}
	}, [size])

	return { src, setSrc, loading, fetchRandom }
}

export const nest = <P,>(n: number, el: ReactElement<P>): ReactElement<P> => {
	if (n <= 1) return el
	const { type, props } = el
	let c: ReactNode = (props as { children?: ReactNode }).children
	const T = type as JSXElementConstructor<P>
	for (let d = 0; d < n; d++) c = createElement(T, props, c)
	return c as ReactElement<P>
}

export const controlMeta = {
	input: <Input placeholder='Enter Text...' />,
	textarea: <TextArea placeholder='Enter multiple lines...' />,
	radio: <Radio />,
	radioGroup: <RadioGroup options={['First', 'Second', 'Third']} />,
	toggle: <Toggle />,
	triToggle: <TriToggle />,
	checkbox: <Checkbox />,
	range: <Range />,
	select: (
		<Select>
			<option value='' disabled>
				Select an option...
			</option>
			<option value='option1'>Option 1</option>
			<option value='option2'>Option 2</option>
			<option value='option3'>Option 3</option>
		</Select>
	),
} satisfies Record<string, ReactNode>

export type ControlName = keyof typeof controlMeta

export const buttonStyles = ['btn-outline!', 'btn-dash!', 'btn-soft!', 'btn-ghost!', 'btn-link!'] as const
export type ButtonStyle = (typeof buttonStyles)[number]

export const playingCardRanks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const
export const playingCardSuits = ['♠', '♥', '♦', '♣'] as const
export const playingCards = joinTyped(playingCardRanks, playingCardSuits, '')

export const durationUnitsWithoutMs = durationUnits.filter((x) => x !== 'milliseconds')

export const toastPositionIcons = {
	'top-left': '↖',
	'top-center': '↑',
	'top-right': '↗',
	'bottom-left': '↙',
	'bottom-center': '↓',
	'bottom-right': '↘',
} as const satisfies Record<ToastPosition, Arrow>
