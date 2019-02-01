import React from 'react';
import styled from 'styled-components';

const DebugElt = styled.div`
  background-color:#999;
  display:block;
  font-size: 0.9em;
  margin-left: 1em;
  padding: 0.5em;
  width: 120px;
`;


const Debug = props => (
  <DebugElt id="debug">
    mineCount: {props.state.mineCount}<br/>
    cleared: {props.state.clearedCount} of {props.settings.width * props.settings.height - props.state.mineCount}<br/>
    total: {props.settings.width * props.settings.height}<br/>
    percentage: {(props.state.clearedCount + props.state.mineCount) / props.settings.width * props.settings.height}%
  </DebugElt>
)

export default Debug;
