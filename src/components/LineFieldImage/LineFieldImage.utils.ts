import { rgbToLuma } from '@/utils'

export type ImgData = { width: number; height: number; lines: string }

export const processImageToLines = (img: HTMLImageElement, cellSize: number): ImgData => {
	const { width: w, height: h } = img
	const nx = Math.ceil(w / cellSize)
	const ny = Math.ceil(h / cellSize)
	const canvas = document.createElement('canvas')
	canvas.width = nx
	canvas.height = ny
	const ctx = canvas.getContext('2d', { willReadFrequently: true })!
	ctx.drawImage(img, 0, 0, nx, ny)
	const { data } = ctx.getImageData(0, 0, nx, ny)

	const offset = ((cellSize * 1.4) / 2) * Math.SQRT1_2
	const scaleX = w / nx
	const scaleY = h / ny

	const parts = new Array<string>(nx * ny)
	let partIndex = 0
	let dataIndex = 0

	for (let y = 0; y < ny; y++) {
		const cy = (y + 0.5) * scaleY

		for (let x = 0; x < nx; x++) {
			const brightness = rgbToLuma(data[dataIndex], data[dataIndex + 1], data[dataIndex + 2])
			dataIndex += 4
			const dy = brightness < 128 ? offset : -offset
			const cx = (x + 0.5) * scaleX
			parts[partIndex++] = `<line x1="${cx - offset}" y1="${cy - dy}" x2="${cx + offset}" y2="${cy + dy}"/>`
		}
	}

	return { width: w, height: h, lines: `<g>${parts.join('')}</g>` }
}
