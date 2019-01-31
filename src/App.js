import React, { Component } from 'react';
import './App.css';

import settings from './settings.js';
import Board from './Components/Board.jsx';

function generateBoard() {
  return Array(settings.height).fill().map(arrElt => Array(settings.width).fill().map(() => (Math.random() < settings.fill) ? -1 : 0));
}

class App extends Component {

  clickSquare(e) {
    const board = this.state.board;
    const row = Number(e.target.dataset.row);
    const col = Number(e.target.dataset.col);
    if (board[row][col] === -1) {
      alert('boom');
    } else {
      let area = board.slice(row > 0 ? row - 1 : 0, row + 2)
                      .map(
                        rowArr => rowArr.slice(col > 0 ? col - 1 : 0, col + 2)
                      );
      let boardCopy = JSON.parse(JSON.stringify(board));
      let mineCount = -area.reduce((total, curRow) => (curRow.reduce((acc, cur) => acc + (Number(cur) < 0 ? Number(cur) : 0), 0) + total), 0);
      boardCopy[row][col] = mineCount || null;
      this.setState({board: boardCopy});
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      // i wasn't able to define generateBoard as a method of the class?
      board: generateBoard()
    }
    this.clickSquare = this.clickSquare.bind(this);
  }

  render() {
    // console.log(this.state.board)
    return (
      <div className="App">
        <Board boardData={this.state.board} squareCb={this.clickSquare}/>
      </div>
    );
  }
}

export default App;
