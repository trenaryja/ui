'use client'

import { cn, tryIgnore } from '@/utils'
import { useUncontrolled } from '@mantine/hooks'
import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react'
import { cloneElement, useCallback, useEffect, useId, useMemo, useRef } from 'react'
import { LuX } from 'react-icons/lu'

export const MODAL_DISMISS_OPTIONS = ['closeButton', 'outsideClick', 'escapeKey'] as const
export type ModalDismissOption = (typeof MODAL_DISMISS_OPTIONS)[number]

export type ModalApi = {
	close: () => void
	open: () => void
}

export type ModalClassNames = {
	dialog: string
	box: string
	closeButton: string
	closeIcon: string
	backdrop: string
	backdropButton: string
}

export type ModalProps = {
	id?: string
	open?: boolean
	defaultOpen?: boolean
	onOpenChange?: (open: boolean) => void
	trigger?: ReactElement<ButtonHTMLAttributes<HTMLButtonElement>>
	children: ((api: ModalApi) => ReactNode) | ReactNode
	className?: string
	classNames?: Partial<ModalClassNames>
	dismissOptions?: boolean | readonly ModalDismissOption[]
	backdropBlur?: boolean
	backdropTransparent?: boolean
}

const useNativeDialog = ({
	dialogId,
	hasEscapeKey,
	open,
	setOpen,
}: {
	dialogId: string
	hasEscapeKey: boolean
	open: boolean
	setOpen: (next: boolean) => void
}) => {
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
		tryIgnore(() => el.showModal())
	}, [getDialog])

	const closeNative = useCallback(() => {
		const el = getDialog()
		if (!el || !el.open) return
		el.close()
	}, [getDialog])

	useEffect(() => {
		const el = getDialog()
		if (!el) return
		if (open && !el.open) return tryIgnore(() => el.showModal())
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

export const Modal = ({
	id,
	open,
	defaultOpen,
	onOpenChange,
	trigger,
	children,
	className,
	classNames,
	dismissOptions,
	backdropBlur,
	backdropTransparent,
}: ModalProps) => {
	const uid = useId()
	const dialogId = id ?? uid

	const [isOpen, setOpen] = useUncontrolled<boolean>({
		value: open,
		defaultValue: defaultOpen,
		finalValue: false,
		onChange: onOpenChange,
	})

	const dismissList = useMemo(() => {
		if (Array.isArray(dismissOptions)) return dismissOptions
		return {
			unset: MODAL_DISMISS_OPTIONS,
			true: MODAL_DISMISS_OPTIONS,
			false: [],
		}[dismissOptions === undefined ? 'unset' : dismissOptions ? 'true' : 'false']
	}, [dismissOptions])

	const { closeNative, onCancel, onClose, openNative } = useNativeDialog({
		dialogId,
		hasEscapeKey: dismissList.includes('escapeKey'),
		open: isOpen,
		setOpen,
	})

	const api = useMemo<ModalApi>(() => ({ close: () => setOpen(false), open: () => setOpen(true) }), [setOpen])

	const triggerEl = trigger
		? cloneElement(trigger, {
				type: trigger.props.type ?? 'button',
				'aria-haspopup': 'dialog',
				'aria-controls': dialogId,
				onClick: (e) => {
					trigger.props.onClick?.(e)
					if (e.defaultPrevented) return
					openNative()
					setOpen(true)
				},
			})
		: null

	return (
		<>
			{triggerEl}

			<dialog
				id={dialogId}
				onCancel={onCancel}
				onClose={onClose}
				className={cn(
					'modal modal-bottom sm:modal-middle overflow-visible',
					{ 'bg-transparent': backdropTransparent },
					classNames?.dialog,
				)}
			>
				<div className={cn('modal-box', className, classNames?.box)}>
					{dismissList.includes('closeButton') && (
						<div className='sticky top-0'>
							<button
								aria-label='Close'
								className={cn('absolute -top-6 -right-6 btn btn-circle btn-ghost btn-sm', classNames?.closeButton)}
								type='button'
								onClick={closeNative}
							>
								<LuX className={cn(classNames?.closeIcon)} />
							</button>
						</div>
					)}

					{typeof children === 'function' ? children(api) : children}
				</div>

				{dismissList.includes('outsideClick') && (
					<form
						className={cn('modal-backdrop', { 'backdrop-blur': backdropBlur }, classNames?.backdrop)}
						method='dialog'
					>
						<button aria-label='Close' className={cn(classNames?.backdropButton)} type='submit' />
					</form>
				)}
			</dialog>
		</>
	)
}
