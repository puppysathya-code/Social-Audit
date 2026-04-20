import React from 'react';

const SectionCard = ({ badge, title, enTitle, delay, children, id }) => {
  return (
    <div 
      className="section-card" 
      style={{ animationDelay: `${delay}s` }}
      id={id}
    >
      <div className="section-header">
        <span className="section-badge">{badge}</span>
        <div className="section-title">
          {title}
          <span>{enTitle}</span>
        </div>
      </div>
      <div className="section-body">
        {children}
      </div>
    </div>
  );
};

export default SectionCard;
