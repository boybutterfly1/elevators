import {defineStore} from 'pinia'
import {ref} from "vue"
import {ElevatorT} from "@/types/types"
export const useElevatorStore = defineStore('elevator', () => {
  const elevatorsCount = ref(3)
  const floorsCount = ref(10)
  const elevators = ref<ElevatorT[]>([])
  const floorsQueue = ref<number[]>([])

  async function callElevator(floor: number) {
    if (!elevators.value.some((elevator: ElevatorT) => elevator.targetFloor === floor)) {
      floorsQueue.value.push(floor)
      await elevatorMoveTo(floor)
    }

    if (!floorsQueue.value.includes(1) &&
      !elevators.value.some((elevator: ElevatorT) => elevator.currentFloor === 1 && elevator.targetFloor === null) &&
      !elevators.value.some((elevator: ElevatorT) => elevator.targetFloor === 1))
    {
      floorsQueue.value.push(1)
      await elevatorMoveTo(1)
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

        const updateFloor = setInterval(() => {
          if (elevator && elevator.targetFloor === null) return
          elevator ? elevator.currentFloor += direction : null

          if (elevator && elevator.currentFloor === targetFloor) {
            clearInterval(updateFloor)
          }
        }, 1000);

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
          }, 2500)
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