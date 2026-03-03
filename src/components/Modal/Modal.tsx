'use client'

import { useNativeDialog } from '@/hooks'
import type { ClassNames } from '@/types'
import { cn } from '@/utils'
import { useUncontrolled } from '@mantine/hooks'
import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react'
import { cloneElement, useId } from 'react'
import { LuX } from 'react-icons/lu'
import { MODAL_DISMISS_OPTIONS, resolveDismissOptions } from './Modal.utils'

export type ModalDismissOption = (typeof MODAL_DISMISS_OPTIONS)[number]
export { MODAL_DISMISS_OPTIONS }

export type ModalApi = {
	close: () => void
	open: () => void
}

export const modalClassNames = ['backdrop', 'backdropButton', 'box', 'closeButton', 'closeIcon', 'dialog'] as const

export type ModalClassNames = (typeof modalClassNames)[number]

export type ModalProps = ClassNames<ModalClassNames> & {
	id?: string
	open?: boolean
	defaultOpen?: boolean
	onOpenChange?: (open: boolean) => void
	trigger?: ReactElement<ButtonHTMLAttributes<HTMLButtonElement>>
	children: ((api: ModalApi) => ReactNode) | ReactNode
	className?: string
	dismissOptions?: boolean | readonly ModalDismissOption[]
	backdropBlur?: boolean
	backdropTransparent?: boolean
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
	const fallbackId = useId()
	const dialogId = id ?? fallbackId

	const [isOpen, setOpen] = useUncontrolled<boolean>({
		value: open,
		defaultValue: defaultOpen,
		finalValue: false,
		onChange: onOpenChange,
	})

	const dismissList = resolveDismissOptions(dismissOptions)

	const { closeNative, onCancel, onClose, openNative } = useNativeDialog({
		dialogId,
		hasEscapeKey: dismissList.includes('escapeKey'),
		open: isOpen,
		setOpen,
	})

	const api: ModalApi = { close: () => setOpen(false), open: () => setOpen(true) }

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
						<button
							aria-label='Close'
							className={cn('absolute top-0 right-0 btn btn-circle btn-ghost btn-sm', classNames?.closeButton)}
							type='button'
							onClick={closeNative}
						>
							<LuX className={classNames?.closeIcon} />
						</button>
					)}

					{typeof children === 'function' ? children(api) : children}
				</div>

				{dismissList.includes('outsideClick') ? (
					<form
						className={cn('modal-backdrop', { 'backdrop-blur': backdropBlur }, classNames?.backdrop)}
						method='dialog'
					>
						<button aria-label='Close' className={classNames?.backdropButton} type='submit' />
					</form>
				) : (
					<div className={cn('modal-backdrop', { 'backdrop-blur': backdropBlur }, classNames?.backdrop)} />
				)}
			</dialog>
		</>
	)
}
