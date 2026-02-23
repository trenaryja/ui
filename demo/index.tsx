import type { ToastPosition } from '@/components'
import { Checkbox, Input, Radio, RadioGroup, Range, Select, TextArea, Toggle, TriToggle } from '@/components'
import type { Arrow } from '@/utils'
import { durationUnits, joinTyped } from '@/utils'
import type { JSXElementConstructor, ReactElement, ReactNode } from 'react'
import { createElement, useEffect, useState } from 'react'

export * from './meta'

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
