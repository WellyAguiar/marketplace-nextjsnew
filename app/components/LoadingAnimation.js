"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function LoadingAnimation() {
  const loadingRef = useRef();
  const dotsRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        loadingRef.current,
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        }
      );

      gsap.fromTo(
        dotsRef.current.children,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          stagger: {
            each: 0.5,
            yoyo: true,
            repeat: -1,
            repeatDelay: 0.5,
          },
          ease: "power1.inOut",
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50">
      <div className="text-center">
        <div
          ref={loadingRef}
          className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-4"
        ></div>
        <div className="text-lg font-semibold text-purple-500">
          Carregando
          <span ref={dotsRef} className="inline-block">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </div>
      </div>
    </div>
  );
}
