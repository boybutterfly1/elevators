export interface ElevatorT {
  id: number,
  currentFloor: number,
  targetFloor: number | null
  direction: keyof typeof Direction | null,
}
export enum Direction {
  'Up',
  'Down'
}