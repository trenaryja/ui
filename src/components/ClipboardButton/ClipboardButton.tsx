'use client'

import type { ClassNames } from '@/types'
import { cn } from '@/utils'
import { useClipboard } from '@mantine/hooks'
import type { ComponentProps, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { LuCheck, LuCircleAlert, LuClipboard } from 'react-icons/lu'
import { Button } from '../Button/Button'
import { TimeoutBar } from '../TimeoutBar/TimeoutBar'

const DefaultIcon = <LuClipboard />
const DefaultCopiedIcon = <LuCheck />
const DefaultErrorIcon = <LuCircleAlert />

const getActiveClassName = (error: Error | null, copied: boolean, classNames: ClipboardButtonProps['classNames']) =>
	error ? classNames?.error : copied ? classNames?.copied : classNames?.default

export const clipboardButtonClassNames = ['copied', 'default', 'error', 'timeoutBar'] as const
export type ClipboardButtonClassNames = (typeof clipboardButtonClassNames)[number]

export type ClipboardButtonProps = ClassNames<ClipboardButtonClassNames> &
	Omit<ComponentProps<'button'>, 'onClick' | 'onError'> & {
		copy: (() => string) | string
		copiedChildren?: ReactNode
		errorChildren?: ReactNode
		onCopy?: (value: string) => void
		onError?: (error: Error) => void
		onTimeout?: () => void
		showTimeoutBar?: boolean
		timeout?: number
	}

export const ClipboardButton = ({
	children = DefaultIcon,
	className,
	classNames,
	copiedChildren = DefaultCopiedIcon,
	copy,
	errorChildren = DefaultErrorIcon,
	onCopy,
	onError,
	onTimeout,
	showTimeoutBar,
	timeout = 2000,
	...props
}: ClipboardButtonProps) => {
	const clipboard = useClipboard({ timeout })
	const [copyCount, setCopyCount] = useState(0)
	const wasActiveRef = useRef(false)
	const lastCopiedValueRef = useRef('')
	const { copied, error, reset } = clipboard

	const activeClassName = getActiveClassName(error, copied, classNames)

	const handleClick = () => {
		const value = typeof copy === 'function' ? copy() : copy
		lastCopiedValueRef.current = value
		clipboard.copy(value)
		setCopyCount((n) => n + 1)
	}

	useEffect(() => {
		const isActive = copied || !!error
		if (wasActiveRef.current && !isActive) onTimeout?.()
		wasActiveRef.current = isActive
		if (!copied) return
		onCopy?.(lastCopiedValueRef.current)
		// eslint-disable-next-line react-hooks/exhaustive-deps -- React Compiler handles memoization
	}, [copied, copyCount, error, onTimeout])

	useEffect(() => {
		if (!error) return
		onError?.(error)
		const id = setTimeout(reset, timeout)
		return () => clearTimeout(id)
	}, [error, onError, reset, timeout])

	const renderChildren = () => {
		if (error) return errorChildren
		if (copied) return copiedChildren
		return children
	}

	return (
		<Button
			className={cn(activeClassName, showTimeoutBar && 'has-timeout-bar', className)}
			onClick={handleClick}
			{...props}
		>
			{renderChildren()}
			<TimeoutBar
				active={!!showTimeoutBar && (copied || !!error)}
				className={classNames?.timeoutBar}
				duration={timeout}
				resetKey={copyCount}
			/>
		</Button>
	)
}
