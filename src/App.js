import React, { Component } from 'react';
import './App.css';

import settings from './settings.js';
import Board from './Components/Board.jsx';

function generateBoard() {
  let board = Array(settings.height).fill().map(arrElt => Array(settings.width).fill(0));

  let numMines = Math.round(settings.height * settings.width * settings.fill);

  while (numMines > 0) {
    let row = Math.round(Math.random() * settings.height);
    let col = Math.round(Math.random() * settings.width);

    if (board[row] && board[row][col] === 0) {
      for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for (let colOffset = -1; colOffset <= 1; colOffset++) {
          if (((row + rowOffset) >= 0 && (row + rowOffset) < settings.height) &&
              ((col + colOffset) >= 0 && (col + colOffset) < settings.width)
             ) {
            board[row + rowOffset][col + colOffset]++;
          }
        }
      }
      board[row][col] = -1;
      numMines--;
    }
  }
  return board;
}

class App extends Component {
  flood(row, col) {
    let visibilityCopy = JSON.parse(JSON.stringify(this.state.visibility));
    const board = this.state.board;

    const recurse = function(r, c) {
      if (r < 0 || r > settings.height - 1 || c < 0 || c > settings.height - 1) {
        console.log('out of bounds; return');
        return;
      } else if (visibilityCopy[r][c] === false){
        console.log(`cur: ${r}, ${c}`);
        visibilityCopy[r][c] = true;
        if (board[r][c] === 0) {
          for (let rowIdx = -1; rowIdx <= 1; rowIdx++) {
            for (let colIdx = -1; colIdx <= 1; colIdx++) {
              if (!(rowIdx === 0 && colIdx === 0)) {
                recurse(r + rowIdx, c + colIdx);
              }
            }
          }
        }
      }
    }

    recurse(row, col);

    // alert('setstate')
    // debugger;
    console.log(visibilityCopy)
    this.setState({visibility: visibilityCopy});
  }

  clickSquare(e) {
    const board = this.state.board;
    const row = Number(e.target.dataset.row);
    const col = Number(e.target.dataset.col);
    const value = board[row][col];

    if (value === -1) {
      alert('boom');
      this.setState({
        gameEnd: true
      })
      return;
    }

    let visibilityCopy = JSON.parse(JSON.stringify(this.state.visibility));
    visibilityCopy[row][col] = true;

    if (value === 0){
      this.flood(row, col);
    } else {
      this.setState({visibility: visibilityCopy});
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      // i wasn't able to define generateBoard as a method of the class?
      board: generateBoard(),
      visibility: Array(settings.height).fill(Array(settings.width).fill(false)),
      gameEnd: false
    }
    this.clickSquare = this.clickSquare.bind(this);
    this.flood = this.flood.bind(this);
  }

  render() {
    // console.log(this.state.board)
    return (
      <div className="App">
        <Board boardData={this.state.board} visibilityData={this.state.visibility} squareCb={this.clickSquare}/>
      </div>
    );
  }
}

export default App;
