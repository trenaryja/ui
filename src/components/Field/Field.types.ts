export const fieldSlots = ['label', 'hint', 'error'] as const
export type FieldSlot = (typeof fieldSlots)[number]
