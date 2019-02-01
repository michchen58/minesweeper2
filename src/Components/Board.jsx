import React from 'react';
import styled from 'styled-components';
import settings from '../settings.js';

const BoardElt = styled.div`
  font-size:0;
  display:flex;
  flex-direction: column;
`;

const Row = styled.div`
  padding:0;
  margin:0px;
  display:flex;
  flex-direction: row;
`;

const Square = styled.div`
  font-size: ${Math.round(settings.square.size * settings.square.fontPerc)}px;
  width: ${settings.square.size}px;
  height: ${settings.square.size}px;
  display:flex;
  flex-direction: column;
  justify-content:center;
  text-align:center;
  border: ${Math.round(settings.square.size * 0.1)}px solid;
  border-top-color: #ffffff;
  border-right-color: #7B7B7B;
  border-bottom-color: #7B7B7B;
  border-left-color: #ffffff;
  background-color: #B9B9B9;
  cursor: pointer;
  font-weight: 300;
  color: #ddd;
`;

const Board = props => {
  let boardData = props.boardData || [];
  let visibilityData = props.visibilityData || [];

  return (
    <BoardElt id="board">
      {boardData.map((rowArr, rowIdx) => (
        <Row key={`R${rowIdx}`}>
          {rowArr.map((square, colIdx) => {
            let value = boardData.length > 0 ? rowArr[colIdx] : '';
            return (
              <Square
                className={`square ${visibilityData[rowIdx][colIdx] ? 'show': ''} ${boardData[rowIdx][colIdx] === 'X' ? 'boom': ''}`}
                data-row={rowIdx} data-col={colIdx}
                onClick={e => props.squareCb(e)}
                onContextMenu={e => props.flagCb(e, true)}
                key={`${rowIdx}-${colIdx}`}
                >
                  {visibilityData[rowIdx][colIdx]=== true ? value || null: ''}
              </Square>
            )
          })}
        </Row>
      ))}
    </BoardElt>
  )
}

export default Board;
