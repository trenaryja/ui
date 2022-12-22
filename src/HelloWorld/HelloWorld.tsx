export type HexGridProps = {
  value?: string
}

export const HexGrid = ({ value = 'Hello World' }: HexGridProps) => <h1>{value}</h1>
