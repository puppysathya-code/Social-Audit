import React from 'react';

const ProgressBar = ({ progress, currentSection }) => {
  return (
    <div className="progress-wrap">
      <div className="progress-label">
        <span id="progress-text">{currentSection}</span>
        <span id="progress-pct">{progress}%</span>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          id="progress-fill" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
