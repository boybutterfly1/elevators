<template>
  <div v-for="floor in floors" class="floor">
    <div v-for="shaft in elevatorStore.elevatorsCount" class="floor_shaft">
      <elevator
          v-if="floor === 1"
          :id="shaft"
      />
    </div>
    <div class="floor_properties">
        <span class="floor_properties_info">
          {{floor}}
        </span>
      <div
          class="floor_properties_btn"
          :class="{'floor_properties_btn--active' : elevatorStore.floorsQueue.includes(floor)}"
          @click="elevatorStore.callElevator(floor)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue"
import Elevator from "@/components/Elevator.vue";
import {useElevatorStore} from "@/stores/elevator";

const elevatorStore = useElevatorStore()
const floors = computed<number[]>(() => {
  let floors = []
  for (let i = 1; i <= elevatorStore.floorsCount; i++) {
    floors.push(i)
  }
  return floors.reverse()
})
</script>

<style lang="sass">
.floor
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