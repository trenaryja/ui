/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Property } from 'csstype'

export type ColorHoverProps = {
  color: Property.BackgroundColor | null | undefined
  as?: React.ElementType
  children: React.ReactNode
  style?: React.CSSProperties
}

export const ColorHover = ({ color, as = 'div', children, ...rest }: ColorHoverProps) => {
  const Component = as
  return (
    <Component
      css={css({
        position: 'relative',
        ':before': {
          backgroundColor: color ?? undefined,
          content: '""',
          inset: 0,
          position: 'absolute',
          transform: 'scaleX(0)',
          transformOrigin: 'right',
          transition: 'transform 250ms ease-in-out',
          zIndex: -1,
        },
        ':hover': {
          ':before': {
            transform: 'scaleX(1)',
            transformOrigin: 'left',
          },
        },
      })}
      {...rest}
    >
      {children}
    </Component>
  )
}
