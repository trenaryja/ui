import { attempt } from '@/utils'
import { useCallback, useEffect, useRef } from 'react'

export type UseNativeDialogOptions = {
	dialogId: string
	hasEscapeKey: boolean
	open: boolean
	setOpen: (next: boolean) => void
}

export const useNativeDialog = ({ dialogId, hasEscapeKey, open, setOpen }: UseNativeDialogOptions) => {
	const getDialog = useCallback(() => {
		if (typeof document === 'undefined') return null
		const el = document.getElementById(dialogId)
		return el instanceof HTMLDialogElement ? el : null
	}, [dialogId])

	const openRef = useRef(open)
	useEffect(() => {
		openRef.current = open
	}, [open])

	const hasEscapeKeyRef = useRef(hasEscapeKey)
	useEffect(() => {
		hasEscapeKeyRef.current = hasEscapeKey
	}, [hasEscapeKey])

	const lastCloseWasCancelRef = useRef(false)

	const openNative = useCallback(() => {
		const el = getDialog()
		if (!el || el.open) return
		attempt(() => el.showModal())
	}, [getDialog])

	const closeNative = useCallback(() => {
		const el = getDialog()
		if (!el || !el.open) return
		el.close()
	}, [getDialog])

	useEffect(() => {
		const el = getDialog()
		if (!el) return
		if (open && !el.open) return attempt(() => el.showModal())
		if (!open && el.open) el.close()
	}, [getDialog, open])

	const onCancel = useCallback((e: React.SyntheticEvent<HTMLDialogElement>) => {
		lastCloseWasCancelRef.current = true
		if (hasEscapeKeyRef.current) return
		e.preventDefault()
		e.stopPropagation()
	}, [])

	const onClose = useCallback(() => {
		const wasCancel = lastCloseWasCancelRef.current
		lastCloseWasCancelRef.current = false

		setOpen(false)

		if (hasEscapeKeyRef.current) return
		if (!wasCancel) return
		if (!openRef.current) return

		openNative()
		setOpen(true)
	}, [openNative, setOpen])

	return { closeNative, onCancel, onClose, openNative }
}
