import Deck from './Deck.js';

export default class Board {
  constructor() {

    
    this._tableau = [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
      // free cells begins here
    ];

    this._freeCells = [
      [],
      [],
      [],
      []
    ];

    this._foundations = [
      [],
      [],
      [],
      []
    ]

    this.populate();

    // Dom Elements
    this._pileName = ".pile";

    // used when a card is over a container
    this.overContainer = null;
  };

  populate() {
    let deck = new Deck();
    deck = deck.shuffle();
    while (deck.size() > 0) {
      let i = 0;
      while (i < 8) {
        let drawn_card = deck.draw();
        if(drawn_card) {
          this._tableau[i].push(drawn_card)
        }
        i++;
      }
    }
  };

  render() {
    
    this._tableau.forEach((pile, idx) => {
      // grab the pile container element at idx 
      let $pile = $(this._pileName).eq(idx);
      // remove all children dom elements
      $pile.empty();

      let self = this;

      $pile.droppable({
        drop: function(event, ui) {
          let _from = ui.helper[0].parentElement.getAttribute("idx")
          let to = event.target.attributes.idx.value
          self.handleMove(_from, to);
        }
      });

      // add a new element for each card in pile
      pile.forEach(card => {
        const {suit, value} = card;
        $pile.append(`<div val='${value}' suit='${suit}' class='card ${suit} ${value.toString()}'></div>`);
      })

      // spread the cards out nice and even
      $pile.children('.card').each((i, cardDiv) => {
        $(cardDiv).css('top', (i * 40).toString() + 'px');
      });

      // make the last card draggable
      let $lastCardElement = $pile.children('.card').last().draggable({
        drag: function(event, ui) {
          $(ui.helper[0]).addClass("is-dragging");
        },
        stop: function(event, ui) {
          $(ui.helper[0]).removeClass("is-dragging");
        },
        revert: true
      });

      let lastCardElement = $lastCardElement[0];
    });

    this._foundations.forEach((foundation, idx) => {
      const self = this;

      // get cell dom element
      let $foundationDom = $('.foundation').eq(idx);
      $foundationDom.empty();

      // attach event handlers for free cell drops
      $(".foundation").droppable({
        drop: function(event, ui) {
          let _from = ui.helper[0].parentElement.getAttribute("idx")
          let to = event.target.attributes.idx.value
          self.handleMove(_from, to);
        }
      });

      for(let j = 0; j < this._foundations[idx].length; j++) {
        const {suit, value} = this._foundations[idx][j];
        $foundationDom.append(`<div val='${value}' suit='${suit}' class='card ${suit} ${value.toString()}'></div>`);
        $($foundationDom[0]).children().draggable({
          drag: function(event, ui) {
            $(ui.helper[0]).addClass("is-dragging");
          },
          stop: function(event, ui) {
            $(ui.helper[0]).removeClass("is-dragging");
          },
          revert: true              
        })
      }
    });

    this._freeCells.forEach((freeCell, idx) => {
      const self = this;

      // get cell dom element
      let $freeCellDom = $('.free-cell').eq(idx);
      $freeCellDom.empty();

      // attach event handlers for free cell drops
      $(".free-cell").droppable({
        drop: function(event, ui) {
          let _from = ui.helper[0].parentElement.getAttribute("idx")
          let to = event.target.attributes.idx.value
          self.handleMove(_from, to);
        }
      });

      for(let j = 0; j < this._freeCells[idx].length; j++) {
        const {suit, value} = this._freeCells[idx][j];
        $freeCellDom.append(`<div val='${value}' suit='${suit}' class='card ${suit} ${value.toString()}'></div>`);
        $($freeCellDom[0]).children().draggable({
          drag: function(event, ui) {
            $(ui.helper[0]).addClass("is-dragging");
          },
          stop: function(event, ui) {
            $(ui.helper[0]).removeClass("is-dragging");
          },
          revert: true              
        })
      }
    });
  };

  handleMove(_from, to, numberOfCards) {
    if (this.isValidMove(_from, to)) {
      // if from tableau
      if (_from < 8) {
        var poppedCard = this._tableau[_from].pop();
      } else if (_from > 7 && _from < 12) {
        var poppedCard = this._freeCells[_from - 8].pop();
      } else {
        var poppedCard = this._foundations[_from - 12].pop();
      }
      
      if (to > 7 && to < 12) { // moving to a free cell
        this._freeCells[to - 8].push(poppedCard)
      } else if (to <= 7) { // moving to a tableau
        this._tableau[to].push(poppedCard)
      } else { // moving to a foundation
        this._foundations[to - 12].push(poppedCard)
      }
      this.render();
    }
  };

  isValidMove(_from, to) {
    if (to > 7 && to < 12 && this._freeCells[to - 8].length >= 1) { // moving to a cell
      return false;
    } else if (to >= 12) { // moving to a foundation
      let foundations = this._translateIndexToStack(to);
      let foundationStack = foundations[to - 12];
      
      let lastCardInFoundationStack = foundationStack[foundationStack.length - 1];

      
      let fromStack = this._translateIndexToStack(_from)[_from];
      let lastCardInFromStack = fromStack[fromStack.length - 1];
      console.log(lastCardInFromStack.value)
      if (lastCardInFoundationStack) {
        console.log(lastCardInFoundationStack.value)
      }
      if (foundationStack.length == 0 || lastCardInFoundationStack.value + 1 == lastCardInFromStack.value) {
        return true;
      } else { return false; }
    }
  };

  _translateIndexToStack(idx) {
    if (idx <= 7) {
      return this._tableau
    } else if (idx < 12) {
      return this._freeCells
    } else {
      return this._foundations
    }
  }



};