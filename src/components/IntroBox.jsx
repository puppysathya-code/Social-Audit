import React from 'react';
import { introContent } from '../constants/auditData';

const IntroBox = () => {
  return (
    <div className="container" style={{ paddingTop: '20px', paddingBottom: '0' }}>
      <div className="intro-box">
        <div className="intro-title">{introContent.title}</div>
        {introContent.body}
        <div className="intro-footer">{introContent.footer}</div>
      </div>
    </div>
  );
};

export default IntroBox;
