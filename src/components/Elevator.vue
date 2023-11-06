<template>
  <div
      class="elevator"
      :id="props.id + '-elevator'"
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
import {watch} from "vue";

const props = defineProps<{
  id: number
}>()


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