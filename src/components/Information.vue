<script>
export default {
  data() {
    return {
      hands: [
        'Royal Flush',
        'Straight Flush',
        'Four of a Kind',
        'Full House',
        'Flush',
        'Straight',
        'Three of a Kind',
        'Two Pair',
        'Pair',
        'High Card',
      ],
      validHands: {},
    };
  },
  props: ['cards'],
  watch: {
    cards: function () {
      if (this.cards) {
        this.validHands = []; // Reset, declare vars
        let len = this.cards.length;
        let suits = { Hearts: 0, Spades: 0, Diamonds: 0, Clubs: 0 };
        let values = [];
        let suitConversion = {
          Hearts: '♥',
          Spades: '♠',
          Diamonds: '♦',
          Clubs: '♣',
        };
        let conversion = {
          J: 11,
          Q: 12,
          K: 13,
          A: 14,
        };
        let convertedCards = [];
        // Get info
        for (let i = 0; i < len; i++) {
          let value = this.cards[i][0];
          if (value in conversion) {
            values.push(conversion[value]);
            convertedCards.push([conversion[value], this.cards[i][1]]);
          } else {
            values.push(parseInt(value));
            convertedCards.push([parseInt(value), this.cards[i][1]]);
          }
          switch (this.cards[i][1]) {
            case '♥':
              suits['Hearts']++;
              break;
            case '♠':
              suits['Spades']++;
              break;
            case '♦':
              suits['Diamonds']++;
              break;
            case '♣':
              suits['Clubs']++;
              break;
          }
        }
        convertedCards.sort((a, b) => b[0] - a[0]);
        values.sort((a, b) => b - a);
        // Check for same value cards on hand
        let pairs = 0;
        let trips = 0;
        for (let i = 0; i < len; i++) {
          let count = 0;
          let store = values[i];
          if (store > 10) {
            store = Object.keys(conversion).find(
              (key) => conversion[key] === store
            );
          }
          for (let j = i + 1; j < len; j++) {
            if (values[i] === values[j]) {
              count++;
            }
          }
          if (count === 1) {
            if (pairs === 0) {
              this.validHands['Pair'] = `Double ${store}'s`; // A Pair
              pairs++;
            } else if (!this.validHands['Two Pair']) {
              this.validHands[
                'Two Pair'
              ] = `${this.validHands['Pair']} and Double ${store}'s`; // Two Pairs
              pairs++;

              if (trips != 0 && !this.validHands['Full House']) {
                this.validHands['Full House'] = `${
                  this.validHands['Three of a Kind']
                } and ${this.validHands['Two Pair'].replace(
                  this.validHands['Pair'],
                  ''
                )}`; // Full House
                console.log('1');
              }
            }
          } else if (count === 2 && !this.validHands['Three of a Kind']) {
            this.validHands['Three of a Kind'] = `Triple ${store}'s`; // Three of a Kind
            trips++;
            if (pairs != 0 && !this.validHands['Full House']) {
              this.validHands[
                'Full House'
              ] = `${this.validHands['Three of a Kind']} and ${this.validHands['Pair']}`; // Full House
              console.log('2');
            }
          } else if (count === 3) {
            this.validHands['Four of a Kind'] = `Four ${store}'s`; // Four of a Kind
          }
          count = 0;
        }
        // Count straight sequences
        let straight = 0;
        let store = 0; // Store the lowest value to display info--count five up
        // Two cursors
        for (let i = 1, j = 0; i < len; i++) {
          // Sequence is found
          if (values[j] - 1 === values[i]) {
            straight++;
            if (straight === 4) {
              store = values[i] + 4;
              break;
            }
            j++;
            // Not valid sequence but not broken
          } else if (values[j] === values[i]) {
            j++;
          } else {
            // Sequence broken, reset counter
            straight = 0;
            j++;
          }
        }
        if (straight >= 4) {
          let s = '';
          for (let i = 5; i > 0; i--) {
            if (store > 10) {
              let char = Object.keys(conversion).find(
                (key) => conversion[key] === store
              );
              if (i === 1) {
                s += `and ${char}`;
              } else {
                s += ` ${char}, `;
                store--;
              }
            } else {
              if (i === 1) {
                s += `and ${store}`;
              } else {
                s += ` ${store}, `;
                store--;
              }
            }
          }
          this.validHands['Straight'] = s; // Straight
        }

        let high = Math.max(...values);
        if (high > 10) {
          high = Object.keys(conversion).find(
            (key) => conversion[key] === high
          );
        }
        this.validHands['High Card'] = high; // High Card

        let flush = Math.max(...Object.values(suits));
        if (flush >= 5) {
          this.validHands['Flush'] = `${flush} ${Object.keys(suits).find(
            (key) => suits[key] === flush // Flush
          )}`;
        }

        let flushSuit =
          suitConversion[
            Object.keys(suits).find(
              (key) => suits[key] === flush // Flush
            )
          ];

        for (let i = 0; i < convertedCards.length; i++) {
          if (convertedCards[i][1] != flushSuit) {
            convertedCards.splice(i, 1);
          }
        }

        // Check for straight flush and royal flush
        if (this.validHands['Flush'] && this.validHands['Straight']) {
          let straightFlush = [];
          for (let i = 0; i < convertedCards.length; i++) {
            let value = convertedCards[i][0];
            let suit = convertedCards[i][1];
            for (let j = i + 1; j < convertedCards.length; j++) {
              if (
                convertedCards[j][1] === suit &&
                convertedCards[j][0] === value - 1
              ) {
                if (straightFlush.length === 0) {
                  straightFlush.push(convertedCards[i]);
                }
                straightFlush.push(convertedCards[j]);
                i = j - 1;
                break;
              }
              if (straightFlush.length >= 5) {
                break;
              } else {
                straightFlush = [];
              }
            }
          }
          if (straightFlush.length >= 5) {
            let suit = this.validHands['Flush'].replace(/[0-9]/g, '');
            this.validHands[
              'Straight Flush'
            ] = `${this.validHands['Straight']} of ${suit}`; // Straight Flush
            if (straightFlush[0].includes(14)) {
              this.validHands[
                'Royal Flush'
              ] = `${this.validHands['Straight']} of ${suit}`; // Royal Flush
            }
          }
        }
      }
    },
  },
};
</script>
<template>
  <div v-if="cards">
    <template v-for="hand in hands">
      <h1
        v-if="validHands.hasOwnProperty(hand)"
        v-text="`${hand}: ${validHands[hand]}`"
        class="text-green-500 font-thin"
      ></h1>
      <h1 v-else class="text-red-500 font-thin">
        {{ hand }}
      </h1>
    </template>
  </div>
</template>
