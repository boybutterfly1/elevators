<template>
  <div class="house">
    <floor
        v-for="floor in floors"
        :floor="floor"
    />
  </div>
</template>

<script setup lang="ts">
import {computed, onBeforeMount, onMounted, onUpdated, watch} from "vue"
import {useElevatorStore} from "@/stores/elevator";
import Floor from "@/components/Floor.vue";
import {ElevatorT} from "@/types/types";

const elevatorStore = useElevatorStore()
const floors = computed<number[]>(() => {
  let floors = []
  for (let i = 1; i <= elevatorStore.floorsCount; i++) {
    floors.push(i)
  }
  return floors.reverse()
})

onMounted(() => {
  const floorsQueueLS: number[] = JSON.parse(String(localStorage.getItem('floorsQueue')))
  const elevatorsLS: ElevatorT[] = JSON.parse(String(localStorage.getItem('elevators')))

  if (floorsQueueLS) {
    elevatorStore.floorsQueue = floorsQueueLS
    elevatorStore.floorsQueue.forEach(floor => {
      elevatorStore.elevatorMoveTo(floor)
    })
  }

  if (elevatorsLS) {
    elevatorStore.elevators = elevatorsLS
    elevatorStore.elevators.forEach((elevator: ElevatorT) => {
      const elevatorDiv = document.getElementById(elevator.id + '-elevator')
      if (elevatorDiv) {
        elevatorDiv.style.bottom = 150 * (elevator.currentFloor - 1) + 'px'
      }
      if (elevator.targetFloor) {
        elevatorStore.elevatorMoveTo(elevator.targetFloor, elevator)
      }
    })
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