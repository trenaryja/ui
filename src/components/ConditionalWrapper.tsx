import React from 'react'

export type ConditionalWrapperProps = {
	condition?: boolean
	children: React.ReactNode
	wrapper?: (children: React.ReactNode) => React.ReactNode
}

export const ConditionalWrapper = ({ condition, wrapper, children }: ConditionalWrapperProps) =>
	wrapper === undefined || condition === false ? <>{children}</> : wrapper(children)
