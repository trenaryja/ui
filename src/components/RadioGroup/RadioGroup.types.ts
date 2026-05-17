import type { RadioOption } from '@/hooks'
import type { ClassNames } from '@/types'
import type { ComponentProps, ComponentType } from 'react'

type BaseProps = Omit<ComponentProps<'input'>, 'children' | 'defaultValue' | 'type' | 'value'> & {
	options: readonly RadioOption[]
	value?: string
	defaultValue?: string
	/** Allow clicking a selected radio to deselect it */
	allowDeselect?: boolean
}

export type RadioGroupDefaultProps = BaseProps & ClassNames<'item'>

export type RadioGroupBtnProps = BaseProps & ClassNames<'item'>

type VariantProps = {
	default: RadioGroupDefaultProps
	btn: RadioGroupBtnProps
}

export type RadioGroupVariant = keyof VariantProps

export type RadioGroupProps =
	| (RadioGroupBtnProps & { variant: 'btn' })
	| (RadioGroupDefaultProps & { variant?: 'default' })

export type RadioGroupComponentMap = { [K in RadioGroupVariant]: ComponentType<VariantProps[K]> }
