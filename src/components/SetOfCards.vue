<script>
export default {
  data() {
    return {
      picked: [],
    };
  },
  emits: ['update'],
  methods: {
    select(card) {
      if (this.picked.includes(card)) {
        this.picked.splice(this.picked.indexOf(card), 1);
      } else if (this.picked.length < 7) {
        this.picked.push(card);
      } else {
        this.picked.shift();
        this.picked.push(card);
      }
      this.$emit('update', this.picked);
    },
  },

  props: ['set', 'revealed', 'pick'],
};
</script>
<template>
  <div class="flex flex-wrap justify-center">
    <template v-if="!pick" v-for="(card, idx) in set">
      <Card v-if="idx < revealed" :val="card[0]" :suit="card[1]"></Card>
      <Card v-else></Card>
    </template>
    <template v-else v-for="(card, idx) in set">
      <Card
        v-if="!picked.includes(card)"
        @click="select(card)"
        class="allow-picking"
        :val="card[0]"
        :suit="card[1]"
      ></Card>
      <Card
        v-else
        @click="select(card)"
        class="allow-picking picked-card"
        :val="card[0]"
        :suit="card[1]"
      ></Card>
    </template>
  </div>
</template>
