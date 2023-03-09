export const convertToGrayScales = (context: CanvasRenderingContext2D | null, width: number, height: number) => {
  if (context === null) return []
  const imageData = context.getImageData(0, 0, width, height)

  const grayScales = []

  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i]
    const g = imageData.data[i + 1]
    const b = imageData.data[i + 2]

    const grayScale = 0.21 * r + 0.72 * g + 0.07 * b
    imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = grayScale

    grayScales.push(grayScale)
  }

  context.putImageData(imageData, 0, 0)

  return grayScales
}

export type ClampDimensionOptions = {
  height: number
  width: number
  maxHeight: number
  maxWidth: number
  fontHeight: number
  fontWidth: number
}
export const clampDimensions = (options: ClampDimensionOptions) => {
  const { height, width, maxHeight, maxWidth, fontHeight, fontWidth } = options

  const rectifiedWidth = Math.floor((fontHeight / fontWidth) * width)

  if (height > maxHeight) {
    const reducedWidth = Math.floor((rectifiedWidth * maxHeight) / height)
    return { height: maxHeight, width: reducedWidth }
  }

  if (width > maxWidth) {
    const reducedHeight = Math.floor((height * maxWidth) / rectifiedWidth)
    return { height: reducedHeight, width: maxWidth }
  }

  return { height: height, width: rectifiedWidth }
}

export const convertToAscii = (grayScales: number[], width: number, characterRamp: string) => {
  return grayScales.reduce((asciiImage, grayScale, index) => {
    let nextChars = characterRamp[Math.ceil(((characterRamp.length - 1) * grayScale) / 255)]
    if ((index + 1) % width === 0) nextChars += '\n'
    return asciiImage + nextChars
  }, '')
}

export const getFontDimensions = () => {
  const pre = document.createElement('pre')
  pre.style.display = 'inline'
  pre.textContent = ' '
  document.body.appendChild(pre)
  const { width, height } = pre.getBoundingClientRect()
  document.body.removeChild(pre)
  return { fontWidth: width, fontHeight: height }
}

export const getAscii = (width: number, height: number, image: HTMLImageElement, characterRamp: string) => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  context?.drawImage(image, 0, 0, width, height)
  const grayScales = convertToGrayScales(context, width, height)
  const ascii = convertToAscii(grayScales, width, characterRamp)
  return ascii
}
