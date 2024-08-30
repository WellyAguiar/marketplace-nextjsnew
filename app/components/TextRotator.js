import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import TextPlugin from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

const TextRotator = ({ texts, interval = 3000, Tag = 'div', className = '' }) => {
  const textRef = useRef(null);
  const index = useRef(0);

  useEffect(() => {
    const rotateText = () => {
      index.current = (index.current + 1) % texts.length;
      gsap.to(textRef.current, {
        duration: 1,
        text: { 
            value: texts[index.current],
            padSpace: true,
         },
        ease: 'none',
      });
    };

    const intervalId = setInterval(rotateText, interval);
    return () => clearInterval(intervalId);
  }, [texts, interval]);

  return <Tag ref={textRef} className={className}>{texts[0]}</Tag>;
};

export default TextRotator;
