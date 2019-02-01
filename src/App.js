import React, { Component } from 'react';
import settings from './settings.js';
import './App.css';

import Debug from './Components/Debug.jsx';
import Board from './Components/Board.jsx';
import Timer from './Components/Timer.jsx';

function generateBoard() {
  let board = Array(settings.height).fill().map(arrElt => Array(settings.width).fill(0));
  let mineCount = Math.round(settings.height * settings.width * settings.fill);
  let minesLeft = mineCount;

  while (minesLeft > 0) {
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
      minesLeft--;
    }
  }
  return {
    board: board,
    mineCount: mineCount,
  };
}

class App extends Component {
  checkWin() {
    // console.log(`${this.state.flagCount} vs ${this.state.mineCount}`)
    if (this.state.flags.count === this.state.mineCount) {
      let isWin = true;
      Object.keys(this.state.flags.coords).forEach(curKey => {
        let curCoords = curKey.split('-');
        let row = curCoords[0];
        let col = curCoords[1];
        if (this.state.board[row][col] !== -1) {
          isWin = false;
        }
      });

      if (isWin === true) {
        this.setState({
          gameResult: 1
        }, () => {
          alert('win!');
        });
      }

    } else if (this.state.mineCount + this.state.clearedCount === settings.height * settings.width) {
      this.setState({
        gameResult: 1
      }, () => {
        alert('win!');
      });
    }
  }

  flood(row, col) {
    let visibilityCopy = JSON.parse(JSON.stringify(this.state.visibility));
    const board = this.state.board;

    let newVisibleCount = this.state.clearedCount;

    const recurse = function(r, c) {
      if (r < 0 || r > settings.height - 1 || c < 0 || c > settings.height - 1) {
        // console.log('out of bounds; return');
        return;
      } else if (visibilityCopy[r][c] === 0){
        // console.log(`cur: ${r}, ${c}`);
        visibilityCopy[r][c] = 1;
        newVisibleCount++;
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

    this.setState({
      visibility: visibilityCopy,
      clearedCount: newVisibleCount
    }, () => {
      this.checkWin();
    });
  }

  clickSquare(e, flag) {
    if (this.state.gameResult !== 0) {
      return;
    }

    const board = this.state.board;
    const row = Number(e.target.dataset.row);
    const col = Number(e.target.dataset.col);
    const value = board[row][col];

    if (value === -1) {
      let boardCopy = JSON.parse(JSON.stringify(board));
      boardCopy[row][col] = 'X';
      this.setState({
        gameResult: -1,
        board: boardCopy,
        visibility: Array(settings.height).fill(Array(settings.width).fill(1)),
        clearedCount: this.state.clearedCount + 1
      })
      return;
    }

    let visibilityCopy = JSON.parse(JSON.stringify(this.state.visibility));
    visibilityCopy[row][col] = 1;

    if (value === 0){
      this.flood(row, col);
    } else {
      this.setState({
        clearedCount: this.state.clearedCount + 1,
        visibility: visibilityCopy
      }, () => {
        this.checkWin();
      });
    }
  }

  addFlag(e) {
    e.preventDefault();

    if (this.state.gameResult !== 0) {
      return;
    }

    let {row, col} = e.target.dataset;
    let visibleCopy = JSON.parse(JSON.stringify(this.state.visibility));
    let cur = visibleCopy[row][col];
    let flagsCopy = JSON.parse(JSON.stringify(this.state.flags));

    if (cur === 0) { // add flag
      visibleCopy[row][col] = -1;
      flagsCopy.coords[`${row}-${col}`] = true;
      flagsCopy.count++;
    } else if (cur === -1){ // remove flag
      visibleCopy[row][col] = 0;
      delete flagsCopy.coords[`${row}-${col}`];
      flagsCopy.count--;
    }

    this.setState({
      visibility: visibleCopy,
      flags: flagsCopy
    }, () => {
      this.checkWin();
    });

    return;
  }

  constructor(props) {
    super(props);
    let boardData = generateBoard();
    this.state = {
      // i wasn't able to access generateBoard as a method of the class?
      board: boardData.board,
      mineCount: boardData.mineCount,
      flags: {count: 0, coords: {}},
      visibility: Array(settings.height).fill(Array(settings.width).fill(0)),
      gameResult: 0,
      clearedCount: 0
    }
    this.checkWin = this.checkWin.bind(this);
    this.clickSquare = this.clickSquare.bind(this);
    this.addFlag = this.addFlag.bind(this);
    this.flood = this.flood.bind(this);
  }

  render() {
    return (
      <div className={`App ${this.state.gameResult === 0 ? '' : this.state.gameResult === 1 ? 'win' : 'lose'}`}>
        <Timer gameEnded={this.state.gameResult} />
        <Board
          boardData={this.state.board}
          visibilityData={this.state.visibility}
          squareCb={this.clickSquare}
          flagCb={this.addFlag}
        />
        <Debug settings={settings} state={this.state}></Debug>
      </div>
    );
  }
}

export default App;
