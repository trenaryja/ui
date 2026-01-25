'use client'

import { useMounted } from '@mantine/hooks'
import type { ThemePickerComponentMap, ThemePickerProps } from './ThemePicker.types'
import { ThemePickerModal, ThemePickerPopover, ThemePickerToggle, ThemePickerToggle3Way } from './variants'

export * from './ThemePicker.types'

const VARIANT_COMPONENTS: ThemePickerComponentMap = {
	modal: ThemePickerModal,
	popover: ThemePickerPopover,
	toggle: ThemePickerToggle,
	'toggle-3way': ThemePickerToggle3Way,
}

export const ThemePicker = ({ variant = 'toggle', ...rest }: ThemePickerProps) => {
	const mounted = useMounted()

	if (!mounted) return <div className='loading loading-spinner' />

	const Component = VARIANT_COMPONENTS[variant]
	return <Component {...rest} />
}
