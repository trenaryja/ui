import { ReactNode } from 'react'

export type ConditionalWrapperProps = {
	condition?: boolean
	children: ReactNode
	wrapper?: (children: ReactNode) => ReactNode
}

export const ConditionalWrapper = ({ condition, wrapper, children }: ConditionalWrapperProps) =>
	wrapper === undefined || condition === false ? <>{children}</> : wrapper(children)
