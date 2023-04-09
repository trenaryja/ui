import { CSSProperties, useRef, useState } from 'react'
import { AnyOther } from '../utils'
import { characterRamps, clampDimensions, getAscii, getFontDimensions } from './utils'

export type AsciiImageProps = {
  src: string
  maxHeight?: number
  maxWidth?: number
  characterRamp?: keyof typeof characterRamps | AnyOther<string>
  reverseRamp?: boolean
  showImage?: boolean
  style?: CSSProperties
  imgStyle?: CSSProperties
  preStyle?: CSSProperties
}

export const AsciiImage = ({
  src,
  maxHeight = 50,
  maxWidth = 50,
  characterRamp = 'short',
  reverseRamp,
  showImage = false,
  style,
  imgStyle,
  preStyle = { fontSize: '.4em' },
}: AsciiImageProps) => {
  const [ascii, setAscii] = useState('')
  const [imgHeight, setImgHeight] = useState(0)
  const [imgWidth, setImgWidth] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  let _characterRamp =
    characterRamp in characterRamps ? characterRamps[characterRamp as keyof typeof characterRamps] : characterRamp
  if (reverseRamp) _characterRamp = _characterRamp.split('').reverse().join('')

  const image = new Image()
  image.crossOrigin = 'Anonymous'
  image.onload = () => {
    const { fontHeight, fontWidth } = getFontDimensions(ref, preStyle)
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
    setImgHeight(height * fontHeight)
    setImgWidth(width * fontWidth)
  }
  image.src = src

  return (
    <div
      ref={ref}
      style={{ display: 'grid', gridTemplateAreas: 'stack', placeItems: 'center', width: 'fit-content', ...style }}
    >
      {showImage && (
        <img
          src={src}
          style={{
            gridArea: 'stack',
            objectFit: 'cover',
            width: imgWidth,
            height: imgHeight,
            zIndex: -1,
            ...imgStyle,
          }}
        />
      )}
      <pre style={{ gridArea: 'stack', margin: 0, ...preStyle }}>{ascii}</pre>
    </div>
  )
}
