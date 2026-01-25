import type { ToastPosition } from '@/components'
import { Checkbox, Input, RadioGroup, Range, Select, TextArea, Toggle } from '@/components'
import type { Arrow } from '@/utils'
import { durationUnits, joinTyped } from '@/utils'
import type { JSXElementConstructor, ReactElement, ReactNode } from 'react'
import { createElement } from 'react'

export const picsum = async (size = 500) => await fetch(`https://picsum.photos/${size}`).then((res) => res.url)

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
	radioGroup: <RadioGroup options={['First', 'Second', 'Third']} />,
	toggle: <Toggle />,
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
