export type ImgData = { width: number; height: number; lines: string }

export const processImageToLines = (img: HTMLImageElement, cellSize: number, callback: (data: ImgData) => void) => {
	const { width: w, height: h } = img
	const nx = Math.ceil(w / cellSize)
	const ny = Math.ceil(h / cellSize)
	const canvas = document.createElement('canvas')
	canvas.width = nx
	canvas.height = ny
	const ctx = canvas.getContext('2d')!
	ctx.drawImage(img, 0, 0, nx, ny)
	const { data } = ctx.getImageData(0, 0, nx, ny)

	let lines = ''

	for (let y = 0; y < ny; y++) {
		for (let x = 0; x < nx; x++) {
			const i = (y * nx + x) * 4
			const brightness = 0.21 * data[i] + 0.72 * data[i + 1] + 0.07 * data[i + 2]
			const isDark = brightness < 128
			const angle = isDark ? Math.PI / 4 : -Math.PI / 4
			const cx = (x + 0.5) * (w / nx)
			const cy = (y + 0.5) * (h / ny)
			const len = cellSize * 1.4
			const dx = (len / 2) * Math.cos(angle)
			const dy = (len / 2) * Math.sin(angle)
			lines += `<line x1="${cx - dx}" y1="${cy - dy}" x2="${cx + dx}" y2="${cy + dy}" />\n`
		}
	}

	callback({ width: w, height: h, lines })
}
