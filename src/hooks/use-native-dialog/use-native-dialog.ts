import { attempt } from '@/utils'
import { useEffect, useRef } from 'react'

const focusAutofocus = (el: HTMLElement) =>
	requestAnimationFrame(() => el.querySelector<HTMLElement>('[autofocus]')?.focus())

export type UseNativeDialogOptions = {
	dialogId: string
	hasEscapeKey: boolean
	open: boolean
	setOpen: (next: boolean) => void
}

export const useNativeDialog = ({ dialogId, hasEscapeKey, open, setOpen }: UseNativeDialogOptions) => {
	const lastCloseWasCancelRef = useRef(false)

	const getDialog = () => {
		if (typeof document === 'undefined') return null
		const el = document.getElementById(dialogId)
		return el instanceof HTMLDialogElement ? el : null
	}

	const openNative = () => {
		const el = getDialog()
		if (!el || el.open) return
		attempt(() => el.showModal())
		focusAutofocus(el)
	}

	const closeNative = () => {
		const el = getDialog()
		if (!el || !el.open) return
		el.close()
	}

	const onCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
		lastCloseWasCancelRef.current = true
		if (hasEscapeKey) return
		e.preventDefault()
		e.stopPropagation()
	}

	const onClose = () => {
		const wasCancel = lastCloseWasCancelRef.current
		lastCloseWasCancelRef.current = false

		setOpen(false)

		if (hasEscapeKey) return
		if (!wasCancel) return
		if (!open) return

		openNative()
		setOpen(true)
	}

	useEffect(() => {
		const el = document.getElementById(dialogId)
		if (!(el instanceof HTMLDialogElement)) return
		if (open && !el.open) {
			attempt(() => el.showModal())
			focusAutofocus(el)
			return
		}
		if (!open && el.open) el.close()
	}, [dialogId, open])

	return { closeNative, onCancel, onClose, openNative }
}
