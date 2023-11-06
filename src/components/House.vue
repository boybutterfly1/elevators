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
  if (JSON.parse(String(localStorage.getItem('elevators')))) {
    elevatorStore.elevators = JSON.parse(String(localStorage.getItem('elevators')))
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

watch(() => elevatorStore.elevators, () => {
  localStorage.setItem('elevators', JSON.stringify(elevatorStore.elevators))
}, {deep: true})
</script>

<style lang="sass">
.house
  margin: 70px 50px
  display: flex
  flex-direction: column
  min-width: 300px
  background-color: #fdf3de
  &_floor
    padding: 0 50px
    display: flex
    justify-content: space-between
    height: 150px
    width: 100%
    outline: 3px solid #171210
    gap: 20px
    &_properties
      display: flex
      flex-direction: column
      width: 30px
      align-items: center
      &_btn
        margin-top: 40px
        width: 20px
        height: 20px
        background-color: #ffc600
        border: 3px solid #b0b0b0
        border-radius: 50%
        cursor: pointer
        transition: all 0.5s
      &_btn--active
        margin-top: 40px
        width: 20px
        height: 20px
        background-color: green
        border: 3px solid #b0b0b0
        border-radius: 50%
        cursor: wait
        transition: all 0.5s
      &_info
        margin-top: 30px
        background-color: white
        padding: 0 5px
        border: 1px solid black
    &_shaft
      background-color: #171210
      height: 150px
      min-width: 70px
      margin-right: 5px
      display: flex
      align-items: flex-end
</style>