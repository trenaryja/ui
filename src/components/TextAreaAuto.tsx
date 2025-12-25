'use client'

import { cn } from '@/utils'
import { useElementSize, useIsomorphicEffect, useMergedRef } from '@mantine/hooks'
import type { ComponentProps } from 'react'
import { useCallback, useRef } from 'react'

export type TextAreaAutoProps = ComponentProps<'textarea'>

export const TextAreaAuto = ({ className, onChange, ...props }: TextAreaAutoProps) => {
	const innerRef = useRef<HTMLTextAreaElement | null>(null)
	const { ref: sizeRef, width } = useElementSize()

	const ref = useMergedRef<HTMLTextAreaElement>(props.ref, sizeRef, (el) => {
		innerRef.current = el
	})

	const resize = useCallback(() => {
		const textarea = innerRef.current
		if (!textarea) return

		const pageScrollY = window.scrollY
		const pageScrollX = window.scrollX
		const prevTop = textarea.scrollTop

		const { minHeight, maxHeight } = getComputedStyle(textarea)
		const minH = Number.parseFloat(minHeight) || 0
		const maxHeightPx = Number.parseFloat(maxHeight)
		const maxH = Number.isFinite(maxHeightPx) ? maxHeightPx : Infinity

		textarea.style.height = 'auto'
		const contentHeight = textarea.scrollHeight
		const nextH = Math.max(minH, Math.min(maxH, contentHeight))

		textarea.style.height = `${nextH}px`
		textarea.style.overflowY = contentHeight > nextH ? 'auto' : 'hidden'
		textarea.scrollTop = prevTop

		if (window.scrollY !== pageScrollY || window.scrollX !== pageScrollX) {
			window.scrollTo(pageScrollX, pageScrollY)
		}
	}, [])

	useIsomorphicEffect(() => resize(), [resize, props.value, props.defaultValue])
	useIsomorphicEffect(() => {
		if (width) resize()
	}, [width, resize])

	return (
		<textarea
			{...props}
			className={cn('textarea resize-none', className)}
			ref={ref}
			onChange={(e) => {
				onChange?.(e)
				resize()
			}}
		/>
	)
}
