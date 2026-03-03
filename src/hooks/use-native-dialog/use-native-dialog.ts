import { attempt } from '@/utils'
import type { SyntheticEvent } from 'react'
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

	// eslint-disable-next-line react-hooks/exhaustive-deps -- React Compiler handles memoization
	const openNative = () => {
		const el = getDialog()
		if (!el || el.open) return
		attempt(() => el.showModal())
		focusAutofocus(el)
	}

	// eslint-disable-next-line react-hooks/exhaustive-deps -- React Compiler handles memoization
	const closeNative = () => {
		const el = getDialog()
		if (!el || !el.open) return
		el.close()
	}

	const onCancel = (e: SyntheticEvent<HTMLDialogElement>) => {
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
		if (open) openNative()
		else closeNative()
	}, [closeNative, dialogId, open, openNative])

	return { closeNative, onCancel, onClose, openNative }
}
