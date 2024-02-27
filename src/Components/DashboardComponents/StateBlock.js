// components/StateBlock.js
import React from 'react';

const StateBlock = ({ stateName, quantity, onClick }) => {
  return (
    <div
      className="state-block"
      onClick={onClick}
    >
      <div className="state-name">{stateName}</div>
      <div className="quantity">{quantity}</div>
    </div>
  );
};

export default StateBlock;
