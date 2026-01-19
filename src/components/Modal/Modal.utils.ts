import type { ModalDismissOption } from './Modal'

export const MODAL_DISMISS_OPTIONS = ['closeButton', 'outsideClick', 'escapeKey'] as const

export const resolveDismissOptions = (
	dismissOptions: boolean | readonly ModalDismissOption[] | undefined,
): readonly ModalDismissOption[] => {
	if (Array.isArray(dismissOptions)) return dismissOptions
	return {
		unset: MODAL_DISMISS_OPTIONS,
		true: MODAL_DISMISS_OPTIONS,
		false: [],
	}[dismissOptions === undefined ? 'unset' : dismissOptions ? 'true' : 'false']
}
