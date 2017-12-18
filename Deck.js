import Card from './Card.js';

export default class Deck {
  constructor() {
    const SUITS = ['clubs', 'diamonds', 'spades', 'hearts'];
    const VALUES = Array.apply(null, Array(13)).map(function(e, i) { return i + 1 });

    // Create a deck of 52 cards
    this._deck = []

    SUITS.forEach(function(suit) {
      VALUES.forEach(function(value) {
        this._deck.push(new Card(suit, value));
      }.bind(this));
    }.bind(this));

  }

  shuffle() {
    this._deck = _.shuffle(this._deck);
    return this;
  }

  draw() {
    return this._deck.pop();
  }

  size() {
    return this._deck.length;
  }

}


