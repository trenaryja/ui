'use client'

import React from 'react'
import { AnyOther, cn } from '../utils'
import { characterRamps, clampDimensions, getAscii, getFontDimensions } from './utils'

export type AsciiImageProps = {
  src: string
  maxHeight?: number
  maxWidth?: number
  characterRamp?: keyof typeof characterRamps | AnyOther<string>
  reverseRamp?: boolean
  showImage?: boolean
  preClassName?: string
}

export const AsciiImage = ({
  src,
  maxHeight = 50,
  maxWidth = 50,
  characterRamp = 'short',
  reverseRamp,
  showImage,
  preClassName,
}: AsciiImageProps) => {
  const [ascii, setAscii] = React.useState('')
  const ref = React.useRef<React.ElementRef<'div'>>(null)

  let _characterRamp =
    characterRamp === undefined
      ? characterRamps.short
      : characterRamp in characterRamps
        ? characterRamps[characterRamp as keyof typeof characterRamps]
        : characterRamp
  if (reverseRamp) _characterRamp = _characterRamp.split('').reverse().join('')

  React.useEffect(() => {
    const image = new Image()
    image.crossOrigin = 'Anonymous'
    image.onload = () => {
      const { fontHeight, fontWidth } = getFontDimensions(ref)
      const { width, height } = clampDimensions({
        width: image.width,
        height: image.height,
        maxHeight,
        maxWidth,
        fontHeight,
        fontWidth,
      })
      const ascii = getAscii(width, height, image, _characterRamp)
      setAscii(ascii)
    }
    image.src = src
  }, [src, maxHeight, maxWidth, _characterRamp])

  return (
    <div ref={ref} className='grid *:col-span-full *:row-span-full place-items-start'>
      <pre
        className={cn('bg-cover bg-no-repeat w-fit text-[.4rem]', preClassName)}
        style={{ backgroundImage: showImage ? `url(${src})` : '' }}
      >
        {ascii}
      </pre>
    </div>
  )
}
