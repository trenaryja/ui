'use client'

import type { ClassNames } from '@/types'
import { cn } from '@/utils'
import { useClickOutside, useMergedRef, useUncontrolled } from '@mantine/hooks'
import type { ComponentProps, FocusEvent, MouseEvent, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '../Button/Button'
import { TimeoutBar } from '../TimeoutBar/TimeoutBar'

export const confirmButtonClassNames = ['confirm', 'default', 'pending', 'timeoutBar'] as const
export type ConfirmButtonClassNames = (typeof confirmButtonClassNames)[number]

export const CONFIRM_BUTTON_CANCEL_OPTIONS = ['blur', 'escapeKey', 'outsideClick'] as const
export type ConfirmButtonCancelOption = (typeof CONFIRM_BUTTON_CANCEL_OPTIONS)[number]

const resolveCancelOptions = (
	cancelOptions: boolean | readonly ConfirmButtonCancelOption[] | undefined,
): readonly ConfirmButtonCancelOption[] => {
	if (Array.isArray(cancelOptions)) return cancelOptions
	return {
		unset: CONFIRM_BUTTON_CANCEL_OPTIONS,
		true: CONFIRM_BUTTON_CANCEL_OPTIONS,
		false: [],
	}[cancelOptions === undefined ? 'unset' : cancelOptions ? 'true' : 'false']
}

export type ConfirmButtonProps = ClassNames<ConfirmButtonClassNames> &
	Omit<ComponentProps<'button'>, 'onClick'> & {
		cancelOptions?: boolean | readonly ConfirmButtonCancelOption[]
		confirmChildren?: ReactNode
		isAwaitingConfirmation?: boolean
		onCancel?: () => void
		onChange?: (isAwaitingConfirmation: boolean) => void
		onConfirm: (e: MouseEvent<HTMLButtonElement>) => unknown | Promise<unknown>
		onTimeout?: () => void
		pendingChildren?: ReactNode
		showTimeoutBar?: boolean
		timeout?: number
	}

export const ConfirmButton = ({
	children,
	className,
	classNames,
	cancelOptions,
	confirmChildren,
	disabled,
	isAwaitingConfirmation: isAwaitingConfirmationProp,
	onBlur,
	onCancel,
	onChange,
	onConfirm,
	onTimeout,
	pendingChildren,
	ref,
	showTimeoutBar,
	timeout = 2000,
	...props
}: ConfirmButtonProps) => {
	const cancelList = resolveCancelOptions(cancelOptions)
	const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)
	const isPointerActiveRef = useRef(false)
	const [isPending, setIsPending] = useState(false)
	const [isAwaitingConfirmation, setIsAwaitingConfirmation] = useUncontrolled({
		value: isAwaitingConfirmationProp,
		defaultValue: false,
		onChange,
	})

	const cancel = () => {
		clearTimeout(timeoutRef.current!)
		setIsAwaitingConfirmation(false)
		onCancel?.()
	}

	const buttonRef = useClickOutside<HTMLButtonElement>(() => {
		if (cancelList.includes('outsideClick') && isAwaitingConfirmation) cancel()
	})

	const mergedRef = useMergedRef(buttonRef, ref)

	useEffect(() => {
		if (!isAwaitingConfirmation || !cancelList.includes('escapeKey')) return

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') cancel()
		}

		window.addEventListener('keydown', onKeyDown)
		return () => window.removeEventListener('keydown', onKeyDown)
		// eslint-disable-next-line react-hooks/exhaustive-deps -- React Compiler handles memoization
	}, [isAwaitingConfirmation, cancelList])

	useEffect(() => {
		const onPointerDown = () => {
			isPointerActiveRef.current = true
		}

		const onPointerUp = () => {
			isPointerActiveRef.current = false
		}

		document.addEventListener('pointerdown', onPointerDown)
		document.addEventListener('pointerup', onPointerUp)

		return () => {
			document.removeEventListener('pointerdown', onPointerDown)
			document.removeEventListener('pointerup', onPointerUp)
		}
	}, [])

	useEffect(() => () => clearTimeout(timeoutRef.current!), [])

	const activeClassName = isPending
		? (classNames?.pending ?? classNames?.confirm)
		: isAwaitingConfirmation
			? classNames?.confirm
			: classNames?.default

	const handleBlur = (e: FocusEvent<HTMLButtonElement>) => {
		if (cancelList.includes('blur') && isAwaitingConfirmation && !isPointerActiveRef.current) cancel()
		onBlur?.(e)
	}

	const renderChildren = () => {
		if (isPending) return pendingChildren ?? confirmChildren ?? children
		if (isAwaitingConfirmation) return confirmChildren ?? children
		return children
	}

	const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
		if (!isAwaitingConfirmation) {
			setIsAwaitingConfirmation(true)
			timeoutRef.current = setTimeout(() => {
				cancel()
				onTimeout?.()
			}, timeout)
		} else {
			clearTimeout(timeoutRef.current!)
			setIsAwaitingConfirmation(false)
			const result = onConfirm(e)

			if (result instanceof Promise) {
				setIsPending(true)
				result.finally(() => setIsPending(false))
			}
		}
	}

	return (
		<Button
			ref={mergedRef}
			className={cn(activeClassName, showTimeoutBar && 'has-timeout-bar', className)}
			disabled={isPending || disabled}
			onBlur={handleBlur}
			onClick={handleClick}
			{...props}
		>
			{renderChildren()}
			<TimeoutBar
				active={!!showTimeoutBar && isAwaitingConfirmation}
				className={classNames?.timeoutBar}
				duration={timeout}
			/>
		</Button>
	)
}
