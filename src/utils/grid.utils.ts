import { joinTyped } from './type.utils'

export const arrows = ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖'] as const
export type Arrow = (typeof arrows)[number]

export const flexPlacements = ['start', 'center', 'end'] as const
export type FlexPlacement = (typeof flexPlacements)[number]

export const directionPlacements = ['top', 'bottom', 'left', 'right'] as const
export type DirectionPlacement = (typeof directionPlacements)[number]

export const placementOptions = joinTyped(directionPlacements, flexPlacements, '-')
export type Placement = (typeof placementOptions)[number]
