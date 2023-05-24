<script>
import SetOfCards from './components/SetOfCards.vue';

export default {
  data() {
    return {
      start: false,
      deck: null,
      hand: null,
      board: null,
      onBoard: 0,
      cards: null,
      pickCards: false,
      test: [
        ['J', '♥'],
        ['J', '♦'],
        ['J', '♠'],
        ['7', '♦'],
        ['7', '♥'],
      ],
    };
  },
  methods: {
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    },
    createDeck() {
      let values = [
        'A',
        'K',
        'Q',
        'J',
        '10',
        '9',
        '8',
        '7',
        '6',
        '5',
        '4',
        '3',
        '2',
      ];
      let suits = ['♥', '♠', '♦', '♣'];
      let deck = [];
      for (let i = 0; i < suits.length; i++) {
        for (let j = 0; j < values.length; j++) {
          let newCard = [values[j], suits[i]];
          deck.push(newCard);
        }
      }
      if (!this.pickCards) {
        this.shuffleArray(deck);
      }
      return deck;
    },
    selectCards(deck, amount) {
      let selected = [];
      while (selected.length < amount) {
        let idx = Math.floor(Math.random() * deck.length);
        selected.push(deck[idx]);
        deck.splice(idx, 1);
      }
      return selected;
    },
    formCardsArr() {
      return this.hand.concat(this.board.slice().splice(0, this.onBoard));
    },
    updateCards(e) {
      if (e.length === 0) {
        this.cards = null;
      } else {
        this.cards = [...e];
      }
    },
  },
  components: { SetOfCards },
};
</script>

<template>
  <div v-if="!start" class="flex flex-col justify-evenly h-screen">
    <div class="m-auto text-center font-bold">
      <h1
        class="text-white font-thin w-1/2 mx-auto bg-white rounded bg-opacity-5 p-5 portrait:w-full"
      >
        This is a Texas Hold'em Poker hands identifier, and a simple simulator.
        Designed for the purpose of learning Poker hands and getting familiar
        with the possibilities of their occurance through simulation. You can
        either pick cards from a full deck, or simulate rounds.
      </h1>
      <button @click="start = true" class="button mt-2">Start</button>
    </div>
  </div>
  <div v-else id="app" class="grid grid-cols-4 gap-1 portrait:grid-cols-1">
    <div id="buttons" class="flex flex-col my-auto">
      <button
        v-if="!pickCards"
        @click="
          pickCards = false;
          deck = createDeck();
          hand = selectCards(deck, 2);
          board = selectCards(deck, 5);
          onBoard = 0;
          cards = formCardsArr();
        "
        class="button w-1/2 mx-auto mt-2"
      >
        Deal
      </button>
      <button
        v-if="onBoard < 5 && deck && !pickCards"
        @click="
          onBoard += 2;
          cards = formCardsArr();
        "
        class="button w-1/2 mx-auto mt-2"
      >
        Reveal Cards
      </button>
      <button
        @click="
          pickCards = !pickCards;
          deck = createDeck();
          hand = null;
          board = null;
          cards = null;
          onBoard = 6;
        "
        v-text="pickCards ? 'Cancel' : 'Pick Cards'"
        class="button w-1/2 mx-auto mt-10"
      ></button>
    </div>
    <div
      v-if="!pickCards"
      id="game"
      class="bg-white bg-opacity-5 col-span-2 h-screen grid place-content-center"
    >
      <h1 class="text-white opacity-40" v-if="!cards">
        Select an option to start.
      </h1>
      <div id="board" class="flex justify-center flex-wrap">
        <SetOfCards :set="board" :revealed="onBoard" :pick="false"></SetOfCards>
      </div>
      <div id="hand" class="flex justify-center">
        <SetOfCards :set="hand" :revealed="2" :pick="false"></SetOfCards>
      </div>
    </div>
    <div v-else class="flex flex-wrap justify-center col-span-2 h-screen">
      <SetOfCards
        :set="deck"
        :revealed="52"
        :pick="true"
        @update="updateCards"
      ></SetOfCards>
    </div>
    <div id="information" class="my-auto ml-2">
      <Information :cards="cards"></Information>
    </div>
  </div>
</template>
