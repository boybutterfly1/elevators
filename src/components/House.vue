<template>
  <div class="house">
    <floor/>
  </div>
</template>

<script setup lang="ts">
import {onMounted, watch} from "vue"
import {useElevatorStore} from "@/stores/elevator";
import {ElevatorT} from "@/types/types";
import Floor from "@/components/Floor.vue";

const elevatorStore = useElevatorStore()

onMounted(() => {
  const floorsQueueLS: number[] = JSON.parse(String(localStorage.getItem('floorsQueue')))
  const elevatorsLS: ElevatorT[] = JSON.parse(String(localStorage.getItem('elevators')))

  if (floorsQueueLS) {
    elevatorStore.floorsQueue = floorsQueueLS
  }

  if (elevatorsLS) {
    elevatorStore.elevators = elevatorsLS
  } else {
    for (let i = 1; i <= elevatorStore.elevatorsCount; i++) {
      elevatorStore.elevators.push({
        id: i,
        currentFloor: 1,
        targetFloor: null,
        direction: null,
      })
    }
  }

  elevatorStore.elevators.forEach((elevator: ElevatorT) => {
    const elevatorDiv = document.getElementById(elevator.id + '-elevator')
    if (elevatorDiv) {
      elevatorDiv.style.bottom = 150 * (elevator.currentFloor - 1) + 'px'
    }
    if (elevator.targetFloor) {
      elevatorStore.elevatorMoveTo(elevator.targetFloor, elevator)
    }
  })
})

watch(() => (elevatorStore.elevators), () => {
  localStorage.setItem('elevators', JSON.stringify(elevatorStore.elevators))
}, {deep: true})
watch(() => (elevatorStore.floorsQueue), () => {
  localStorage.setItem('floorsQueue', JSON.stringify(elevatorStore.floorsQueue))
}, {deep: true})
</script>

<style lang="sass">
.house
  margin: 70px 100px
  display: flex
  flex-direction: column
  min-width: 300px
  background-color: #fdf3de
</style>