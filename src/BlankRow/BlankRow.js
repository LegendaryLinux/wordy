import React from 'react';
import './BlankRow.css';

export const BlankRow = ({numLetters, attempt}) => {
  const letterBoxes = [];
  for (let i=0; i<numLetters; i++){
    letterBoxes.push(
      <div key={`blank-${attempt}-${i}`} className="blank-cell" />
    );
  }

  return (
    <div className="blank-row">
      {letterBoxes}
    </div>
  );
};
