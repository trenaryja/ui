import { RefObject } from 'react'
import { AsciiImageProps } from './AsciiImage'

export const characterRamps = {
	short: ' .:-=+*#%@',
	standard: '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^`\'.',
} as const

type Dimensions = {
	height: number
	width: number
	maxHeight?: number
	maxWidth?: number
	fontHeight: number
	fontWidth: number
}
export const clampDimensions = ({ height, width, maxHeight, maxWidth, fontHeight, fontWidth }: Dimensions) => {
	if (maxHeight === undefined && maxWidth === undefined) {
		const naturalWidth = Math.floor(width / fontWidth)
		const naturalHeight = Math.floor(height / fontHeight)
		return { width: naturalWidth, height: naturalHeight }
	}

	const adjustedWidth = Math.floor((fontHeight / fontWidth) * width)
	let newWidth = adjustedWidth
	let newHeight = height

	if (maxHeight !== undefined && newHeight > maxHeight) {
		newWidth = Math.floor((newWidth * maxHeight) / newHeight)
		newHeight = maxHeight
	}

	if (maxWidth !== undefined && newWidth > maxWidth) {
		newHeight = Math.floor((newHeight * maxWidth) / newWidth)
		newWidth = maxWidth
	}

	return { height: newHeight, width: newWidth }
}

export const getFontDimensions = (ref: RefObject<HTMLPreElement | null>) => {
	if (!ref.current) return { fontWidth: 0, fontHeight: 0 }
	const pre = document.createElement('pre')
	pre.textContent = ' '
	pre.style.position = 'absolute'
	pre.style.visibility = 'hidden'
	pre.style.pointerEvents = 'none'
	pre.style.margin = '0'
	pre.style.padding = '0'

	const computed = getComputedStyle(ref.current)
	pre.style.font = computed.font
	pre.style.letterSpacing = computed.letterSpacing
	pre.style.lineHeight = computed.lineHeight

	document.body.appendChild(pre)
	const { width, height } = pre.getBoundingClientRect()
	document.body.removeChild(pre)

	return { fontWidth: width, fontHeight: height }
}

export const getAscii = (width: number, height: number, src: CanvasImageSource, characterRamp: string) => {
	const canvas = document.createElement('canvas')
	canvas.width = width
	canvas.height = height
	const context = canvas.getContext('2d')!
	context.drawImage(src, 0, 0, width, height)
	const { data } = context.getImageData(0, 0, width, height)
	const grayScales = new Array(width * height)

	for (let i = 0, j = 0; i < data?.length; i += 4, j++) {
		const r = data[i]
		const g = data[i + 1]
		const b = data[i + 2]
		grayScales[j] = 0.21 * r + 0.72 * g + 0.07 * b
	}

	const rampLength = characterRamp.length - 1
	return grayScales
		.map((gray, i) => {
			const char = characterRamp[Math.round((rampLength * gray) / 255)]
			return (i + 1) % width === 0 ? char + '\n' : char
		})
		.join('')
}

export const getCharacterRamp = (
	characterRamp: AsciiImageProps['characterRamp'],
	reverseRamp: AsciiImageProps['reverseRamp'],
) => {
	const ramp =
		characterRamp === undefined
			? characterRamps.short
			: (characterRamps[characterRamp as keyof typeof characterRamps] ?? characterRamp)

	return reverseRamp ? ramp.split('').reverse().join('') : ramp
}
