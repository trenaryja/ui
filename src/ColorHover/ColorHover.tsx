export type ColorHoverProps = React.ComponentProps<'div'> & {
  as?: React.ElementType
}

export const ColorHover = ({ as = 'div', className, ...props }: ColorHoverProps) => {
  const Component = as
  return (
    <Component
      className={`relative before:bg-neutral-500 before:content-[''] before:absolute before:inset-0 before:scale-x-0 before:origin-right before:transition-transform before:z-[-1] hover:before:scale-x-100 hover:before:origin-left transition-transform ${className}`}
      {...props}
    />
  )
}
