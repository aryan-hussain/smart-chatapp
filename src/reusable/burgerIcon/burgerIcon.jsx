import React, { useState } from 'react';
import './BurgerIcon.scss'; // Import CSS for the animation

const BurgerIcon = ({isOpen, toggleMenu }) => {
  return (
    <div className={`burger-icon ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
      <div className="line"></div>
      <div className="line"></div>
      <div className="line"></div>
    </div>
  );
};

export default BurgerIcon;
