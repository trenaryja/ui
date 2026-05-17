import type { ComponentType, ReactNode, RefObject } from 'react'
import { createElement } from 'react'
import { createPortal } from 'react-dom'

export const isServer = typeof window === 'undefined'

export const loadImage = (src: string): Promise<HTMLImageElement> =>
	new Promise((resolve, reject) => {
		const img = new Image()
		img.crossOrigin = 'Anonymous'
		img.onload = () => resolve(img)
		img.onerror = reject
		img.src = src
	})

/** Render content into `target` via createPortal if set, otherwise return content as-is. */
export const maybePortal = (content: ReactNode, target?: RefObject<HTMLElement | null>) =>
	target?.current ? createPortal(content, target.current) : content

/** Extract a custom component from a slot value, treating booleans/null as "no override". */
export const slotComponents = <T>(slot: boolean | T | undefined): T | undefined =>
	typeof slot === 'boolean' || slot == null ? undefined : slot

type WithBase = { className?: string; children: ReactNode }

/** Render `Container` with `props` if set, otherwise wrap children in a fallback element. */
export const maybeContainer = <P extends WithBase>(
	Container: ComponentType<P> | undefined,
	defaultEl: 'div' | 'span' | 'ul',
	props: P,
) =>
	Container ? createElement(Container, props) : createElement(defaultEl, { className: props.className }, props.children)
