import type { PopoverPosition } from '@/hooks'
import type { ClassNames } from '@/types'
import type { ButtonHTMLAttributes, ComponentType, ReactElement, ReactNode } from 'react'
import type { ModalProps } from '../Modal/Modal'

type Base = { className?: string }

type Icons = { iconDark?: ReactNode; iconLight?: ReactNode }

type Trigger = { trigger?: ReactElement<ButtonHTMLAttributes<HTMLButtonElement>> }

export type ThemePickerToggleProps = Base & ClassNames<'button' | 'icon' | 'label'> & Icons & { showLabel?: boolean }

export type ThemePickerToggle3WayProps = Base & ClassNames<'icon' | 'toggle'> & Icons & { iconSystem?: ReactNode }

export type ThemePickerPopoverProps = Base &
	ClassNames<'button' | 'content' | 'list' | 'popover' | 'search'> &
	Trigger & { position?: PopoverPosition; showSearch?: boolean }

export type ThemePickerModalProps = Base &
	ClassNames<'button' | 'card' | 'defaultTrigger' | 'grid' | 'list' | 'search'> &
	Trigger & {
		modalProps?: Partial<Omit<ModalProps, 'children' | 'trigger'>>
		showPreview?: boolean
		showSearch?: boolean
	}

// Variant registry
type VariantProps = {
	modal: ThemePickerModalProps
	popover: ThemePickerPopoverProps
	toggle: ThemePickerToggleProps
	'toggle-3way': ThemePickerToggle3WayProps
}

export type ThemePickerVariant = keyof VariantProps

export type ThemePickerProps =
	| (ThemePickerModalProps & { variant: 'modal' })
	| (ThemePickerPopoverProps & { variant: 'popover' })
	| (ThemePickerToggle3WayProps & { variant: 'toggle-3way' })
	| (ThemePickerToggleProps & { variant?: 'toggle' })

export type ThemePickerComponentMap = { [K in ThemePickerVariant]: ComponentType<VariantProps[K]> }
