import React from 'react'

export interface ConditionalWrapperProps {
  condition?: boolean
  children: React.ReactNode
  wrapper?: (children: React.ReactNode) => React.JSX.Element
}

export const ConditionalWrapper = ({ condition, wrapper, children }: ConditionalWrapperProps) =>
  wrapper === undefined || condition === false ? <>{children}</> : wrapper(children)
