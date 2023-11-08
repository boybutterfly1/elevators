import {defineStore} from 'pinia'
import {ref} from "vue"
import {ElevatorT} from "@/types/types"
export const useElevatorStore = defineStore('elevator', () => {
  const elevatorsCount = ref(1)
  const floorsCount = ref(10)
  const elevators = ref<ElevatorT[]>([])
  const floorsQueue = ref<number[]>([])

  function callElevator(floor: number) {
    if (!elevators.value.some((elevator: ElevatorT) => elevator.targetFloor === floor)) {
      floorsQueue.value.push(floor)
      elevatorMoveTo(floor)
    }
  }
  function findNearestElevator(targetFloor: number): ElevatorT | null {
    let nearestElevator: ElevatorT | null = null
    let minDistance: number = floorsCount.value

    elevators.value
      .filter((elevator: ElevatorT) => elevator.direction === null)
      .forEach((elevator: ElevatorT) => {
        const distance: number = Math.abs(targetFloor - elevator.currentFloor)

        if (distance < minDistance) {
          minDistance = distance
          nearestElevator = elevator
        }
      })
    nearestElevator? nearestElevator.targetFloor: null

    return nearestElevator
  }
  async function elevatorMoveTo(targetFloor: number, goingElevator?: ElevatorT | null) {
    let elevator: ElevatorT | null = null

    elevator = goingElevator ? goingElevator : findNearestElevator(targetFloor)

    while (!elevator) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      elevator = findNearestElevator(targetFloor)
    }

    if (elevator) {
      elevator.targetFloor = targetFloor
      elevator.direction = targetFloor > elevator.currentFloor ? 'Up' : 'Down'

      const elevatorDiv = document.getElementById(String(elevator.id + '-elevator'))
      const distance = Math.abs(targetFloor - elevator.currentFloor)

      if (elevatorDiv) {
        const direction = elevator.direction === 'Up' ? 1 : -1
        const duration: number = 1000 * distance

        elevatorDiv.classList.add('elevator--moving')
        elevatorDiv.style.transition = `bottom ${duration}ms ease-in-out`
        elevatorDiv.style.bottom = parseInt(getComputedStyle(elevatorDiv).bottom) + 150 * direction * distance + 'px'

        setTimeout(() => {
          floorsQueue.value = floorsQueue.value.filter((floor: number) => floor !== targetFloor)
          elevatorDiv.classList.remove('elevator--moving')
          elevatorDiv.style.transition = ''
          elevatorDiv.classList.add('elevator_doors--open')

          setTimeout(() => {
            if (elevator) {
              elevatorDiv.classList.remove('elevator_doors--open')
              elevator.direction = null
              elevator.currentFloor = targetFloor
              elevator.targetFloor = null
            }

            setTimeout(() => {
              if (
                !elevators.value.some((elevator: ElevatorT) => elevator.currentFloor === 1) &&
                !elevators.value.some((elevator: ElevatorT) => elevator.targetFloor === 1))
              {
                elevator? elevator.targetFloor = 1 : null
                elevatorMoveTo(1)
              }
            }, 1000)
          }, 3000)
        }, duration)
      }
    }
  }

  return {
    elevatorsCount,
    floorsCount,
    elevators,
    floorsQueue,
    callElevator,
    elevatorMoveTo,
  }
})