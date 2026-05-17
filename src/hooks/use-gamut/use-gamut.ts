import type { Gamut } from '@/utils'

const detect = (): Gamut => {
	if (typeof window === 'undefined') return 'srgb'
	if (window.matchMedia('(color-gamut: rec2020)').matches) return 'rec2020'
	if (window.matchMedia('(color-gamut: p3)').matches) return 'p3'
	return 'srgb'
}

export const useGamut = detect
