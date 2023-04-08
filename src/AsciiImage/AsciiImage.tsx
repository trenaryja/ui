import { CSSProperties, useRef, useState } from 'react'
import { clampDimensions, getAscii, getFontDimensions } from './utils'

export type AsciiImageProps = {
  src: string
  maxHeight?: number
  maxWidth?: number
  characterRamp?: string
  showImage?: boolean
  style?: CSSProperties
  imgStyle?: CSSProperties
  preStyle?: CSSProperties
}

export const AsciiImage = ({
  src,
  maxHeight = 50,
  maxWidth = 50,
  characterRamp = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^`\'. ',
  showImage = false,
  style,
  imgStyle,
  preStyle,
}: AsciiImageProps) => {
  const [ascii, setAscii] = useState('')
  const [imgHeight, setImgHeight] = useState(0)
  const [imgWidth, setImgWidth] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

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
    const ascii = getAscii(width, height, image, characterRamp)
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
