import {defineStore} from 'pinia'
import {ref} from "vue"
import {ElevatorT} from "@/types/types"
export const useElevatorStore = defineStore('elevator', () => {
  const elevatorsCount = ref(3)
  const floorsCount = ref(10)
  const elevators = ref<ElevatorT[]>([])
  const floorsQueue = ref<number[]>([])

  function callElevator(floor: number) {
    floorsQueue.value.push(floor)
    elevatorMoveTo(floor, findNearestElevator(floor))
  }
  function findNearestElevator(targetFloor: number): ElevatorT | null {
    let nearestElevator : ElevatorT | null = null
    let minDistance: number = floorsCount.value * 2

    elevators.value.filter((elevator: ElevatorT) => elevator.direction === null).forEach((elevator: ElevatorT) => {
      if (Math.abs(targetFloor - elevator.currentFloor) < minDistance) {
        minDistance = Math.abs(targetFloor - elevator.currentFloor)
        nearestElevator = elevator
      }
    })

    return nearestElevator
  }
  function elevatorMoveTo(targetFloor: number, elevator: ElevatorT | null) {
    if (elevator) {
      elevator ? elevator.targetFloor = targetFloor : null
      elevator.direction = targetFloor > elevator.currentFloor ? 'Up' : 'Down'

      const elevatorDiv = document.getElementById(String(elevator.id + '-elevator'))
      const distance = Math.abs(targetFloor - elevator.currentFloor)

      if (elevatorDiv) {
        const direction = elevator.direction === 'Up' ? 1 : -1
        const duration = 1000 * distance

        elevatorDiv.classList.add('elevator--moving')
        elevatorDiv.style.transition = `bottom ${duration}ms ease-in-out`
        elevatorDiv.style.bottom = parseInt(getComputedStyle(elevatorDiv).bottom) + 150 * direction * distance + 'px'

        setTimeout(() => {
          elevatorDiv.classList.remove('elevator--moving')
          elevatorDiv.style.transition = ''
          elevatorDiv.classList.add('elevator_doors--open')

          setTimeout(() => {
            elevatorDiv.classList.remove('elevator_doors--open')
            elevator.direction = null
            elevator.currentFloor = targetFloor
            elevator.targetFloor = null
            floorsQueue.value = floorsQueue.value.filter(floor => floor !== targetFloor)

            setTimeout(() => {
              if (!floorsQueue.value.length &&
                  !elevators.value.some((elevator: ElevatorT) => elevator.currentFloor === 1) &&
                  !elevators.value.some((elevator: ElevatorT) => elevator.targetFloor === 1))
              {
                elevator.targetFloor = 1
                elevatorMoveTo(1, findNearestElevator(1))
              }
            }, 1000)
          }, 1000)
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