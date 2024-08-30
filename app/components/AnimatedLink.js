import React, { useRef } from 'react';
import gsap from 'gsap';
import TextPlugin from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

const AnimatedLink = ({ text = "", href = "#", hoveredText = "" }) => {
  const linkRef = useRef(null);

  const handleMouseEnter = () => {
    gsap.to(linkRef.current, {
      duration: 0.5,
      color: 'red',
      scale: 1.1,
      text: {
        value: hoveredText,
        delimiter: '',
        padSpace: true,
      }
    });
  };

  const handleMouseLeave = () => {
    gsap.to(linkRef.current, {
      duration: 0.5,
      color: 'black',
      scale: 1,
      text: {
        value: text,
        delimiter: '',
        padSpace: true,
      }
    });
  };

  return (
    <a
      href={href}
      ref={linkRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="cursor-pointer"
      style={{ color: 'black', display: 'inline-block', transition: 'color 0.3s' }}
    >
      {text}
    </a>
  );
};

export default AnimatedLink;
