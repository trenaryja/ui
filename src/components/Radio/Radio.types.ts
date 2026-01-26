import type { ComponentProps } from 'react'

type BaseProps = Omit<ComponentProps<'input'>, 'type'>

export type RadioDefaultProps = BaseProps & {
	variant?: 'default'
}

// TODO: Support ReactNode children via readOnlyLabelWrapper pattern for icons/custom content
export type RadioBtnProps = BaseProps & {
	variant: 'btn'
	'aria-label': string
}

export type RadioProps = RadioBtnProps | RadioDefaultProps
