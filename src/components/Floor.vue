<template>
  <div
      class="floor"
      :id="props.floor + '-floor'"
  >
    <div v-for="shaft in elevatorStore.elevatorsCount" class="floor_shaft">
      <elevator
          v-if="props.floor === 1"
          :id="shaft + '-elevator'"
      />
    </div>
    <div class="floor_properties">
        <span class="floor_properties_info">
          {{props.floor}}
        </span>
      <div
          class="floor_properties_btn"
          :class="{'floor_properties_btn--active' : elevatorStore.floorsQueue.includes(props.floor)}"
          @click="elevatorStore.callElevator(props.floor)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Elevator from "@/components/Elevator.vue";
import {useElevatorStore} from "@/stores/elevator";
import {onMounted} from "vue";

const props = defineProps<{ floor: number }>()
const elevatorStore = useElevatorStore()

// onMounted(() => {
//   const floorElement = document.getElementById(props.floor + '-floor')
//
//   const handleIntersection = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
//     entries.forEach((entry) => {
//       if (entry.isIntersecting) {
//         console.log(entry.target.id)
//       }
//     })
//   }
//   const observer = new IntersectionObserver(handleIntersection, {
//     root: null,
//     rootMargin: '0px',
//     threshold: 0.025
//   });
//   floorElement ? observer.observe(floorElement) : null
// })
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