<template>
  <div
      class="elevator"
      :id="props.id"
  >
    <div
        class="elevator_doors"
    >
      <div class="elevator_doors_left"/>
      <div class="elevator_doors_right"/>
    </div>
  </div>
</template>

<script setup lang="ts">

import {ElevatorT} from "@/types/types";
import {onMounted} from "vue";
import {useElevatorStore} from "@/stores/elevator";

const props = defineProps<{
  id: string
}>()
const elevatorStore = useElevatorStore()

// onMounted(() => {
//   const elevatorsLS: ElevatorT[] = JSON.parse(String(localStorage.getItem('elevators')))
//   const elevatorElement = document.getElementById(props.id)
//   const elevator = elevatorsLS.find((elevator: ElevatorT) => elevator.id === parseInt(props.id))
//   if (elevatorElement && elevator) {
//     elevatorElement.style.bottom = 150 * (elevator.currentFloor - 1) + 'px'
//   }
//   if (elevator && elevator.targetFloor) {
//     elevatorStore.elevatorMoveTo(elevator.targetFloor, elevator)
//   }
// })
</script>

<style lang="sass">
.elevator
  position: relative
  bottom: 0
  width: 70px
  height: 100px
  background-color: #ffe080
  &_doors
    display: flex
    &_left, &_right
      width: 35px
      height: 100px
      background-color: #cccccc
      border: 1px solid #171210
      transition: margin-right 0.5s, width 0.5s
.elevator_doors--open
  display: flex
  .elevator_doors_left
    margin-right: 60px
    width: 5px
  .elevator_doors_right
    width: 5px
.elevator--moving
  transition-timing-function: linear
  .elevator_doors
    .elevator_doors_left
    .elevator_doors_right
</style>