export type AnimationTiming = {
	duration?: number // ms
	easing?: string // CSS easing
	delay?: number // ms
}

// Position indexed right-to-left: 2,1,0.-1,-2 (hundreds,tens,ones.tenths,hundredths)
export type DigitsConfig = Record<number, { max?: number }>

export type FormattedSegment = { type: 'digit'; value: number; position: number } | { type: 'static'; value: string }

export type ResolvedTiming = Required<AnimationTiming>
