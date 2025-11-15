import React, { useEffect, useState } from 'react';
import './Intro.css';
import backgroundVideo from './assets/eye.mp4';

const Intro = ({ onIntroComplete }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 500);
    const introTimer = setTimeout(() => {
      onIntroComplete();
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(introTimer);
    };
  }, [onIntroComplete]);

  return (
    <div className={`intro-container ${animate ? 'animate' : ''}`}>
      <div className="intro-content">
        <h1 className="intro-text">CodeClash — Collaborative Editor</h1>
        <p className="intro-subtext">
          A professional, real-time collaborative coding environment with AI-assisted insights. Start or join a room to code together — Python-first, with seamless collaboration and clear, concise tooling.
        </p>
      </div>
      <div className="background-overlay"></div>
    </div>
  );
};

export default Intro;