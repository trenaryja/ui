import type { RadioOption } from '@/hooks'
import type { ComponentProps, ComponentType } from 'react'

type BaseProps = Omit<ComponentProps<'input'>, 'children' | 'defaultValue' | 'type' | 'value'> & {
	options: RadioOption[]
	value?: string
	defaultValue?: string
}

export type RadioGroupDefaultProps = BaseProps

export type RadioGroupBtnProps = BaseProps & {
	classNames?: Partial<Record<'container' | 'item', string>>
}

type VariantProps = {
	default: RadioGroupDefaultProps
	btn: RadioGroupBtnProps
}

export type RadioGroupVariant = keyof VariantProps

export type RadioGroupProps =
	| (RadioGroupBtnProps & { variant: 'btn' })
	| (RadioGroupDefaultProps & { variant?: 'default' })

export type RadioGroupComponentMap = { [K in RadioGroupVariant]: ComponentType<VariantProps[K]> }
