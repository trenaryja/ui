import { Accordion, AccordionControlProps, AccordionItemProps, AccordionProps } from '@mantine/core'

export const ImageAccordion = ({ sx, ...rest }: AccordionProps) => (
  <Accordion
    sx={{
      display: 'grid',
      gap: '1rem',
      ...sx,
    }}
    {...rest}
  />
)

interface ImageAccordionItemProps extends AccordionItemProps {
  imageUrl: string
}

ImageAccordion.Item = ({ imageUrl, children, sx, ...rest }: ImageAccordionItemProps) => (
  <Accordion.Item
    sx={{
      borderBottom: 'none',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundImage: `url(${imageUrl})`,
      overflow: 'hidden',
      borderRadius: '1rem',
      ...sx,
    }}
    {...rest}
  >
    {children}
  </Accordion.Item>
)

ImageAccordion.Control = ({ children, sx, ...rest }: AccordionControlProps) => (
  <Accordion.Control sx={{ ':hover': { backgroundColor: 'transparent' }, ...sx }} {...rest}>
    {children}
  </Accordion.Control>
)

ImageAccordion.Panel = Accordion.Panel
