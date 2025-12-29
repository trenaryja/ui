/* eslint-disable no-plusplus */
import { useCallback, useEffect, useRef, useState } from 'react'

export const characterRamps = [' .:-=+*#%@'] as const

const getFontDimensions = (ref: HTMLPreElement | null) => {
	if (!ref) return { fontWidth: 0, fontHeight: 0 }
	const pre = document.createElement('pre')
	pre.textContent = ' '
	pre.style.position = 'absolute'
	pre.style.visibility = 'hidden'
	pre.style.pointerEvents = 'none'
	pre.style.margin = '0'
	pre.style.padding = '0'

	const computed = getComputedStyle(ref)
	pre.style.font = computed.font
	pre.style.letterSpacing = computed.letterSpacing
	pre.style.lineHeight = computed.lineHeight

	document.body.appendChild(pre)
	const { width, height } = pre.getBoundingClientRect()
	document.body.removeChild(pre)

	return { fontWidth: width, fontHeight: height }
}

const createLookupTable = (characterRamp: string): string[] => {
	const table = new Array<string>(256)
	const rampLength = characterRamp.length - 1
	for (let i = 0; i < 256; i++) {
		table[i] = characterRamp[Math.floor((rampLength * i) / 255) % (characterRamp.length - 1)] ?? ' '
	}
	return table
}

const clampDimensions = ({
	sourceWidth,
	sourceHeight,
	fontHeight,
	fontWidth,
	maxHeight,
	maxWidth,
}: {
	sourceWidth: number
	sourceHeight: number
	fontHeight: number
	fontWidth: number
	maxHeight?: number
	maxWidth?: number
}) => {
	if (maxHeight === undefined && maxWidth === undefined) {
		return { width: Math.floor(sourceWidth / fontWidth), height: Math.floor(sourceHeight / fontHeight) }
	}

	let width = Math.floor((fontHeight / fontWidth) * sourceWidth)
	let height = sourceHeight

	if (maxHeight !== undefined && height > maxHeight) {
		width = Math.floor((width * maxHeight) / height)
		height = maxHeight
	}

	if (maxWidth !== undefined && width > maxWidth) {
		height = Math.floor((height * maxWidth) / width)
		width = maxWidth
	}

	return { width, height }
}

const processPixels = ({
	width,
	height,
	data,
	lookupTable,
}: {
	width: number
	height: number
	data: Uint8ClampedArray
	lookupTable: string[]
}) => {
	const chars = new Array<string>(width * height + height)
	let charIndex = 0
	let dataIndex = 0

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const gray = (21 * data[dataIndex] + 72 * data[dataIndex + 1] + 7 * data[dataIndex + 2]) >> 8 // eslint-disable-line no-bitwise
			chars[charIndex++] = lookupTable[gray]
			dataIndex += 4
		}
		chars[charIndex++] = '\n'
	}

	return chars.join('')
}

type AsciiProcessOptions = {
	characterRamp?: string
	reverseRamp?: boolean
	maxHeight?: number
	maxWidth?: number
}

export const useAscii = (options: AsciiProcessOptions) => {
	const { characterRamp = characterRamps[0], reverseRamp, maxHeight, maxWidth } = options

	const preRef = useRef<HTMLPreElement>(null)
	const configRef = useRef({
		fontHeight: 0,
		fontWidth: 0,
		maxHeight,
		maxWidth,
		lookupTable: null as string[] | null,
	})

	const [ascii, setAscii] = useState('')
	const [fontDimensions, setFontDimensions] = useState(() => getFontDimensions(null))

	const processSource = useCallback((source: CanvasImageSource) => {
		const { fontHeight, fontWidth, maxHeight: cfgMaxHeight, maxWidth: cfgMaxWidth, lookupTable } = configRef.current

		const { width: sourceWidth, height: sourceHeight } =
			source instanceof HTMLVideoElement
				? { width: source.videoWidth, height: source.videoHeight }
				: { width: (source as { width: number }).width, height: (source as { height: number }).height }

		const { width, height } = clampDimensions({
			sourceWidth,
			sourceHeight,
			fontHeight,
			fontWidth,
			maxHeight: cfgMaxHeight,
			maxWidth: cfgMaxWidth,
		})

		const canvas = document.createElement('canvas')
		canvas.width = width
		canvas.height = height
		const context = canvas.getContext('2d', { willReadFrequently: true })!
		context.drawImage(source, 0, 0, width, height)
		const { data } = context.getImageData(0, 0, width, height)

		return processPixels({ width, height, data, lookupTable: lookupTable ?? createLookupTable(' .:-=+*#@') })
	}, [])

	useEffect(() => {
		const observer = new ResizeObserver(() => {
			setFontDimensions(getFontDimensions(preRef.current))
		})
		if (preRef.current) observer.observe(preRef.current)
		return () => observer.disconnect()
	}, [preRef])

	useEffect(() => {
		const { fontHeight, fontWidth } = fontDimensions
		const ramp = reverseRamp ? characterRamp.split('').reverse().join('') : characterRamp
		const lookupTable = createLookupTable(ramp)

		configRef.current = { fontHeight, fontWidth, maxHeight, maxWidth, lookupTable }
	}, [characterRamp, reverseRamp, maxHeight, maxWidth, fontDimensions])

	return { preRef, ascii, setAscii, processSource }
}
