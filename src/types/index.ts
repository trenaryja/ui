import daisyThemes from 'daisyui/theme/object'

type OmitIndexSignature<ObjectType> = {
	[KeyType in keyof ObjectType as {} extends Record<KeyType, unknown> ? never : KeyType]: ObjectType[KeyType]
}

export type Suggest<T, U> = T | (U & { __?: never })

export type ChromaColor = string | number | chroma.Color

export type DaisyThemeName = keyof OmitIndexSignature<typeof daisyThemes>
