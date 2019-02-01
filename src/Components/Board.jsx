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
  border: 1px solid #aaa;
  cursor: pointer;
  font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
  font-weight: 300;
  color: #ddd;
`;


const Board = props => {
  let boardData = props.boardData || [];
  let visibilityData = props.visibilityData || [];

  return (
    <BoardElt>
      {boardData.map((rowArr, rowIdx) => (
        <Row key={`R${rowIdx}`}>
          {rowArr.map((square, colIdx) => {
            let value = boardData.length > 0 ? rowArr[colIdx] : '';
            return (
              <Square
                key={`${rowIdx}-${colIdx}`}
                data-row={rowIdx}
                data-col={colIdx}
                onClick={e => props.squareCb(e)}
                className={`square${visibilityData[rowIdx][colIdx] ? ' show': ''}`}
                >
                  {value}
              </Square>
            )
          })}
        </Row>
      ))}
    </BoardElt>
  )
}

export default Board;
