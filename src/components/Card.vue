<script>
export default {
  data() {
    return {};
  },
  props: ['val', 'suit'],
  methods: {
    determineClass() {
      if (this.suit === '♠' || this.suit === '♣') {
        return 'text-black';
      } else {
        return 'text-red-700';
      }
    },
  },
};
</script>
<template>
  <div v-if="!val && !suit" class="card grid hidden-card">
    <h1 class="m-auto text-5xl">⃟</h1>
  </div>
  <div v-else class="card grid" :class="determineClass()">
    <div class="flex">
      <h1 v-text="val" class="text font-bold"></h1>
      <h1 v-text="suit"></h1>
    </div>
    <div class="mx-auto text-5xl">
      <h1 v-text="suit"></h1>
    </div>
    <div class="flex rotate-180">
      <h1 v-text="val" class="text font-bold"></h1>
      <h1 v-text="suit"></h1>
    </div>
  </div>
</template>
